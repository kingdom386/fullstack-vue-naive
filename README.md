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
- Pino（结构化日志：开发环境彩色输出，生产环境 JSON）

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
├── .github/workflows/ci.yml # CI：代码门禁 + 镜像构建/发布（GHCR）
├── docker-compose.yml      # 本地/单机一键编排前端 + 后端
├── docker-compose.prod.yml # 生产覆盖配置（HTTPS：证书挂载 + 80/443 映射）
├── .dockerignore
├── eslint.config.mjs       # ESLint 9 flat config（前后端共用）
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
- 后端：`tsc 编译产物` → `node:20-alpine` 仅装生产依赖，并以非 root 用户 `node` 运行
- 两个镜像均带 OCI 标签（`org.opencontainers.image.*`），构建上下文由 `.dockerignore` 裁剪（排除 `node_modules`、`dist`、测试文件、`.env` 等）

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

compose 编排已内置部署所需的基础能力：

- **健康检查**：前后端均配置 `healthcheck`；前端通过 `depends_on.condition: service_healthy` 等后端就绪后再启动，避免代理到未就绪的后端
- **日志轮转**：`json-file` 限制单文件 10MB、最多 3 个，防止日志写满磁盘
- **镜像来源可切换**：`SERVER_IMAGE` / `CLIENT_IMAGE` 可指向镜像仓库地址（见 `.env.example`）

查看日志 / 停止：

```bash
docker compose logs -f
docker compose down
```

#### 启用 HTTPS（可选）

将证书放到仓库根目录 `certs/`（`fullchain.pem` + `privkey.pem`，该目录已被 gitignore 忽略），再叠加生产覆盖配置启动：

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

前端将以 HTTPS 暴露（默认 443，HTTP 自动 301 跳转），并附带 HSTS 等安全响应头；配置见 [client/nginx.https.conf](client/nginx.https.conf)。编排变量（端口、`CORS_ORIGIN`、`LOG_LEVEL` 等）可通过根目录 `.env` 覆盖，模板见 `.env.example`。

### 方式二：单独构建镜像

构建上下文为**仓库根目录**（需要根 `package-lock.json` 以复现依赖）：

```bash
docker build -f server/Dockerfile -t fullstack-vue-naive-server .
docker build -f client/Dockerfile -t fullstack-vue-naive-client .

docker run -d -p 3000:3000 -e CORS_ORIGIN=http://localhost:8080 fullstack-vue-naive-server
docker run -d -p 8080:80 fullstack-vue-naive-client
```

### 方式三：使用镜像仓库中的镜像部署

CI 会在 `push` 到 `main` 或推送 `v*` tag 时把镜像发布到 GHCR（`ghcr.io/<owner>/<repo>-server`、`-client`）。生产机器上无需源码构建，只需：

```bash
# 1. 在根目录 .env 中指定镜像来源（示例见 .env.example）
#    SERVER_IMAGE=ghcr.io/<owner>/<repo>-server:latest
#    CLIENT_IMAGE=ghcr.io/<owner>/<repo>-client:latest
# 2. 拉取并启动（--no-build 表示不本地构建）
docker compose pull
docker compose up -d --no-build
```

镜像仓库为私有时需先 `docker login ghcr.io`；回滚只需把镜像 tag 换成上一个版本后重新 `up -d`。

### Nginx 关键配置说明

见 [client/nginx.conf](client/nginx.conf)，包含：

- **SPA 路由回退**：`try_files $uri $uri/ /index.html`，解决刷新 404
- **静态资源强缓存**：`/assets/` 下带 hash 的文件缓存一年（`immutable`）
- **`index.html` 不缓存**：保证发布即时生效
- **gzip 压缩** + **`/api` 反向代理**到 `server:3000`

## CI/CD

[.github/workflows/ci.yml](.github/workflows/ci.yml) 在 `push`（`main` 或 `v*` tag）/ `PR` 到 `main` 时触发两个 Job：

1. **verify（代码门禁）**：`npm ci` → `npm run lint`（ESLint）→ `npm run typecheck`（前后端类型检查）→ `npm test`（Vitest 单测）→ `npm run build`（前后端构建）
2. **docker（镜像构建与发布）**：matrix 并行构建 server / client 镜像（Buildx + GHA 构建缓存）
   - PR：仅校验镜像可正常构建（`push: false`）
   - `push` 到 `main` / 推送 `v*` tag：登录 GHCR 并推送到 `ghcr.io/<owner>/<repo>-{server,client}`

镜像标签由 [docker/metadata-action](https://github.com/docker/metadata-action) 生成：分支名、tag 名、`sha-<短哈希>`，默认分支额外打 `latest`。生产部署见上文「方式三」。

本地可执行同样的门禁：

```bash
npm run lint
npm run typecheck
npm test
```
