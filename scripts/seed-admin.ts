import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    nickname: { type: String, required: true, trim: true },
    email: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    lastLoginAt: { type: Date, default: null },
    status: { type: String, enum: ['active', 'banned'], default: 'active' },
    banUntil: { type: Date, default: null },
    banReason: { type: String, default: '' },
}, { timestamps: true });

async function seed() {
    const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/board';
    await mongoose.connect(uri);

    const UserModel = mongoose.model('User', userSchema);

    const existing = await UserModel.findOne({ role: 'admin' });
    if (existing) {
        console.log(`관리자 계정이 이미 존재합니다: ${existing.username}`);
        await mongoose.disconnect();
        return;
    }

    const password = await bcrypt.hash('Admin1234!', 10);
    await UserModel.create({
        username: 'admin',
        password,
        nickname: '관리자',
        role: 'admin',
    });

    console.log('관리자 계정 생성 완료');
    console.log('  아이디: admin');
    console.log('  비밀번호: Admin1234!');
    console.log('  ※ 로그인 후 반드시 비밀번호를 변경하세요');
    await mongoose.disconnect();
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
