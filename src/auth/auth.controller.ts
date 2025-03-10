import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() body : CreateUsuarioDto) : Promise<any> {
        return await this.authService.register(body);
    }

    @Post('login')
    async login(@Body() body : LoginDto) : Promise<any> {
        return await this.authService.login(body);
    }
}
