import { ref } from 'vue'
import { defineStore } from 'pinia'
import { login as loginApi } from '@/api/auth'
import type { LoginDTO } from '@/api/types'
import { clearToken, getToken, setToken } from '@/utils/auth'

const USERNAME_KEY = 'life-admin-username'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getToken() ?? '')
  const username = ref(localStorage.getItem(USERNAME_KEY) ?? '')

  async function login(data: LoginDTO) {
    const res = await loginApi(data)
    // token 字段名待联调确认；缺失时显式失败，避免把 "undefined" 持久化为 token
    if (!res.token) {
      throw new Error('登录响应缺少 token 字段')
    }
    token.value = res.token
    username.value = data.username
    setToken(res.token)
    localStorage.setItem(USERNAME_KEY, data.username)
  }

  function logout() {
    token.value = ''
    username.value = ''
    clearToken()
    localStorage.removeItem(USERNAME_KEY)
  }

  return { token, username, login, logout }
})
