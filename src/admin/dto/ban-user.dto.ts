import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class BanUserDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    duration?: number; // 차단 기간 (일). 없으면 무기한

    @IsString()
    reason: string;
}
