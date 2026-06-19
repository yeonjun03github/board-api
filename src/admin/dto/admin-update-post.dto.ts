import { IsString, IsOptional } from 'class-validator';

export class AdminUpdatePostDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    content?: string;
}
