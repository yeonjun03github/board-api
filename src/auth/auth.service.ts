import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async register(dto: CreateUserDto) {
        await this.usersService.create(dto);
        return { message: '회원가입이 완료됐어요' };
    }

    async login(username: string, password: string) {
        const user = await this.usersService.findByUsername(username);
        if (!user) throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않아요');

        const valid = await this.usersService.validatePassword(password, user.password);
        if (!valid) throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않아요');

        if (user.status === 'banned') {
            const now = new Date();
            if (!user.banUntil || user.banUntil > now) {
                const until = user.banUntil
                    ? `(${user.banUntil.toLocaleDateString('ko-KR')}까지)`
                    : '(무기한)';
                throw new ForbiddenException(`차단된 계정이에요 ${until}. 사유: ${user.banReason || '없음'}`);
            }
            await this.usersService.unban(user._id.toString());
        }

        await this.usersService.updateLastLogin(user._id.toString());

        const payload = {
            sub: user._id.toString(),
            username: user.username,
            nickname: user.nickname,
            role: user.role,
        };

        const token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: '7d',
        });

        return {
            token,
            user: {
                userId: user._id.toString(),
                username: user.username,
                nickname: user.nickname,
                email: user.email,
                role: user.role,
            },
        };
    }
}
