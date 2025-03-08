import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(configService : ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || (() => { 
                throw new Error("JWT_SECRET is not defined in the environment variables.");
            })(),
        });
    }

    async validate(payload : { correo : string, sub : number }) : Promise<any> {
        return { correo : payload.correo, id : payload.sub };
    }
}