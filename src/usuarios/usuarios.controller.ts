import { Body, Controller, Get, ParseIntPipe, Post, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsuariosService } from './usuarios.service';
import { PermisosGuard } from 'src/auth/guards/permisos.guard';
import { Permiso } from 'src/auth/decorators/permisos.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as sharp from 'sharp';
import { promises as fs } from 'fs';

@UseGuards(AuthGuard('jwt'))
@Controller('usuarios')
export class UsuariosController {

    constructor(private usuariosService: UsuariosService) { }

    @Get('perfil')
    getProfile(@Request() req: any) {
        const userId = req.user.sub;
        return this.usuariosService.getProfile(userId);
    }

    @Post()
    @Permiso(14)
    @UseGuards(PermisosGuard)
    @UseInterceptors(FileInterceptor('img', {
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
    async createUsuario(@Body() body: CreateUsuarioDto, @UploadedFile() file?: Express.Multer.File): Promise<any> {
        if(file){
            await sharp(file.path)
                .resize(500, 500, {
                    fit: 'cover',
                    withoutEnlargement: false,
                })
                .png({compressionLevel: 9})
                .toFile(`./uploads/resize-${file.filename}`);
            try{
                await fs.unlink(file.path);
            }
            catch(error){
                console.log(error);
            }
        }
        return await this.usuariosService.createUsuario(body, file);
    }

    @Get()
    @Permiso(15)
    @UseGuards(PermisosGuard)
    async getUsuarios(@Query("page", ParseIntPipe) pageQuery: number | undefined) {
        const page = pageQuery ?? 1;
        return await this.usuariosService.getUsuarios(page);
    }

}
