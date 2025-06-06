import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() body : LoginDto) : Promise<any> {
        return await this.authService.login(body);
    }

    @Get('getpermisos')
    @UseGuards(AuthGuard('jwt'))
    async refetchPermisos(@Request() req: any){
        const rolId: number | undefined = req.user.rol;
        return this.authService.refetchPermisos(rolId);
    }
}
