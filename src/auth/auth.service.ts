import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    async hashPassword(password : string) : Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    async comparePasswords(password : string, hash : string) : Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
