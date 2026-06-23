import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Controller('upload')
export class UploadController {

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: join(__dirname, '..', 'public', 'uploads'),
            filename: (req, file, cb) => {
                const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, unique + extname(file.originalname)); // 파일명 중복 방지
            }
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/image\/(jpg|jpeg|png|gif|webp)/)) {
                return cb(new Error('이미지 파일만 업로드 가능해요'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 } // 5MB 제한
    }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return { url: `/uploads/${file.filename}` }; // 저장된 경로 반환
    }
}