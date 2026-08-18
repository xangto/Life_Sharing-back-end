import http from './request'
import type {
  BlogCreateDTO, BlogInfoVO,
  BlogListQuery,
  BlogUpdateDTO,
  BlogUpdatePublishDTO,
  BlogUpdateTopDTO,
  BlogVO, OptionVO,
  PageVO,
} from './types'

export function getBlogList(params: BlogListQuery) {
  return http.get<PageVO<BlogVO>>('/admin/blog/list', params)
}

export function getAllBlog() {
  return http.get<OptionVO[]>('/blog/list')
}

export function getBlogDetail(id: string) {
  return http.get<BlogInfoVO>(`/admin/blog/${id}`)
}

export function createBlog(data: BlogCreateDTO) {
  return http.post<void>('/admin/blog', data)
}

export function updateBlog(data: BlogUpdateDTO) {
  return http.put<void>('/admin/blog', data)
}

export function deleteBlog(id: string) {
  return http.delete<void>(`/admin/blog/${id}`)
}

export function setBlogTop(data: BlogUpdateTopDTO) {
  return http.post<void>('/admin/blog/top', data)
}

export function setBlogPublish(data: BlogUpdatePublishDTO) {
  return http.post<void>('/admin/blog/publish', data)
}
