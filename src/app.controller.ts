import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {

    @Get()
    index(@Res() res: Response) {
        return res.sendFile(join(__dirname, '..', 'public', 'index.html'));
    }

    @Get('board')
    board(@Res() res: Response) {
        return res.sendFile(join(__dirname, '..', 'public', 'board.html'));
    }

    @Get('login')
    login(@Res() res: Response) {
        return res.sendFile(join(__dirname, '..', 'public', 'login.html'));
    }

    @Get('profile')
    profile(@Res() res: Response) {
        return res.sendFile(join(__dirname, '..', 'public', 'profile.html'));
    }

    @Get('admin')
    admin(@Res() res: Response) {
        return res.sendFile(join(__dirname, '..', 'public', 'admin.html'));
    }
}
