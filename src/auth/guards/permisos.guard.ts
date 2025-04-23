import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISO_KEY } from '../decorators/permisos.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermisosGuard implements CanActivate {

  constructor(private reflector : Reflector, private prismaService : PrismaService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const permiso = this.reflector.get<number>(PERMISO_KEY,context.getHandler());
    const { user } = context.switchToHttp().getRequest();
    
    if(!user) throw new HttpException("Not logged in", HttpStatus.UNAUTHORIZED);

    const [hasAccess] = await this.prismaService.rolPermiso.findMany({
      where : {
        AND : {
          rolId : user.rol,
          permisoId : permiso,
          valor : true
        }
      }
    })

    if(!hasAccess) return false;

    return true;

  }
}
