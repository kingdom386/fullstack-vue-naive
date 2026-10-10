<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NCard, NDataTable, NButton, NSpace, type DataTableColumns } from 'naive-ui'
import { fetchUsers, type User } from '@/api'

const users = ref<User[]>([])
const loading = ref(false)

const columns: DataTableColumns<User> = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '姓名', key: 'name' },
  { title: '邮箱', key: 'email' }
]

const loadUsers = async () => {
  loading.value = true
  try {
    users.value = await fetchUsers()
  } finally {
    loading.value = false
  }
}

onMounted(loadUsers)
</script>

<template>
  <n-card title="用户列表">
    <n-space vertical>
      <n-button :loading="loading" @click="loadUsers">刷新</n-button>
      <n-data-table
        :columns="columns"
        :data="users"
        :loading="loading"
        :bordered="false"
        size="small"
      />
    </n-space>
  </n-card>
</template>
