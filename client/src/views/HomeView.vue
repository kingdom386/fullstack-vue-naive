<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NCard, NSpace, NButton, NTag } from 'naive-ui'
import { fetchHealth } from '@/api'

const health = ref<{ status: string; timestamp: string } | null>(null)
const loading = ref(false)

const loadHealth = async () => {
  loading.value = true
  try {
    health.value = await fetchHealth()
  } finally {
    loading.value = false
  }
}

onMounted(loadHealth)
</script>

<template>
  <n-space vertical :size="24">
    <n-card title="欢迎使用 Fullstack Vue Naive">
      <p>这是一个基于 <n-tag>Vue 3</n-tag> + <n-tag>Naive UI</n-tag> + <n-tag>Express</n-tag> 的全栈项目脚手架。</p>
      <p>前端运行在 <code>http://localhost:5173</code>，后端 API 运行在 <code>http://localhost:3000</code>。</p>
    </n-card>

    <n-card title="后端健康检查">
      <n-space vertical>
        <n-button :loading="loading" @click="loadHealth">刷新状态</n-button>
        <div v-if="health">
          <n-tag :type="health.status === 'ok' ? 'success' : 'error'">
            状态: {{ health.status }}
          </n-tag>
          <p style="margin-top: 8px">时间戳: {{ health.timestamp }}</p>
        </div>
      </n-space>
    </n-card>
  </n-space>
</template>
