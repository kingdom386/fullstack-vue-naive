# fullstack-vue-naive

基于 **Vue 3 + Naive UI** 前端与 **Express + TypeScript** 后端的全栈项目脚手架，使用 npm workspaces 管理的 monorepo。

## 技术栈

### 前端 (`client/`)
- Vue 3 + TypeScript
- Vite
- Naive UI（组件库）
- Vue Router
- Pinia
- Axios

### 后端 (`server/`)
- Node.js + Express
- TypeScript
- Helmet（安全）
- CORS
- Morgan（日志）

## 项目结构

```
fullstack-vue-naive/
├── client/                 # Vue 3 + Naive UI 前端
│   ├── src/
│   │   ├── api/            # API 请求封装
│   │   ├── router/         # 路由配置
│   │   ├── views/          # 页面组件
│   │   ├── App.vue
│   │   └── main.ts
│   ├── index.html
│   ├── vite.config.ts
│   ├── nginx.conf          # Nginx 站点配置（SPA 回退 / gzip / 反向代理）
│   ├── Dockerfile          # 多阶段构建：Vite 构建 + Nginx 托管
│   └── package.json
├── server/                 # Express 后端
│   ├── src/
│   │   ├── config/         # 配置
│   │   ├── controllers/    # 控制器
│   │   ├── middleware/     # 中间件
│   │   ├── routes/         # 路由
│   │   ├── app.ts
│   │   └── index.ts
│   ├── Dockerfile          # 多阶段构建：tsc 编译 + 精简运行镜像
│   ├── .env.example
│   └── package.json
├── .github/workflows/ci.yml # CI：类型检查、构建、镜像构建校验
├── docker-compose.yml      # 本地/单机一键编排前端 + 后端
├── package.json            # 根配置（npm workspaces）
├── tsconfig.base.json
└── .gitignore
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp server/.env.example server/.env
```

### 3. 启动开发环境

同时启动前后端：

```bash
npm run dev
```

或分别启动：

```bash
npm run dev:server   # 后端 http://localhost:3000
npm run dev:client   # 前端 http://localhost:5173
```

### 4. 构建生产版本

```bash
npm run build
npm start
```

## API 接口

| 方法 | 路径            | 描述           |
| ---- | --------------- | -------------- |
| GET  | `/api/health`   | 健康检查       |
| GET  | `/api/users`    | 获取用户列表   |
| GET  | `/api/users/:id`| 根据 ID 获取用户 |

前端开发服务器已配置代理，`/api` 请求会自动转发到后端 `http://localhost:3000`。

## 容器化部署

前后端均为**多阶段构建**：构建阶段用 `node:20-alpine` 编译，运行阶段只保留产物与生产依赖，镜像体积更小。

- 前端：`Vite 构建产物` → `nginx:alpine` 托管静态文件
- 后端：`tsc 编译产物` → `node:20-alpine` 仅装生产依赖

### 方式一：Docker Compose 一键启动（推荐）

```bash
# 在仓库根目录执行
docker compose up -d --build
```

启动后：

| 服务 | 地址 | 说明 |
| ---- | ---- | ---- |
| 前端 | http://localhost:8080 | Nginx 托管，`/api` 自动代理到后端 |
| 后端 | http://localhost:3000 | Express API |

查看日志 / 停止：

```bash
docker compose logs -f
docker compose down
```

### 方式二：单独构建镜像

构建上下文为**仓库根目录**（需要根 `package-lock.json` 以复现依赖）：

```bash
docker build -f server/Dockerfile -t fullstack-vue-naive-server .
docker build -f client/Dockerfile -t fullstack-vue-naive-client .

docker run -d -p 3000:3000 -e CORS_ORIGIN=http://localhost:8080 fullstack-vue-naive-server
docker run -d -p 8080:80 fullstack-vue-naive-client
```

### Nginx 关键配置说明

见 [client/nginx.conf](client/nginx.conf)，包含：

- **SPA 路由回退**：`try_files $uri $uri/ /index.html`，解决刷新 404
- **静态资源强缓存**：`/assets/` 下带 hash 的文件缓存一年（`immutable`）
- **`index.html` 不缓存**：保证发布即时生效
- **gzip 压缩** + **`/api` 反向代理**到 `server:3000`

## CI/CD

[.github/workflows/ci.yml](.github/workflows/ci.yml) 在 `push` / `PR` 到 `main` 时触发两个 Job：

1. **verify**：`npm ci` → `npm run lint`（前后端类型检查）→ `npm run build`（前后端构建）
2. **docker**：用 Buildx 校验两个镜像可正常构建（不推送）

> 如需自动发布镜像，可在 docker Job 中增加 `docker/login-action` 与 `push: true`，推送到 GHCR 或其他镜像仓库。
