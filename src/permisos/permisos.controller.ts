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

    // GET PERMISOS BY ROLE
    @Get('/role/:rolId')
    @Permiso(5)
    @UseGuards(AuthGuard('jwt'),PermisosGuard)
    async getRolePermisos (@Param('rolId',ParseIntPipe) rolId : number ) {
        return await this.permisosService.getRolePermisos(rolId);
    }

    // GET ALL ROLES
    @Get('/roles')
    @Permiso(5)
    @UseGuards(AuthGuard('jwt'),PermisosGuard)
    async getRoles () {
        return await this.permisosService.getRoles();
    }

}
