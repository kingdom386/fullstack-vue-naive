# syntax=docker/dockerfile:1

# ---------- 构建阶段 ----------
# 使用 monorepo 根目录作为构建上下文，复用根 lock 文件保证依赖可复现
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
RUN npm ci --no-audit --no-fund

# client/tsconfig.json 继承上一级的 tsconfig.base.json
COPY tsconfig.base.json ./tsconfig.base.json
COPY client/ ./client
RUN npm run build -w client

# ---------- 运行阶段 ----------
FROM nginx:1.27-alpine AS runtime

LABEL org.opencontainers.image.title="fullstack-vue-naive-client" \
      org.opencontainers.image.description="Vue 3 + Naive UI 静态站点（Nginx 托管）"

# 自定义站点配置：SPA 回退、gzip、静态缓存、/api 反向代理
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/client/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]