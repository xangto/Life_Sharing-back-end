import http from './request'
import type { LoginDTO, LoginResult, UpdatePwdDTO } from './types'

export function login(data: LoginDTO) {
  return http.post<LoginResult>('/admin/user/login', data)
}

export function updatePassword(data: UpdatePwdDTO) {
  return http.post<void>('/admin/user/update/password', data)
}
