import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './user.schema';
import { Post, PostSchema } from '../posts/post.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
    imports: [
        ConfigModule,
        JwtModule.register({}),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Post.name, schema: PostSchema },
        ]),
    ],
    controllers: [UsersController],
    providers: [UsersService, JwtAuthGuard],
    exports: [UsersService],
})
export class UsersModule {}
