<template>
  <div class="mx-auto max-w-md">
    <h2 class="mb-4 text-xl font-semibold text-gray-800">修改密码</h2>
    <div class="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="90px"
        @keyup.enter="handleSubmit"
      >
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input v-model="form.oldPwd" type="password" show-password autocomplete="current-password" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="form.newPwd" type="password" show-password autocomplete="new-password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input v-model="form.confirmPwd" type="password" show-password autocomplete="new-password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="saving" @click="handleSubmit">确认修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { updatePassword } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const formRef = ref<FormInstance>()
const saving = ref(false)
const form = reactive({ oldPwd: '', newPwd: '', confirmPwd: '' })

const rules: FormRules = {
  oldPwd: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' },
  ],
  confirmPwd: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (_rule, value: string, callback) => {
        if (value !== form.newPwd) callback(new Error('两次输入的密码不一致'))
        else callback()
      },
      trigger: 'blur',
    },
  ],
}

async function handleSubmit() {
  if (saving.value) return
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    // 文档要求 userId/username 字段；后端若从 token 解析则忽略这两个值，联调时确认
    await updatePassword({
      username: auth.username,
      oldPwd: form.oldPwd,
      newPwd: form.newPwd,
    })
    ElMessage.success('密码修改成功，请重新登录')
    auth.logout()
    router.push('/login')
  } catch {
    // 错误提示已由拦截器统一处理
  } finally {
    saving.value = false
  }
}
</script>
