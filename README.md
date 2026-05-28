# Instagram Clone

A full-stack Instagram-inspired social media app built with React, TypeScript, Express, Prisma, PostgreSQL, Redis, Cloudinary, Docker, and Nginx.

The project includes authentication, a protected feed, media upload, post creation, image filters, music selection, likes, comments, profile pages, and responsive navigation.

## Interface UI

| Home feed | Post detail |
| --- | --- |
| ![Home feed](frontend/public/screen/Screenshot%202026-05-28-74522.png) | ![Post detail](frontend/public/screen/Screenshot-2026-05-28-222905.png) |

| Edit filters | Create post |
| --- | --- |
| ![Edit filters](frontend/public/screen/Screenshot-2026-05-28-222920.png) | ![Create post](frontend/public/screen/Screenshot-2026-05-28-222601.png) |

## Features

- User authentication with access and refresh token flow.
- Protected routes for authenticated users and public routes for login/register.
- Instagram-style feed with stories, suggestions, post cards, and infinite loading support.
- Create post flow with media preview, image filters, captions, hashtags, location, and music picker.
- Like and comment interactions with optimistic frontend state management.
- Post detail modal with media carousel and comment list.
- Profile page and user-related API structure.
- Cloudinary-backed media upload service.
- PostgreSQL schema managed by Prisma migrations.
- Redis integration for cache/session-ready infrastructure.
- Docker Compose setup with Nginx reverse proxy.

## Future Features

- Real-time messaging with one-to-one and group conversations.
- Notification system for likes, comments, follows, mentions, and tags.
- Story and reel creation with music, views, likes, and comments.
- Follow request flow for private accounts.
- Explore page with search, hashtags, trending posts, and recommended users.
- Save collections and bookmarked posts.
- User settings for privacy, comment permissions, message permissions, and activity status.
- Report, block, and moderation workflows.
- Profile editing with avatar, bio, website, and account privacy controls.
- Better media tools such as crop, multi-image ordering, video trimming, and accessibility text.
- Email verification, forgot password, and account recovery.
- Admin dashboard for user, content, and report management.
- Deployment pipeline with production environment templates and CI checks.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, React Router, React Query, Zustand |
| UI | shadcn/radix-ui, lucide-react, motion, sonner, swiper |
| Backend | Node.js, Express 5, TypeScript, Prisma |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Media | Cloudinary, Multer |
| Validation | Zod |
| DevOps | Docker, Docker Compose, Nginx |

## Project Structure

```text
clone-instagram/
|-- backend/
|   |-- prisma/
|   |   |-- migrations/
|   |   |-- schema.prisma
|   |   `-- seed.ts
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- dto/
|   |   |-- middlewares/
|   |   |-- repositories/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- types/
|   |   `-- utils/
|   |-- Dockerfile
|   `-- package.json
|
|-- frontend/
|   |-- public/
|   |   `-- screen/
|   |-- src/
|   |   |-- features/
|   |   |-- layouts/
|   |   |-- pages/
|   |   |-- routes/
|   |   `-- shared/
|   |-- Dockerfile
|   `-- package.json
|
|-- docker/
|   `-- nginx/
|       `-- nginx.conf
|
|-- docker-compose.yml
`-- README.md
```

## API Overview

All backend routes are mounted under:

```text
/api/v1
```

| Module | Base route |
| --- | --- |
| Auth | `/api/v1/auth` |
| Users / profile | `/api/v1/users` |
| Media | `/api/v1/media` |
| Posts | `/api/v1/posts` |
| Feeds | `/api/v1/feeds` |
| Comments | `/api/v1/comments` |

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Docker 24+
- Docker Compose 2+
- Cloudinary account for media upload

### Environment Variables

Create `backend/.env`:

```env
PORT=3000
VERSION_API=/api/v1

DATABASE_URL="postgresql://postgres:password@postgres:5432/instagram_clone?schema=public"

REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=your_jwt_secret
JWT_EXPIRES=7d
JWT_REFRESH_EXPIRES=30d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

For local frontend development, create `frontend/.env` when you need a custom API origin:

```env
VITE_API_URL=http://localhost:3000
```

If `VITE_API_URL` is not set, the frontend falls back to `http://localhost`.

## Run With Docker

From the project root:

```bash
docker compose up --build
```

Run in the background:

```bash
docker compose up --build -d
```

Access the app:

| Service | URL |
| --- | --- |
| Web app | http://localhost |
| API health | http://localhost/api |
| API base | http://localhost/api/v1 |

Docker services:

| Service | Container | Port |
| --- | --- | --- |
| Frontend / Nginx | `instagram_frontend` | `80:80` |
| Backend API | `instagram_backend` | `3000` internal |
| PostgreSQL | `instagram_db` | `5432:5432` |
| Redis | `instagram_redis` | `6379:6379` |

## Run Locally

Start infrastructure with Docker:

```bash
docker compose up postgres redis -d
```

Install and run backend:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Install and run frontend:

```bash
cd frontend
npm install
npm run dev
```

Vite will start the frontend on:

```text
http://localhost:5173
```

## Useful Commands

Backend:

```bash
cd backend
npm run dev
npm run build
npm run lint
npm run prettier
npx prisma studio
npx prisma migrate dev
npx prisma db seed
```

Frontend:

```bash
cd frontend
npm run dev
npm run build
npm run lint
npm run preview
```

Docker:

```bash
docker compose logs -f
docker compose logs -f backend
docker compose restart backend
docker compose down
docker compose down -v
```

Database and Redis:

```bash
docker exec -it instagram_db psql -U postgres -d instagram_clone
docker exec -it instagram_redis redis-cli
```

## Notes

- The frontend calls API endpoints through `/api/v1`.
- Nginx proxies `/api` requests to the backend container.
- Prisma migrations are applied automatically when the backend Docker container starts.
- Uploaded media requires valid Cloudinary credentials.
- `docker compose down -v` removes database and Redis volumes.

## Author

Developed by Nguyen Thanh Duong (SugarDev).

## License

This project is for learning and development purposes.
