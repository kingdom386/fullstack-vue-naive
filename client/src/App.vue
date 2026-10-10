<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { NConfigProvider, NLayout, NLayoutHeader, NLayoutContent, NMenu } from 'naive-ui'

const route = useRoute()

const menuOptions = [
  { label: '首页', key: '/' },
  { label: '用户', key: '/users' }
]

const activeKey = computed(() => route.path)
</script>

<template>
  <n-config-provider>
    <n-layout style="min-height: 100vh">
      <n-layout-header bordered style="padding: 0 24px">
        <div style="display: flex; align-items: center; height: 64px">
          <h2 style="margin: 0 32px 0 0">Fullstack Vue Naive</h2>
          <n-menu
            mode="horizontal"
            :options="menuOptions"
            :value="activeKey"
            @update:value="key => $router.push(key as string)"
          />
        </div>
      </n-layout-header>
      <n-layout-content style="padding: 24px">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-config-provider>
</template>

<style>
body {
  margin: 0;
}
</style>
