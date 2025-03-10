import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ModulosService } from './modulos.service';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('modulos')
export class ModulosController {
    constructor(private modulosService : ModulosService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'),RolesGuard)
    @Roles("Administrador", "Aprendiz")
    async getModulos() : Promise<any> {
        return await this.modulosService.getModulos();
    }

    @Post()
    @UseGuards(AuthGuard('jwt'),RolesGuard)
    @Roles("Administrador")
    async createModulo(@Body() body : CreateModuloDto) : Promise<any> {
        return await this.modulosService.createModulo(body);
    }
}
