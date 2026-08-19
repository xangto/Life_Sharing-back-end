import type {FriendPageDTO, FriendPublishDTO, FriendVO, PageVO} from "@/api/types.ts";
import http from "@/api/request.ts";

export function getFriendList(params: FriendPageDTO) {
  return http.get<PageVO<FriendVO>>('/admin/friend/list', params)
}

export function delFriend(id: string) {
  return http.delete<void>(`/admin/friend/${id}`)
}

export function updateFriendPublish(data: FriendPublishDTO) {
  return http.post<void>(`/admin/friend/publish`, data)
}
