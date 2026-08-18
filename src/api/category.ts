import http from './request'
import type {CategoryCreateDTO, CategoryUpdateDTO, CategoryVO, OptionVO, PageQuery, PageVO} from './types'

export function getCategoryList(params: PageQuery) {
  return http.get<PageVO<CategoryVO>>('/admin/category/list', params)
}

export function getAllCategory() {
  return http.get<OptionVO[]>('/category/list')
}

export function createCategory(data: CategoryCreateDTO) {
  return http.post<void>('/admin/category', data)
}

export function updateCategory(data: CategoryUpdateDTO) {
  return http.put<void>('/admin/category', data)
}

export function deleteCategory(id: string) {
  return http.delete<void>(`/admin/category/${id}`)
}
