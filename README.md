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
│   └── package.json
├── server/                 # Express 后端
│   ├── src/
│   │   ├── config/         # 配置
│   │   ├── controllers/    # 控制器
│   │   ├── middleware/     # 中间件
│   │   ├── routes/         # 路由
│   │   ├── app.ts
│   │   └── index.ts
│   ├── .env.example
│   └── package.json
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
