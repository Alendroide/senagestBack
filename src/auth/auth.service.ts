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
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async register(data: CreateUsuarioDto): Promise<any> {
    // Validaciones
    const ficha = await this.prismaService.ficha.findUnique({
      where: { codigo: data.fichaId },
    });

    if (!ficha)
      throw new HttpException(
        { message: 'Ficha not found.' },
        HttpStatus.NOT_FOUND,
      );

    // Password hashing
    const hash = await this.hashPassword(data.contrasena);

    // Crear en la base de datos
    await this.prismaService.usuario.create({
      data: { ...data, contrasena: hash },
    });

    return { message: 'User registered successfully.' };
  }

  async login(data: LoginDto): Promise<any> {
    // Buscar el usuario
    const user = await this.prismaService.usuario.findUnique({
      where: { correo: data.correo },
      include: {
        rol: true,
      },
    });

    // Validaciones
    if (!user)
      throw new HttpException(
        { message: 'User not found.' },
        HttpStatus.NOT_FOUND,
      );

    // Comparar contraseñas
    if (!(await this.comparePasswords(data.contrasena, user.contrasena)))
      throw new HttpException(
        { message: 'Wrong password. Please try again.' },
        HttpStatus.UNAUTHORIZED,
      );

    const modules = await this.prismaService.modulo.findMany({
      where: {
        permisos: {
          some: {
            roles: {
              some: {
                rol: {
                  usuarios: {
                    some: {
                      id: user.id,
                    },
                  },
                },
              },
            },
          },
        },
      },
      select: {
        nombre: true,
        icono: true,
        permisos: {
          where: {
            roles: {
              some: {
                valor : true,
                rol: {
                  usuarios: {
                    some: {
                      id: user.id,
                    },
                  },
                },
              },
            },
          },
          select: {
            rutafront: {
              select: {
                ruta: true,
                nombre : true
              },
            },
          },
        },
      },
    });

    const fixedModules = modules.map(m => ({
        nombre: m.nombre,
        icono: m.icono,
        permisos: m.permisos.map(p => ({
          rutafront: p.rutafront[0], // solo toma la primera ruta
        }))
    }));

    // Generar JWT
    const payload: JwtPayload = {
      sub: user.id,
      identificacion: user.identificacion.toString(),
      correo: user.correo,
      rol: user.rol?.id,
      nombre: `${user.primerNombre} ${user.primerApellido}`,
      modulos: fixedModules,
    };

    // Retornar JWT
    return { access_token: this.jwtService.sign(payload) };
  }
}
