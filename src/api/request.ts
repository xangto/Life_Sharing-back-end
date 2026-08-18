import axios, { type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { clearToken, getToken } from '@/utils/auth'
import type { Result } from './types'

const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

// 并发 401 去重：首个 401 处理期间置位，其余 401 静默 reject，避免重复弹窗与跳转
let handling401 = false

request.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  (response) => {
    const res = response.data as Result
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    // 解包：调用方直接拿到 data
    // 类型断言以满足 axios 拦截器签名（运行时仍返回解包后的 data）
    return res.data as AxiosResponse
  },
  (error) => {
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/admin/user/login')
      if (isLoginRequest) {
        // 登录接口的 401（如密码错误）：提示原因，但不清理 token、不跳转
        ElMessage.error(error.response?.data?.message || '用户名或密码错误')
      } else if (!handling401) {
        handling401 = true
        clearToken()
        ElMessage.error(error.response?.data?.message || '登录已过期，请重新登录')
        const redirect = encodeURIComponent(window.location.hash.slice(1) || '/dashboard')
        window.location.hash = `#/login?redirect=${redirect}`
        setTimeout(() => {
          handling401 = false
        }, 2000)
      }
    } else {
      ElMessage.error(error.response?.data?.message || '网络异常，请稍后重试')
    }
    return Promise.reject(error)
  },
)

// 拦截器已将响应解包为 data，这里提供类型干净的调用签名
const http = {
  get: <T>(url: string, params?: object) => request.get(url, { params }) as unknown as Promise<T>,
  post: <T>(url: string, data?: object) => request.post(url, data) as unknown as Promise<T>,
  put: <T>(url: string, data?: object) => request.put(url, data) as unknown as Promise<T>,
  delete: <T>(url: string) => request.delete(url) as unknown as Promise<T>,
}

export default http
