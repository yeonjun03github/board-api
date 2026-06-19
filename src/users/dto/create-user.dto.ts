import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsEmail } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(4, { message: '아이디는 4자 이상이어야 해요' })
    @MaxLength(20, { message: '아이디는 20자 이하여야 해요' })
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: '비밀번호는 6자 이상이어야 해요' })
    password: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20, { message: '닉네임은 20자 이하여야 해요' })
    nickname: string;

    @IsEmail({}, { message: '올바른 이메일 형식이 아니에요' })
    @IsOptional()
    email?: string;
}
