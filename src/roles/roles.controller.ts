import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermisosGuard } from 'src/auth/guards/permisos.guard';
import { Permiso } from 'src/auth/decorators/permisos.decorator';

@Controller('roles')
export class RolesController {

    constructor(private rolesService : RolesService) {}

    
    // @Get('getPermisos/:rolId')
    // @Permiso(5)
    // @UseGuards(AuthGuard('jwt'),PermisosGuard)
    // findOne(@Param('rolId',ParseIntPipe) rolId : number) {
    //     return this.rolesService.getRolePermisos(rolId);
    // }

    @Post()
    @Permiso(6)
    @UseGuards(AuthGuard('jwt'),PermisosGuard)
    createRole(@Body() body : CreateRolDto) {
        return this.rolesService.createRole(body);
    }

    @Get()
    @Permiso(7)
    @UseGuards(AuthGuard('jwt'),PermisosGuard)
    findAll() {
        return this.rolesService.getRoles();
    }

}
