import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports : [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.registerAsync({
      imports : [ConfigModule],
      inject : [ConfigService],
      useFactory : (configService : ConfigService) => ({
        secret : configService.get<string>('JWT_SECRET'),
        signOptions : {
          expiresIn : configService.get<string>('JWT_EXPIRATION')
        }
      })
    })
  ],
  providers: [AuthService, JwtStrategy, PrismaService, ConfigService],
  controllers: [AuthController]
})
export class AuthModule {}
