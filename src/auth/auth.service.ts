import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwtPayload';

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
      where: { correo: data.correo },
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

    let payload: JwtPayload = {
      sub: user.id,
      identificacion: `${user.identificacion}`,
      correo: user.correo,
      img: user.img,
      rol: user.rolId ?? undefined,
      nombre: `${user.primerNombre} ${user.primerApellido}`,
      modulos: []
    }

    if (user.rolId) {
      const modulos = await this.prismaService.modulo.findMany({
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
          }
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
              }
            },
            select: {
              nombre: true,
              ruta: true,
              permisos: {
                where: {
                  roles: {
                    some: {
                      rolId: user.rolId,
                      valor: true,
                    }
                  }
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
      });

      payload = {
        ...payload,
        modulos
      }
    }

    // Retornar JWT
    return { status: 200, message: "Login successful", access_token: this.jwtService.sign(payload) };
  }
}
