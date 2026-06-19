import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminGuard } from '../auth/admin.guard';
import { User, UserSchema } from '../users/user.schema';
import { Post, PostSchema } from '../posts/post.schema';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        AuthModule,
        UsersModule,
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Post.name, schema: PostSchema },
        ]),
    ],
    controllers: [AdminController],
    providers: [AdminService, AdminGuard],
})
export class AdminModule {}
