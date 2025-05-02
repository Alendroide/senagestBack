import { Body, Controller, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermisosService } from './permisos.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { PermisosGuard } from 'src/auth/guards/permisos.guard';
import { Permiso } from 'src/auth/decorators/permisos.decorator';

@Controller('permisos')
export class PermisosController {

    constructor(private permisosService : PermisosService){}

    // CREATE NEW PERMISO
    @Post()
    @Permiso(3)
    @UseGuards(AuthGuard('jwt'),PermisosGuard)
    async createPermiso (@Body() body : CreatePermisoDto) {
        return await this.permisosService.createPermiso(body);
    }

    // GET ALL PERMISOS GROUPED BY MODULO
    @Get('/bymodulo')
    @Permiso(4)
    @UseGuards(AuthGuard('jwt'),PermisosGuard)
    async getPermisosCategorized () {
        return await this.permisosService.getPermisosCategorized();
    }

    // ASIGN PERMISO TO A ROLE
    @Post('/asign/:permisoId/:rolId/:valor')
    @Permiso(5)
    @UseGuards(AuthGuard('jwt'),PermisosGuard)
    async asignPermiso (@Param('permisoId',ParseIntPipe) permisoId : number, @Param('rolId',ParseIntPipe) rolId : number , @Param('valor',ParseBoolPipe) valor : boolean ) {
        return await this.permisosService.asignPermiso(permisoId,rolId,valor);
    }

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

}
