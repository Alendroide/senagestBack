import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { ConfigService } from '@nestjs/config';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  generatePassword(length = 6) {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  }

  async sendEmail(email: string, password: string) {
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
      subject: 'SENAGEST - Nueva cuenta',
      text: 'Usted ha sido registrado en SENAGEST, su contraseña es ' + password,
    };

    transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        console.log('Error:', error);
      } else {
        return info.response;
      }
    });
  }

  async createUsuario(
    data: CreateUsuarioDto,
    file: Express.Multer.File | undefined,
  ): Promise<any> {
    if (data.fichaId) {
      const ficha = await this.prismaService.ficha.findUnique({
        where: { codigo: data.fichaId },
      });

      if (!ficha)
        throw new HttpException(
          { status: 404, message: 'Ficha not found.' },
          HttpStatus.NOT_FOUND,
        );
    }

    const existingUser = await this.prismaService.usuario.findFirst({
      where: {
        OR: [
          {
            identificacion: data.identificacion,
          },
          {
            correo: data.correo,
          },
        ],
      },
    });
    if (existingUser)
      throw new HttpException(
        { status: 400, message: 'User already exists' },
        HttpStatus.BAD_REQUEST,
      );

    // Password hashing
    const newPassword = this.generatePassword();
    const hash = await this.hashPassword(newPassword);

    // Crear en la base de datos
    await this.prismaService.usuario.create({
      data: {
        ...data,
        contrasena: hash,
        img: file ? `resize-${file.filename}` : undefined,
      },
    });

    const newUser = await this.prismaService.usuario.findUnique({
      where: {
        identificacion: data.identificacion,
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
        img: true,
      },
    });

    const newUserParsed = {
      ...newUser,
      identificacion: `${newUser?.identificacion}`,
    };

    await this.sendEmail(data.correo, newPassword);

    return {
      status: 201,
      message: 'User registered successfully.',
      data: newUserParsed,
    };
  }

  async getUsuarios(page: number) {
    const records = 10;

    const users = await this.prismaService.usuario.findMany({
      select: {
        id: true,
        img: true,
        identificacion: true,
        primerNombre: true,
        segundoNombre: true,
        primerApellido: true,
        segundoApellido: true,
        correo: true,
        fichaId: true,
        fechaNacimiento: true,
      },
      orderBy: {
        fichaId: 'asc',
      },
      take: records,
      skip: (page - 1) * records,
    });

    const userCount = await this.prismaService.usuario.count();

    const totalPages = Math.ceil(userCount / records);

    const processedUsers = users.map((user) => ({
      ...user,
      identificacion: `${user.identificacion}`,
    }));

    return {
      status: 200,
      message: 'Users fetched successfully',
      data: processedUsers,
      currentPage: page,
      totalPages,
    };
  }

  async updateUsuario(userId: number, data: UpdateUsuarioDto) {

    if (data.fichaId) {
      const ficha = await this.prismaService.ficha.findUnique({
        where: { codigo: data.fichaId },
      });

      if (!ficha)
        throw new HttpException(
          { status: 404, message: 'Ficha not found.' },
          HttpStatus.NOT_FOUND,
        );
    }

    const existingUser = await this.prismaService.usuario.findUnique({
      where: {
        id: userId
      },
    });

    if (!existingUser)
      throw new HttpException(
        { status: 404, message: 'User not found' },
        HttpStatus.NOT_FOUND,
    );

    const updatedUser = await this.prismaService.usuario.update({
      where: {
        id: userId
      },
      data
    })

    return { status: 200, message: "User updated successfully", data: updatedUser}
  }

  async getProfile(userId: number) {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        identificacion: true,
        primerNombre: true,
        segundoNombre: true,
        primerApellido: true,
        segundoApellido: true,
        correo: true,
        fichaId: true,
        img: true,
        fechaNacimiento: true,
        rol: {
          select: {
            id: true,
            nombre: true,
            icono: true,
            permisos: {
              where: {
                valor: true,
              },
              select: {
                permiso: {
                  select: {
                    id: true,
                    nombre: true,
                    descripcion: true,
                    tipo: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const userParsed = {
      ...user,
      identificacion: `${user?.identificacion}`,
      rol: user?.rol ? {
        ...user.rol,
        permisos: user.rol.permisos.map((permiso) => permiso.permiso),
      } : undefined,
    };

    return {
      status: 200,
      message: 'Profile fetched successfully',
      data: userParsed,
    };
  }
}
