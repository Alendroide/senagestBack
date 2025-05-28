import { Body, Controller, Get, Post, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsuariosService } from './usuarios.service';
import { PermisosGuard } from 'src/auth/guards/permisos.guard';
import { Permiso } from 'src/auth/decorators/permisos.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('usuarios')
export class UsuariosController {

    constructor(private usuariosService : UsuariosService){}

    @Get('perfil')
    getProfile(@Request() req : any) {
        return req.user;
    }

    @Post()
    @Permiso(14)
    @UseGuards(PermisosGuard)
    @UseInterceptors(FileInterceptor('img',{
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
                callback(null, filename);
            }
        })
    }))
    async createUsuario(@Body() body : CreateUsuarioDto, @UploadedFile() file?: Express.Multer.File ) : Promise<any> {
        return await this.usuariosService.createUsuario(body,file);
    }

    @Get()
    @Permiso(15)
    @UseGuards(PermisosGuard)
    async getUsuarios(@Query("page") pageQuery : number | undefined){
        const page = pageQuery ?? 1;
        return await this.usuariosService.getUsuarios(page);
    }

}
