import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadController } from './upload/upload.controller';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
            }),
            inject: [ConfigService],
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
            serveStaticOptions: { index: false, extensions: ['html'] },
        }),
        AuthModule,
        UsersModule,
        PostsModule,
        AdminModule,
    ],
    controllers: [AppController, UploadController],
    providers: [AppService],
})
export class AppModule {}
