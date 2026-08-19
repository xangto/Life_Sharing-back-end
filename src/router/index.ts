import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utils/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘' },
      },
      {
        path: 'blog',
        name: 'BlogList',
        component: () => import('@/views/blog/index.vue'),
        meta: { title: '文章管理' },
      },
      {
        path: 'blog/edit/:id?',
        name: 'BlogEdit',
        component: () => import('@/views/blog/edit.vue'),
        meta: { title: '文章编辑' },
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/category/index.vue'),
        meta: { title: '分类管理' },
      },
      {
        path: 'tag',
        name: 'Tag',
        component: () => import('@/views/tag/index.vue'),
        meta: { title: '标签管理' },
      },
      {
        path: 'moment',
        name: 'Moment',
        component: () => import('@/views/moment/index.vue'),
        meta: { title: '动态管理' },
      },
      {
        path: 'comment',
        name: 'Comment',
        component: () => import('@/views/comment/index.vue'),
        meta: { title: '评论管理' },
      },
      {
        path: 'friend',
        name: 'friend',
        component: () => import('@/views/friend/index.vue'),
        meta: { title: '友链管理' },
      },
      {
        path: 'password',
        name: 'Password',
        component: () => import('@/views/password/index.vue'),
        meta: { title: '修改密码' },
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} · Life 管理后台` : 'Life 管理后台'

  if (!getToken() && to.path !== '/login') {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (getToken() && to.path === '/login') {
    return '/dashboard'
  }
})

export default router
