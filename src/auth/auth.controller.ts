import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @UseInterceptors(FileInterceptor('img',{
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
                callback(null, filename);
            }
        })
    }))
    async register(@Body() body : CreateUsuarioDto, @UploadedFile() file?: Express.Multer.File ) : Promise<any> {
        return await this.authService.register(body,file);
    }

    @Post('login')
    async login(@Body() body : LoginDto) : Promise<any> {
        return await this.authService.login(body);
    }
}
