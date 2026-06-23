import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreatePostDto, @Req() req: any) {
        return this.postsService.create(dto, req.user.userId, req.user.nickname);
    }

    @Get()
    findAll(@Query('search') search?: string) {
        return this.postsService.findAll(search);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() dto: UpdatePostDto, @Req() req: any) {
        return this.postsService.update(id, dto, req.user.userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string, @Req() req: any) {
        return this.postsService.remove(id, req.user.userId);
    }

    @Get(':id/comments')
    getComments(@Param('id') id: string) {
        return this.postsService.getComments(id);
    }

    @Post(':id/comments')
    @UseGuards(JwtAuthGuard)
    addComment(@Param('id') id: string, @Body() dto: CreateCommentDto) {
        return this.postsService.addComment(id, dto);
    }
}
