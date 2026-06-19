import { IsString, IsOptional, MaxLength, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @MaxLength(20)
    nickname?: string;

    @IsEmail()
    @IsOptional()
    email?: string;
}

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: '새 비밀번호는 6자 이상이어야 해요' })
    newPassword: string;
}
