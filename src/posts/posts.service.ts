import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { Comment, CommentDocument } from './comment.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    ) {}

    private validateId(id: string) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException(`${id}는 유효하지 않은 ID 형식이에요`);
        }
    }

    async create(dto: CreatePostDto, authorId: string, author: string): Promise<Post> {
        return await this.postModel.create({ ...dto, authorId, author });
    }

    async findAll(search?: string): Promise<Post[]> {
        if (!search) return await this.postModel.find().sort({ createdAt: -1 }).exec();
        return await this.postModel.find({
            $or: [
                { title:   { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { author:  { $regex: search, $options: 'i' } },
            ],
        }).sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<Post> {
        this.validateId(id);
        const post = await this.postModel
            .findByIdAndUpdate(id, { $inc: { views: 1 } }, { returnDocument: 'after' })
            .exec();
        if (!post) throw new NotFoundException(`게시글을 찾을 수 없어요`);
        return post;
    }

    async update(id: string, dto: UpdatePostDto, userId: string): Promise<Post> {
        this.validateId(id);
        const post = await this.postModel.findById(id).exec();
        if (!post) throw new NotFoundException(`게시글을 찾을 수 없어요`);
        if (post.authorId !== userId) throw new ForbiddenException('본인이 작성한 글만 수정할 수 있어요');
        return (await this.postModel.findByIdAndUpdate(id, dto, { returnDocument: 'after' }).exec())!;
    }

    async remove(id: string, userId: string): Promise<Post> {
        this.validateId(id);
        const post = await this.postModel.findById(id).exec();
        if (!post) throw new NotFoundException(`게시글을 찾을 수 없어요`);
        if (post.authorId !== userId) throw new ForbiddenException('본인이 작성한 글만 삭제할 수 있어요');
        await this.postModel.findByIdAndDelete(id).exec();
        await this.commentModel.deleteMany({ postId: id }).exec();
        return post;
    }

    async getComments(postId: string): Promise<Comment[]> {
        this.validateId(postId);
        return await this.commentModel.find({ postId }).sort({ createdAt: 1 }).exec();
    }

    async addComment(postId: string, dto: CreateCommentDto, author: string, authorId: string): Promise<Comment> {
        this.validateId(postId);
        const post = await this.postModel.findById(postId).exec();
        if (!post) throw new NotFoundException(`게시글을 찾을 수 없어요`);
        return await this.commentModel.create({ postId, ...dto, author, authorId });
    }
}
