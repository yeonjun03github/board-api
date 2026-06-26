import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from './users.service';
import { UpdateUserDto, ChangePasswordDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Post, PostDocument } from '../posts/post.schema';
import { Comment, CommentDocument } from '../posts/comment.schema';

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    ) {}

    @Get('me')
    async getMe(@Req() req: any) {
        const user = await this.usersService.findById(req.user.userId);
        if (!user) return {};
        return {
            userId: (user as any)._id.toString(),
            username: user.username,
            nickname: user.nickname,
            email: user.email,
        };
    }

    @Patch('me')
    async updateMe(@Req() req: any, @Body() dto: UpdateUserDto) {
        const user = await this.usersService.updateProfile(req.user.userId, dto) as any;
        return {
            userId: user._id.toString(),
            username: user.username,
            nickname: user.nickname,
            email: user.email,
        };
    }

    @Patch('me/password')
    async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
        await this.usersService.changePassword(req.user.userId, dto);
        return { message: '비밀번호가 변경됐어요' };
    }

    @Get('me/posts')
    async myPosts(@Req() req: any) {
        return await this.postModel
            .find({ authorId: req.user.userId })
            .sort({ createdAt: -1 })
            .exec();
    }

    @Get('me/comments')
    async myComments(@Req() req: any) {
        return await this.commentModel
            .find({ authorId: req.user.userId })
            .sort({ createdAt: -1 })
            .exec();
    }

}
