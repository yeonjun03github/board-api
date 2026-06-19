import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, trim: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, trim: true })
    nickname: string;

    @Prop({ trim: true, default: '' })
    email: string;

    @Prop({ enum: ['user', 'admin'], default: 'user' })
    role: string;

    @Prop({ default: null })
    lastLoginAt: Date;

    @Prop({ enum: ['active', 'banned'], default: 'active' })
    status: string;

    @Prop({ default: null })
    banUntil: Date;

    @Prop({ default: '' })
    banReason: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
