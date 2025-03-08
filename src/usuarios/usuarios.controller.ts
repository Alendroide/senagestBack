import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('usuarios')
export class UsuariosController {
    @Get('perfil')
    @UseGuards(AuthGuard('jwt'))
    getProfile(@Request() req : any) {
        return req.user;
    }
}
