<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50"
  >
    <div class="w-full max-w-sm px-6">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-semibold text-gray-800">Life 管理后台</h1>
        <p class="mt-2 text-sm text-gray-400">博客内容管理系统</p>
      </div>
      <div class="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          size="large"
          @keyup.enter="handleSubmit"
        >
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="用户名" autocomplete="username" :prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              autocomplete="current-password"
              show-password
              :prefix-icon="Lock"
            />
          </el-form-item>
          <el-button
            type="primary"
            class="w-full"
            size="large"
            :loading="loading"
            @click="handleSubmit"
          >
            登 录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const form = reactive({ username: '', password: '' })

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleSubmit() {
  if (loading.value) return
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    await auth.login({ ...form })
    ElMessage.success('登录成功')
    const raw = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    const redirect = raw.startsWith('/') ? raw : '/dashboard'
    router.push(redirect)
  } catch (e) {
    // 拦截器已对业务/网络错误统一提示；此处仅兜底拦截器未覆盖的错误（如登录响应缺 token 字段）
    const err = e as Error
    if (err.message === '登录响应缺少 token 字段') {
      ElMessage.error(err.message)
    }
  } finally {
    loading.value = false
  }
}
</script>
