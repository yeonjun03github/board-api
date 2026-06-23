# board-api (미완성)

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | NestJS 11 |
| 언어 | TypeScript 5.7 |
| DB | MongoDB (Mongoose 9) |
| 인증 | JWT (7일 유효) |

## 조사 필요

| 분류 | 기술 |
|------|------|
| 비밀번호 | bcryptjs |
| 파일 업로드 | Multer |
| 정적 파일 | @nestjs/serve-static |

---

## 프로젝트 구조

```
src/
├── auth/        # 로그인·회원가입, JWT Guard, Admin Guard
├── users/       # 사용자 프로필, 비밀번호 변경
├── posts/       # 게시글 CRUD, 댓글
├── admin/       # 관리자 기능 (사용자·게시글 관리)
└── upload/      # 이미지 업로드

public/
├── index.html   # 홈
├── board.html   # 게시판
├── login.html   # 로그인·회원가입
├── profile.html # 프로필 관리
├── admin.html   # 관리자 패널
└── auth.js      # 클라이언트 인증 유틸
```

---

## 환경 변수

`.env` 파일을 루트에 생성하세요.

```env
MONGODB_URI=mongodb://localhost:27017/board
PORT=3000
JWT_SECRET=your-secret-key
```

---

## 실행

```bash
# 의존성 설치
yarn install

# 개발 서버
yarn start:dev

# 프로덕션
yarn build && yarn start:prod

# 관리자 계정 시딩
yarn seed:admin
```

서버 실행 후 http://localhost:3000 에서 확인할 수 있습니다.

---

## API 엔드포인트

### 인증 `/api/auth`

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/auth/register` | 회원가입 |
| POST | `/api/auth/login` | 로그인 → JWT 반환 |

### 사용자 `/api/users` (JWT 필요)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/users/me` | 내 정보 조회 |
| PATCH | `/api/users/me` | 닉네임·이메일 수정 |
| PATCH | `/api/users/me/password` | 비밀번호 변경 |
| GET | `/api/users/me/posts` | 내 게시글 목록 |

### 게시글 `/posts`

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| GET | `/posts` | - | 목록 조회 (검색: `?search=키워드`) |
| GET | `/posts/:id` | - | 상세 조회 |
| POST | `/posts` | JWT | 게시글 작성 |
| PATCH | `/posts/:id` | JWT | 수정 (작성자만) |
| DELETE | `/posts/:id` | JWT | 삭제 (작성자만) |
| GET | `/posts/:id/comments` | - | 댓글 목록 |
| POST | `/posts/:id/comments` | - | 댓글 추가 |

### 파일 업로드

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/upload` | 이미지 업로드 (jpg·png·gif·webp, 최대 5MB) |

### 관리자 `/api/admin` (관리자 계정 필요)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/admin/stats` | 통계 (사용자·게시글·오늘 가입자·차단 수) |
| GET | `/api/admin/users` | 사용자 목록 |
| GET | `/api/admin/users/:id` | 사용자 상세 + 게시글 |
| POST | `/api/admin/users/:id/ban` | 차단 (기간·사유 지정) |
| POST | `/api/admin/users/:id/unban` | 차단 해제 |
| DELETE | `/api/admin/users/:id` | 강제탈퇴 (게시글 포함 삭제) |
| GET | `/api/admin/posts` | 게시글 목록 (검색: `?q=키워드`) |
| PATCH | `/api/admin/posts/:id` | 게시글 수정 |
| DELETE | `/api/admin/posts/:id` | 게시글 삭제 |

---

## 주요 기능

### 인증
- JWT 기반 (유효기간 7일, 상용화 시 변경)
- 차단 계정 로그인 시 차단 기간·사유 안내
- 차단 기간 만료 시 자동 해제

### 게시판
- 제목·내용·작성자 통합 검색 (정규식, 대소문자 구분 없음)
- 게시글 삭제 시 관련 댓글 함께 삭제

## 조사 필요

### 파일 업로드
- 저장 경로: `public/uploads/`
- 파일명: `{timestamp}-{random}.{ext}` (중복 방지)
- 응답: `{ url: "/uploads/파일명" }`

### 입력 검증
- 전역 `ValidationPipe` 적용
- DTO에 없는 필드 자동 제거 (`whitelist: true`)
- 한글 에러 메시지 제공

---

## 데이터 모델

### User
```
username    String  (고유, 4~20자)
password    String  (bcrypt 해싱)
nickname    String
email       String  (선택)
role        'user' | 'admin'
status      'active' | 'banned'
banUntil    Date    (차단 만료일)
banReason   String
lastLoginAt Date
```

### Post
```
title     String
content   String
author    String  (닉네임)
authorId  String
```

### Comment
```
postId  String
author  String
text    String
```
