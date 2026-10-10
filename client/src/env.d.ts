/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 后端 API 基础路径，如 /api 或 https://api.example.com */
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
