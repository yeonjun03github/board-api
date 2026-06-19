import { Injectable, ForbiddenException, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);
        const { user } = context.switchToHttp().getRequest();
        if (user?.role !== 'admin') throw new ForbiddenException('관리자만 접근할 수 있어요');
        return true;
    }
}
