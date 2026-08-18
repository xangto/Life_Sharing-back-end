import http from './request'
import type {CommentListQuery, CommentVO, PageVO} from './types'

export function getCommentList(params: CommentListQuery) {
  return http.get<PageVO<CommentVO>>('/admin/comment', params)
}

export function delComment(id: string) {
  return http.delete<void>(`/admin/comment/${id}`)
}

export function updateCommentPublish(id: string, isPublished: boolean) {
  return http.post<void>(`/admin/comment/publish`, {id, isPublished})
}
