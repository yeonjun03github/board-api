import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,      // DTO에 없는 필드 자동 제거
    forbidNonWhitelisted: true, // DTO에 없는 필드 오면 에러
    transform: true,      // 타입 자동 변환
  }));

  await app.listen(3000);
}
bootstrap();
