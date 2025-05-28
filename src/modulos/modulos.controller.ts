import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ModulosService } from './modulos.service';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { AuthGuard } from '@nestjs/passport';
import { Permiso } from 'src/auth/decorators/permisos.decorator';
import { PermisosGuard } from 'src/auth/guards/permisos.guard';
import { UpdateModuloDto } from './dto/update-modulo.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('modulos')
export class ModulosController {
    constructor(private modulosService : ModulosService) {}


    @Post()
    @Permiso(1)
    @UseGuards(PermisosGuard)
    async createModulo(@Body() body : CreateModuloDto) {
        return await this.modulosService.createModulo(body);
    }

    @Get()
    @Permiso(2)
    @UseGuards(PermisosGuard)
    async getModulos() {
        return await this.modulosService.getModulos();
    }

    @Patch('update/:id')
    @Permiso(3)
    @UseGuards(PermisosGuard)
    async updateModulo(@Param('id',ParseIntPipe) id: number, @Body() body: UpdateModuloDto) {
        return "In process"
    }

    @Patch('status/:id')
    @Permiso(4)
    @UseGuards(PermisosGuard)
    async moduloStatus(@Param('id',ParseIntPipe) id: number) {
        return "In process"
    }
}
