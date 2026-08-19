<template>
  <aside class="flex w-52 shrink-0 flex-col border-r border-gray-100 bg-white">
    <div class="flex h-14 items-center justify-center gap-2 border-b border-gray-100">
      <el-icon :size="22" color="#409eff">
        <Platform/>
      </el-icon>
      <span class="text-base font-semibold text-gray-800">Life 管理后台</span>
    </div>
    <el-menu :default-active="activeMenu" router class="flex-1 border-r-0">
      <menu-item v-for="item in menus" :key="item.label" :item="item"></menu-item>
    </el-menu>
  </aside>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import {
  Platform,
} from '@element-plus/icons-vue'


const route = useRoute()

const menus = [
  {path: '/dashboard', label: '首页', iconName: 'material-symbols:house-outline'},
  {
    path: '/blog', label: '博客管理', iconName: 'carbon:blog',
    children: [
      {path: '/blog', label: '文章管理', iconName: 'line-md:document'},
      {path: '/category', label: '分类管理', iconName: 'material-symbols:folder-outline'},
      {path: '/tag', label: '标签管理', iconName: 'ion:pricetag-outline'},
      // {path: '/moment', label: '动态管理', iconName: 'material-symbols:chat-outline'},
      {path: '/comment', label: '评论管理', iconName: 'line-md:chat-round'},
    ]
  },
  {
    path: '/pageManagement', label: '页面管理', iconName: 'icon-park-outline:web-page',
    children: [
      {path: '/friend', label: '友链管理', iconName: 'mdi:people'},
      {path: '/about', label: '关于我', iconName: 'cib:about-me'},
    ]
  }
]

// 文章编辑页归属"文章管理"菜单高亮
const activeMenu = computed(() => {
  if (route.path.startsWith('/blog')) return '/blog'
  return route.path
})
</script>
