import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ModulosService } from './modulos.service';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ModulosGuard } from './modulos.guard';
import { Permiso } from 'src/auth/decorators/permisos.decorator';
import { PermisosGuard } from 'src/auth/guards/permisos.guard';

@Controller('modulos')
export class ModulosController {
    constructor(private modulosService : ModulosService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'),RolesGuard)
    @Roles("Administrador", "Aprendiz")
    async getModulos() : Promise<any> {
        return await this.modulosService.getModulos();
    }

    @Get('/:moduloName')
    @UseGuards(AuthGuard('jwt'),ModulosGuard)
    async accessModulo(@Param('moduloName') moduloName : string) : Promise<any> {
        return await this.modulosService.accessModulo(moduloName);
    }

    @Post()
    @Permiso(1)
    @UseGuards(AuthGuard('jwt'),PermisosGuard)
    async createModulo(@Body() body : CreateModuloDto) : Promise<any> {
        return await this.modulosService.createModulo(body);
    }
}
