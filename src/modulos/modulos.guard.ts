import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ModulosGuard implements CanActivate {
  
  constructor(private readonly prismaService : PrismaService){}
  
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    
    const req = context.switchToHttp().getRequest();
    
    if(req.user.rol === 'Administrador') return true;

    const {moduloName} = req.params;
    const usuarioId = req.user.sub;

    const modulo = await this.prismaService.modulo.findUnique({
      where : {
        nombre : moduloName
      }
    })

    if(!modulo) throw new HttpException("This module doesn't exist",HttpStatus.NOT_FOUND);

    const permisos = await this.prismaService.permiso.findMany({
      where : {
        modulo : {
          nombre : moduloName
        },
        roles : {
          some : {
            rol : {
              usuarios : {
                some : {
                  id : usuarioId
                }
              }
            }
          }
        }
      }
    });

    if(permisos.length === 0) throw new HttpException("Not allowed in this module",HttpStatus.FORBIDDEN);

    return true;
  }
}
