<template>
  <header class="flex h-14 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ route.meta.title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown @command="handleCommand">
      <span class="flex cursor-pointer items-center gap-2">
        <el-avatar :size="30" :style="{ background: '#ecf5ff', color: '#409eff' }">
          {{ avatarText }}
        </el-avatar>
        <span class="text-sm text-gray-700">{{ auth.username || '管理员' }}</span>
        <el-icon><ArrowDown/></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="github">
            <template #icon>
              <Icon icon="mdi:github" size="18"/>
            </template>
            <el-link href="https://github.com/xangto" target="_blank">github</el-link>
          </el-dropdown-item>
          <el-dropdown-item command="password" divided :icon="Lock">修改密码</el-dropdown-item>
          <el-dropdown-item command="logout" divided :icon="SwitchButton">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </header>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {ElMessageBox} from 'element-plus'
import {ArrowDown, Lock, SwitchButton} from '@element-plus/icons-vue'
import {useAuthStore} from '@/stores/auth'
import {Icon} from '@iconify/vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const avatarText = computed(() => (auth.username || 'A').slice(0, 1).toUpperCase())

async function handleCommand(command: string | number | object) {
  if (command === 'password') {
    router.push('/password')
  } else if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定退出登录吗？', '提示', {type: 'warning'})
    } catch {
      return
    }
    auth.logout()
    router.push('/login')
  }
}
</script>
