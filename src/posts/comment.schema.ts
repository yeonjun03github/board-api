import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
    @Prop({ required: true })
    postId: string;

    @Prop({ required: true })
    author: string;

    @Prop({ required: true })
    authorId: string;

    @Prop({ required: true })
    text: string;

    @Prop({ type: String, default: null })
    parentId: string | null;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
