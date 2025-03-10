import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  
  constructor(private reflector : Reflector) {}
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

    if(!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    if(!user || !user.roles) return false;

    const hasRole = user.roles.some(role => requiredRoles.includes(role));

    if(!hasRole) return false;

    return true;
  }
}
