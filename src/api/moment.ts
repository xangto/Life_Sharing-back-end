import http from './request'
import type {
  MomentCreateDTO,
  MomentPublishDTO,
  MomentUpdateDTO,
  MomentVO,
  PageQuery,
  PageVO,
} from './types'

export function getMomentList(params: PageQuery) {
  return http.get<PageVO<MomentVO>>('/admin/moment/list', params)
}

export function createMoment(data: MomentCreateDTO) {
  return http.post<void>('/admin/moment', data)
}

export function updateMoment(data: MomentUpdateDTO) {
  return http.put<void>('/admin/moment', data)
}

export function publishMoment(data: MomentPublishDTO) {
  return http.put<void>('/admin/moment/publish', data)
}

export function deleteMoment(id: string) {
  return http.delete<void>(`/admin/moment/${id}`)
}
