import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from '../auth/admin.guard';
import { BanUserDto } from './dto/ban-user.dto';
import { AdminUpdatePostDto } from './dto/admin-update-post.dto';

@Controller('api/admin')
@UseGuards(AdminGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('stats')
    getStats() {
        return this.adminService.getStats();
    }

    // 이용자 관리
    @Get('users')
    getUsers() {
        return this.adminService.getUsers();
    }

    @Get('users/:id')
    getUserDetail(@Param('id') id: string) {
        return this.adminService.getUserDetail(id);
    }

    @Post('users/:id/ban')
    banUser(@Param('id') id: string, @Body() dto: BanUserDto) {
        return this.adminService.banUser(id, dto);
    }

    @Post('users/:id/unban')
    unbanUser(@Param('id') id: string) {
        return this.adminService.unbanUser(id);
    }

    @Delete('users/:id')
    deleteUser(@Param('id') id: string) {
        return this.adminService.deleteUser(id);
    }

    // 게시물 관리
    @Get('posts')
    getPosts(@Query('q') search?: string) {
        return this.adminService.getPosts(search);
    }

    @Patch('posts/:id')
    updatePost(@Param('id') id: string, @Body() dto: AdminUpdatePostDto) {
        return this.adminService.updatePost(id, dto);
    }

    @Delete('posts/:id')
    deletePost(@Param('id') id: string) {
        return this.adminService.deletePost(id);
    }
}
