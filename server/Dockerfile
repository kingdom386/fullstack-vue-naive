# syntax=docker/dockerfile:1

# ---------- 构建阶段 ----------
# 使用 monorepo 根目录作为构建上下文，复用根 lock 文件保证依赖可复现
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
RUN npm ci --no-audit --no-fund

# server/tsconfig.json 继承上一级的 tsconfig.base.json
COPY tsconfig.base.json ./tsconfig.base.json
COPY server/ ./server
RUN npm run build -w server

# ---------- 运行阶段 ----------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

LABEL org.opencontainers.image.title="fullstack-vue-naive-server" \
      org.opencontainers.image.description="Express + TypeScript API 服务"

# 仅安装 server 的生产依赖，避免带入前端依赖，减小镜像体积
COPY package.json package-lock.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
RUN npm ci --omit=dev --workspace server --no-audit --no-fund && npm cache clean --force

COPY --from=build --chown=node:node /app/server/dist ./server/dist

EXPOSE 3000
# 以非 root 用户运行，降低容器逃逸风险
USER node
CMD ["node", "server/dist/index.js"]