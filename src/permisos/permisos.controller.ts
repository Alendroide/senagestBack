import { Body, Controller, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermisosService } from './permisos.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreatePermisoDto } from './dto/create-permiso.dto';

@Controller('permisos')
export class PermisosController {

    constructor(private permisosService : PermisosService){}

    @Get('/modulo/:moduloId')
    @UseGuards(AuthGuard('jwt'),RolesGuard)
    @Roles("Administrador")
    async getPermisosByModulo (@Param('moduloId',ParseIntPipe) moduloId : number ) {
        return await this.permisosService.getPermisosByModulo(moduloId);
    }

    @Get('/me')
    @UseGuards(AuthGuard('jwt'))
    async myPermisos(@Request() req : any){
        const usuarioId = req.user.sub;
        return await this.permisosService.myPermisos(usuarioId);
    }

    @Get('/me/:moduloId')
    @UseGuards(AuthGuard('jwt'))
    async myPermisosByModulo (@Request() req : any, @Param('moduloId',ParseIntPipe) moduloId) {
        const usuarioId = req.user.sub;
        return await this.permisosService.myPermisosByModulo(usuarioId,moduloId);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'),RolesGuard)
    @Roles("Administrador")
    async createPermiso (@Body() body : CreatePermisoDto) {
        return await this.permisosService.createPermiso(body);
    }

    @Post('/:permisoId/:rolId/:valor')
    @UseGuards(AuthGuard('jwt'),RolesGuard)
    @Roles("Administrador")
    async asignPermiso (@Param('permisoId',ParseIntPipe) permisoId : number, @Param('rolId',ParseIntPipe) rolId : number , @Param('valor',ParseBoolPipe) valor : boolean ) {
        return await this.permisosService.asignPermiso(permisoId,rolId,valor);
    }
}
