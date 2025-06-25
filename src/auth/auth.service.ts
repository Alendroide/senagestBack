import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwtPayload';
import { Modulo } from './types/Modulo';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
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
}
