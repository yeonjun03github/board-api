import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        ConfigModule,
        UsersModule,
        JwtModule.register({}),  // secret은 sign/verify 시 직접 주입
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtAuthGuard],
    exports: [JwtAuthGuard, JwtModule, UsersModule],
})
export class AuthModule {}
