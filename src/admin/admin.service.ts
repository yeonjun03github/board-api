import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import { Post, PostDocument } from '../posts/post.schema';
import { BanUserDto } from './dto/ban-user.dto';
import { AdminUpdatePostDto } from './dto/admin-update-post.dto';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
    ) {}

    async getStats() {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const [totalUsers, totalPosts, todaySignups, bannedCount] = await Promise.all([
            this.userModel.countDocuments(),
            this.postModel.countDocuments(),
            this.userModel.countDocuments({ createdAt: { $gte: todayStart } }),
            this.userModel.countDocuments({ status: 'banned' }),
        ]);

        return { totalUsers, totalPosts, todaySignups, bannedCount };
    }

    async getUsers() {
        const users = await this.userModel.find().sort({ createdAt: -1 }).lean();
        const postCounts = await this.postModel.aggregate([
            { $group: { _id: '$authorId', count: { $sum: 1 } } },
        ]);
        const countMap = new Map(postCounts.map((p: any) => [p._id, p.count]));

        return users.map(u => {
            const doc = u as any;
            return {
                _id: doc._id,
                username: doc.username,
                nickname: doc.nickname,
                email: doc.email,
                role: doc.role,
                status: doc.status,
                banUntil: doc.banUntil,
                banReason: doc.banReason,
                createdAt: doc.createdAt,
                lastLoginAt: doc.lastLoginAt,
                postCount: countMap.get(doc._id.toString()) ?? 0,
            };
        });
    }

    async getUserDetail(id: string) {
        if (!isValidObjectId(id)) throw new NotFoundException('유효하지 않은 ID예요');
        const user = await this.userModel.findById(id).lean();
        if (!user) throw new NotFoundException('이용자를 찾을 수 없어요');
        const posts = await this.postModel.find({ authorId: id }).sort({ createdAt: -1 }).lean();
        return { ...user, posts };
    }

    async banUser(id: string, dto: BanUserDto) {
        if (!isValidObjectId(id)) throw new NotFoundException('유효하지 않은 ID예요');
        const banUntil = dto.duration
            ? new Date(Date.now() + dto.duration * 24 * 60 * 60 * 1000)
            : null;

        const user = await this.userModel.findByIdAndUpdate(
            id,
            { status: 'banned', banUntil, banReason: dto.reason },
            { returnDocument: 'after' },
        ).exec();
        if (!user) throw new NotFoundException('이용자를 찾을 수 없어요');
        return { message: '차단됐어요', banUntil };
    }

    async unbanUser(id: string) {
        if (!isValidObjectId(id)) throw new NotFoundException('유효하지 않은 ID예요');
        const user = await this.userModel.findByIdAndUpdate(
            id,
            { status: 'active', banUntil: null, banReason: '' },
            { returnDocument: 'after' },
        ).exec();
        if (!user) throw new NotFoundException('이용자를 찾을 수 없어요');
        return { message: '차단이 해제됐어요' };
    }

    async deleteUser(id: string) {
        if (!isValidObjectId(id)) throw new NotFoundException('유효하지 않은 ID예요');
        const user = await this.userModel.findByIdAndDelete(id).exec();
        if (!user) throw new NotFoundException('이용자를 찾을 수 없어요');
        await this.postModel.deleteMany({ authorId: id }).exec();
        return { message: '강제탈퇴 처리됐어요' };
    }

    async getPosts(search?: string) {
        if (!search) return this.postModel.find().sort({ createdAt: -1 }).lean();
        return this.postModel.find({
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
            ],
        }).sort({ createdAt: -1 }).lean();
    }

    async updatePost(id: string, dto: AdminUpdatePostDto) {
        if (!isValidObjectId(id)) throw new NotFoundException('유효하지 않은 ID예요');
        const post = await this.postModel.findByIdAndUpdate(id, dto, { returnDocument: 'after' }).exec();
        if (!post) throw new NotFoundException('게시글을 찾을 수 없어요');
        return post;
    }

    async deletePost(id: string) {
        if (!isValidObjectId(id)) throw new NotFoundException('유효하지 않은 ID예요');
        const post = await this.postModel.findByIdAndDelete(id).exec();
        if (!post) throw new NotFoundException('게시글을 찾을 수 없어요');
        return { message: '삭제됐어요' };
    }
}
