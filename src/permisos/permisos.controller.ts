import { Body, Controller, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermisosService } from './permisos.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { PermisosGuard } from 'src/auth/guards/permisos.guard';
import { Permiso } from 'src/auth/decorators/permisos.decorator';
import { UpdatePermisoDto } from './dto/update-permiso.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('permisos')
export class PermisosController {

    constructor(private permisosService : PermisosService){}

    @Post()
    @Permiso(5)
    @UseGuards(PermisosGuard)
    async createPermiso (@Body() body : CreatePermisoDto) {
        return await this.permisosService.createPermiso(body);
    }

    @Get('bymodulo')
    @Permiso(6)
    @UseGuards(PermisosGuard)
    async getPermisos () {
        return await this.permisosService.getPermisos();
    }

    @Patch('update/:id')
    @Permiso(7)
    @UseGuards(PermisosGuard)
    async updatePermiso (@Param('id',ParseIntPipe) id: number, @Body() data: UpdatePermisoDto) {
        return await this.permisosService.updatePermiso(id,data);
    }

    @Patch('status/:id')
    @Permiso(8)
    @UseGuards(PermisosGuard)
    async updateStatus (@Param('id',ParseIntPipe) id: number) {
        return await this.permisosService.updateStatus(id);
    }


    //--------------- PERMISO ASIGNING ---------------//


    // ASIGN PERMISO TO A ROLE
    @Post('/asign/:permisoId/:rolId/:valor')
    @Permiso(9)
    @UseGuards(PermisosGuard)
    async asignPermiso (@Param('permisoId',ParseIntPipe) permisoId : number, @Param('rolId',ParseIntPipe) rolId : number , @Param('valor',ParseBoolPipe) valor : boolean ) {
        return await this.permisosService.asignPermiso(permisoId,rolId,valor);
    }

    // GET PERMISOS BY ROLE
    @Get('/role/:rolId')
    @Permiso(9)
    @UseGuards(PermisosGuard)
    async getRolePermisos (@Param('rolId',ParseIntPipe) rolId : number ) {
        return await this.permisosService.getRolePermisos(rolId);
    }

    // GET ALL ROLES
    @Get('/roles')
    @Permiso(9)
    @UseGuards(PermisosGuard)
    async getRoles () {
        return await this.permisosService.getRoles();
    }

}
