// 通用响应与分页
export interface Result<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PageQuery {
  pageNum: number
  pageSize: number
}

export interface PageVO<T> {
  pageNum: number
  pageSize: number
  total: number
  pages: number
  records: T[]
}

// 通用下拉选项
export interface OptionVO {
  label: string
  value: string | number
}

// 标签
export interface TagVO {
  id: string
  name: string
  color: string
}

export interface TagCreateDTO {
  name: string
  color: string
}

export interface TagUpdateDTO {
  id: string
  name: string
  color: string
}

// 文章分类
export interface CategoryVO {
  id: string
  name: string
}

export interface CategoryCreateDTO {
  name: string
}

export interface CategoryUpdateDTO {
  id: string
  name: string
}

// 动态
export interface MomentVO {
  id: string
  content: string
  likes: number
  isPublished: boolean
  createTime: string
}

export interface MomentCreateDTO {
  content: string
  isPublished: boolean
}

export interface MomentUpdateDTO {
  id: string
  content: string
  isPublished: boolean
}

export interface MomentPublishDTO {
  id: string
  isPublished: boolean
}

// 文章
export interface BlogVO {
  id: string
  title: string
  firstPicture: string
  description: string
  content: string
  isPublished: boolean
  views: number
  words: number
  readTime: number
  isTop: boolean
  categoryId: string
  updateTime: string
  createTime: string
}

// 文章详情
export interface BlogInfoVO {
  id: string
  title: string
  firstPicture: string
  description: string
  content: string
  isPublished: boolean
  views: number
  words: number
  readTime: number
  isTop: boolean
  categoryId: string
  tags: string[]
  userId: string
  updateTime: string
}

// 注意：文档中 Create/Update 的 categoryId 为 string（与 VO 的 number 不同）
export interface BlogCreateDTO {
  title: string
  firstPicture: string
  description?: string
  content: string
  isPublished: boolean
  words: number
  readTime: number
  categoryId: string
  tags?: string
}

export interface BlogUpdateDTO extends BlogCreateDTO {
  id: string
}

export interface BlogListQuery extends PageQuery {
  categoryId?: string
  title?: string
}

export interface BlogUpdateTopDTO {
  id: string
  isTop: boolean
}

export interface BlogUpdatePublishDTO {
  id: string
  isPublished: boolean
}

// 评论
export interface CommentVO {
  id: string
  nickname: string
  email: string
  content: string
  avatar: string
  ip: string
  blogId: string
  website: string
  parentId: string
  type: number
  isAdminComment: boolean
  isPublished: boolean
  createTime: string
  children: CommentVO[]
}

export interface CommentListQuery extends PageQuery {
  blogId?: string
}

// 友链
export interface FriendVO {
  id: string
  nickname: string
  avatar: string
  description: string
  website: string
  isPublished: boolean
  views: number
  createTime: string
}

export interface FriendPageDTO extends PageQuery {
  nickname: string
  website: string
}

export interface FriendPublishDTO {
  id: string
  isPublished: boolean
}

// 关于我
interface AboutItem {
  id: number
  title: string
  content: string
}

export type AboutVO = Record<string, AboutItem>

export type AboutDTO = Record<string, AboutItem>

// 用户
export interface LoginDTO {
  username: string
  password: string
}

// 登录响应中 token 字段名待与后端联调确认（文档未写明，先按 token 实现）
export interface LoginResult {
  token: string
}

export interface UpdatePwdDTO {
  username: string
  oldPwd: string
  newPwd: string
}
