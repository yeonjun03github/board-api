import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, ChangePasswordDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async create(dto: CreateUserDto): Promise<User> {
        const exists = await this.userModel.findOne({ username: dto.username });
        if (exists) throw new ConflictException('이미 사용 중인 아이디예요');

        const hashed = await bcrypt.hash(dto.password, 10);
        return await this.userModel.create({ ...dto, password: hashed });
    }

    async findByUsername(username: string): Promise<UserDocument | null> {
        return await this.userModel.findOne({ username }).exec();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return await this.userModel.findById(id).exec();
    }

    async validatePassword(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed);
    }

    async updateProfile(userId: string, dto: UpdateUserDto): Promise<User> {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            dto,
            { returnDocument: 'after' },
        ).exec();
        if (!user) throw new NotFoundException('사용자를 찾을 수 없어요');
        return user;
    }

    async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
        const user = await this.userModel.findById(userId).exec();
        if (!user) throw new NotFoundException('사용자를 찾을 수 없어요');

        const valid = await bcrypt.compare(dto.currentPassword, user.password);
        if (!valid) throw new BadRequestException('현재 비밀번호가 올바르지 않아요');

        user.password = await bcrypt.hash(dto.newPassword, 10);
        await user.save();
    }

    async updateLastLogin(userId: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(userId, { lastLoginAt: new Date() }).exec();
    }

    async unban(userId: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(userId, {
            status: 'active',
            banUntil: null,
            banReason: '',
        }).exec();
    }
}
