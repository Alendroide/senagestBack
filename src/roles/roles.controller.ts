import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermisosGuard } from 'src/auth/guards/permisos.guard';
import { Permiso } from 'src/auth/decorators/permisos.decorator';
import { UpdateRolDto } from './dto/update-rol.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('roles')
export class RolesController {

    constructor(private rolesService : RolesService) {}

    @Post()
    @Permiso(10)
    @UseGuards(PermisosGuard)
    async createRol(@Body() data : CreateRolDto) {
        return await this.rolesService.createRol(data);
    }

    @Get()
    @Permiso(11)
    @UseGuards(PermisosGuard)
    async getRoles() {
        return await this.rolesService.getRoles();
    }

    @Patch('update/:id')
    @Permiso(12)
    @UseGuards(PermisosGuard)
    async updateRol(@Param('id',ParseIntPipe) id: number, data: UpdateRolDto) {
        return await this.rolesService.updateRol(id, data);
    }

    @Patch('status/:id')
    @Permiso(13)
    @UseGuards(PermisosGuard)
    async updateStatus(@Param('id',ParseIntPipe) id: number) {
        return await this.rolesService.updateStatus(id);
    }

}
