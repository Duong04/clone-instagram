# 📸 Instagram Clone

A full-stack Instagram clone built with Node.js, React, PostgreSQL, and Redis. Deployed via Docker with Nginx as reverse proxy.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React + TypeScript + Vite |
| **Backend** | Node.js + TypeScript |
| **Database** | PostgreSQL 16 |
| **Cache** | Redis 7 |
| **Web Server** | Nginx |
| **Container** | Docker + Docker Compose |

---

## 📁 Project Structure

```
clone-instagram/
├── backend/                  # Node.js API server
│   ├── src/
│   ├── .env.example
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # React client
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── docker/
│   └── nginx/
│       └── nginx.conf        # Nginx reverse proxy config
│
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) >= 24.x
- [Docker Compose](https://docs.docker.com/compose/) >= 2.x

### 1. Clone the repository

```bash
git clone https://github.com/Duong04/clone-instagram.git
cd clone-instagram
```

### 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your configuration:

```env
# App
PORT=3000
NODE_ENV=production

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=instagram_clone

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

### 3. Build and run with Docker

```bash
# Build and start all services
docker compose up --build

# Run in background
docker compose up --build -d
```

### 4. Access the app

| Service | URL |
|---|---|
| **App** | http://localhost |
| **API** | http://localhost/api |

---

## 🐳 Docker Services

```
                    ┌─────────────────────────────┐
                    │         Nginx :80            │
                    │      (Reverse Proxy)         │
                    └──────────┬──────────┬────────┘
                               │          │
                    /api/*     │          │    /*
                               ▼          ▼
                    ┌──────────────┐  ┌──────────────┐
                    │  Backend     │  │  Frontend    │
                    │  :3000       │  │  (static)    │
                    └──────┬───┬──┘  └──────────────┘
                           │   │
              ┌────────────┘   └────────────┐
              ▼                             ▼
    ┌──────────────────┐        ┌──────────────────┐
    │   PostgreSQL     │        │      Redis        │
    │   :5432          │        │      :6379        │
    └──────────────────┘        └──────────────────┘
```

| Service | Internal Port | Description |
|---|---|---|
| `frontend` | 80 | Nginx serves React app + proxies API |
| `backend` | 3000 | REST API (internal only) |
| `postgres` | 5432 | PostgreSQL database (internal only) |
| `redis` | 6379 | Redis cache (internal only) |

> ⚠️ Only port **80** is exposed to the host. All other services communicate internally via Docker network.

---

## 🛠️ Development

### Run locally without Docker

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Useful Docker commands

```bash
# View logs of all services
docker compose logs -f

# View logs of a specific service
docker compose logs -f backend

# Restart a specific service
docker compose restart backend

# Stop all services
docker compose down

# Stop and remove volumes (⚠️ deletes database data)
docker compose down -v

# Rebuild a specific service
docker compose up --build backend
```

### Access database directly

```bash
docker exec -it instagram_db psql -U postgres -d instagram_clone
```

### Access Redis CLI

```bash
docker exec -it instagram_redis redis-cli
```

---

## 📦 Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Backend server port | `3000` |
| `NODE_ENV` | Environment | `production` |
| `DB_HOST` | PostgreSQL host | `postgres` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | PostgreSQL user | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | - |
| `DB_NAME` | Database name | `instagram_clone` |
| `REDIS_HOST` | Redis host | `redis` |
| `REDIS_PORT` | Redis port | `6379` |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiry duration | `7d` |

---

## 📄 License

This project is for educational purposes only.