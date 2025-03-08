import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private jwtService : JwtService) {}

    @Post('register')
    async register(@Body() body : { correo : string, contrasena : string }) : Promise<any> {
        const hash = this.authService.hashPassword(body.contrasena);

        // Crear en la base de datos
        const user = { correo : body.correo, contrasena : hash };

        return { message : "User registered successfully." };
    }

    @Post('login')
    async login(@Body() body : { correo : string, contrasena : string }){
        
        // Pseudocódigo de cómo funciona el login, he de buscar el usuario en la base de datos
        const user = { id : 1, correo : 'pepe@gmail.com', contrasena : '$2a$10$Dm83JM/aOH/GAa6FgtGQp.IjeOQSnvXECpkxeY4dD43tDvwKgBOIG' };

        if(!user){
            return { message : "User not found." };
        }

        if(!(await this.authService.comparePasswords(body.contrasena, user.contrasena))){
            return { message : "Wrong password. Please try again." };
        }

        const payload = { correo : user.correo, sub : user.id };

        return { access_token : this.jwtService.sign(payload) };
    }
}
