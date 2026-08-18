import http from './request'
import type {OptionVO, PageQuery, PageVO, TagCreateDTO, TagUpdateDTO, TagVO} from './types'

export function getTagList(params: PageQuery) {
  return http.get<PageVO<TagVO>>('/admin/tag/list', params)
}

export function getAllTag() {
  return http.get<OptionVO[]>('/tag/list')
}

export function createTag(data: TagCreateDTO) {
  return http.post<void>('/admin/tag', data)
}

export function updateTag(data: TagUpdateDTO) {
  return http.put<void>('/admin/tag', data)
}

export function deleteTag(id: string) {
  return http.delete<void>(`/admin/tag/${id}`)
}
