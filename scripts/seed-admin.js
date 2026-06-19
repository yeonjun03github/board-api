"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const bcrypt = __importStar(require("bcryptjs"));
const dotenv = __importStar(require("dotenv"));
const path_1 = require("path");
dotenv.config({ path: (0, path_1.resolve)(__dirname, '../.env') });
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
        console.log(`관리자 계정이 이미 존재해요: ${existing.username}`);
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
//# sourceMappingURL=seed-admin.js.map