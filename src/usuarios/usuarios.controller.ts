import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsuariosService } from './usuarios.service';
import { PermisosGuard } from 'src/auth/guards/permisos.guard';
import { Permiso } from 'src/auth/decorators/permisos.decorator';

@Controller('usuarios')
export class UsuariosController {

    constructor(private usuariosService : UsuariosService){}

    @Get('perfil')
    @UseGuards(AuthGuard('jwt'))
    getProfile(@Request() req : any) {
        return req.user;
    }

    @Get("getAll")
    @Permiso(9)
    @UseGuards(AuthGuard("jwt"),PermisosGuard)
    async getAllUsers(@Query("page") pageQuery : number | undefined){
        const page = pageQuery ?? 1;
        return await this.usuariosService.getAllUsers(page);
    }

}
