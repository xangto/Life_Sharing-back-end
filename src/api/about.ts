import type {AboutDTO, AboutVO} from "@/api/types.ts";
import http from "@/api/request.ts";

export function getAboutInfo() {
  return http.get<AboutVO>('/admin/about')
}

export function updateAboutInfo(data: AboutDTO) {
  return http.put<void>('/admin/about', data)
}
