import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) { }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async register(data: CreateUsuarioDto, file: Express.Multer.File | undefined): Promise<any> {
    // Validaciones
    const ficha = await this.prismaService.ficha.findUnique({
      where: { codigo: data.fichaId },
    });

    if (!ficha)
      throw new HttpException(
        { status: 404, message: 'Ficha not found.' },
        HttpStatus.NOT_FOUND,
      );

    // Password hashing
    const hash = await this.hashPassword(data.contrasena);

    // Crear en la base de datos
    await this.prismaService.usuario.create({
      data: { ...data, contrasena: hash, img: file ? file.filename : undefined },
    });

    const newUser = await this.prismaService.usuario.findUnique({
      where: {
        identificacion: data.identificacion
      },
      select: {
        id: true,
        identificacion: true,
        primerNombre: true,
        primerApellido: true,
        segundoNombre: true,
        segundoApellido: true,
        correo: true,
        fichaId: true,
        rolId: true,
        fechaNacimiento: true,
        img: true
      }
    });

    return { status: 201, message: 'User registered successfully.', data: newUser };
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
                  nombre: true,
                  tipo: true
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
