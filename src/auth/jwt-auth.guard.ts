import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private usersService: UsersService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);
        if (!token) throw new UnauthorizedException('로그인이 필요해요');

        let payload: any;
        try {
            payload = this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });
        } catch {
            throw new UnauthorizedException('유효하지 않은 토큰이에요');
        }

        const user = await this.usersService.findById(payload.sub);
        if (!user) throw new UnauthorizedException('존재하지 않는 계정이에요');

        if (user.status === 'banned') {
            const now = new Date();
            if (!user.banUntil || user.banUntil > now) {
                throw new ForbiddenException('차단된 계정이에요');
            }
            await this.usersService.unban(user._id.toString());
        }

        request.user = {
            userId: payload.sub,
            username: payload.username,
            nickname: payload.nickname,
            role: payload.role ?? 'user',
        };
        return true;
    }

    private extractToken(request: any): string | null {
        const auth = request.headers?.authorization ?? '';
        const [type, token] = auth.split(' ');
        return type === 'Bearer' ? token : null;
    }
}
