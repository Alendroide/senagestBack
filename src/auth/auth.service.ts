import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwtPayload';
import { Modulo } from './types/Modulo';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async login(data: LoginDto): Promise<any> {
    // Buscar el usuario
    const user = await this.prismaService.usuario.findUnique({
      where: { correo: data.correo, estado: true },
      select: {
        id: true,
        identificacion: true,
        correo: true,
        img: true,
        rolId: true,
        primerNombre: true,
        primerApellido: true,
        contrasena: true
      },
    });

    // Validaciones
    if (!user)
      throw new HttpException(
        { status: 404, message: 'User not found.' },
        HttpStatus.NOT_FOUND,
      );

    // Comparar contraseñas
    if (!(await this.comparePasswords(data.contrasena, user.contrasena)))
      throw new HttpException(
        { status: 401, message: 'Wrong password. Please try again.' },
        HttpStatus.UNAUTHORIZED,
      );

    const payload: JwtPayload = {
      sub: user.id,
      identificacion: `${user.identificacion}`,
      correo: user.correo,
      img: user.img,
      rol: user.rolId ?? undefined,
      nombre: `${user.primerNombre} ${user.primerApellido}`
    }

    const modulos: Modulo[] | undefined = user.rolId ? await this.prismaService.modulo.findMany({
      where: {
        rutas: {
          some: {
            permisos: {
              some: {
                roles: {
                  some: {
                    rolId: user.rolId,
                    valor: true, // para que solo permisos activos
                    rol: {
                      estado: true
                    }
                  }
                }
              }
            }
          }
        },
        estado: true
      },
      select: {
        id: true,
        nombre: true,
        icono: true,
        rutas: {
          where: {
            permisos: {
              some: {
                roles: {
                  some: {
                    rolId: user.rolId,
                    valor: true,
                  }
                }
              }
            },
            estado: true
          },
          select: {
            id: true,
            nombre: true,
            ruta: true,
            permisos: {
              where: {
                roles: {
                  some: {
                    rolId: user.rolId,
                    valor: true,
                  }
                },
                estado: true
              },
              select: {
                id: true,
                nombre: true,
                tipo: true,
              }
            }
          }
        }
      }
    }) : undefined;

    // Retornar JWT
    return { status: 200, message: "Login successful", access_token: this.jwtService.sign(payload), modulos };
  }

  async refetchPermisos(rolId?: number){
    const modulos: Modulo[] | undefined = rolId ? await this.prismaService.modulo.findMany({
      where: {
        rutas: {
          some: {
            permisos: {
              some: {
                roles: {
                  some: {
                    rolId: rolId,
                    valor: true,
                    rol: {
                      estado: true
                    }
                  }
                }
              }
            }
          }
        },
        estado: true
      },
      select: {
        id: true,
        nombre: true,
        icono: true,
        rutas: {
          where: {
            permisos: {
              some: {
                roles: {
                  some: {
                    rolId: rolId,
                    valor: true,
                  }
                }
              }
            },
            estado: true
          },
          select: {
            id: true,
            nombre: true,
            ruta: true,
            permisos: {
              where: {
                roles: {
                  some: {
                    rolId: rolId,
                    valor: true,
                  }
                },
                estado: true
              },
              select: {
                id: true,
                nombre: true,
                tipo: true,
              }
            }
          }
        }
      }
    }) : undefined;

    return { status: 200, message: "User permisos fetched successfully", modulos };
  }

  async sendEmail(email: string, subject: string, html: string) {
    const transporter = nodemailer.createTransport({
      service: this.configService.get<string>('MAILER_SERVICE'),
      auth: {
        user: this.configService.get<string>('MAILER_USER'),
        pass: this.configService.get<string>('MAILER_PASS'),
      },
    });

    const mailOptions = {
      from: this.configService.get<string>('MAILER_USER'),
      to: email,
      subject,
      html,
    };

    transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        console.log('Error:', error);
      } else {
        return info.response;
      }
    });
  }

  async forgotPassword(email: string){
    
    const user = await this.prismaService.usuario.findUnique({
      where: {correo: email}
    });
    if(!user) throw new HttpException({status:404, message: "E-mail not registered"},HttpStatus.NOT_FOUND);

    const token = this.jwtService.sign({email},{expiresIn: '1h'});

    const HOST = this.configService.get<string>("FRONTHOST");
    const PORT = this.configService.get<string>("FRONTPORT");

    this.sendEmail(
      email,
      "Reestablecimiento de contraseña - SENAGEST",
      `<h1>Para reestablecer su contraseña, haga click aquí</h1><a href='http://${HOST}:${PORT}/reset-password?token=${token}'>Reestablecer contraseña</a>`
    )

    return {status: 200, message: "Mail sent, check your E-mail"}
  }

  async resetPassword(data: {token: string, password: string}){
    try{
      const payload = this.jwtService.verify(data.token);
      if(!payload) return {status: 400, message: "Invalid token"};
      const email = payload.email;
      const hash = await bcrypt.hash(data.password,10);
      await this.prismaService.usuario.update({
        where: {
          correo: email
        },
        data: {
          contrasena: hash
        }
      })
      return {status: 200, message: "Password updated successfully"};
    }
    catch(error){
      console.log(error);
      throw new HttpException( {status: 400, message: "Invalid token"},HttpStatus.BAD_REQUEST);
    }
  }
}
