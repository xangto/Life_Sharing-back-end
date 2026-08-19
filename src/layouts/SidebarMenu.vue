<template>
  <aside class="flex w-52 shrink-0 flex-col border-r border-gray-100 bg-white">
    <div class="flex h-14 items-center justify-center gap-2 border-b border-gray-100">
      <el-icon :size="22" color="#409eff"><Platform /></el-icon>
      <span class="text-base font-semibold text-gray-800">Life 管理后台</span>
    </div>
    <el-menu :default-active="activeMenu" router class="flex-1 border-r-0">
      <el-menu-item v-for="item in menus" :key="item.path" :index="item.path">
        <el-icon >
          <component v-if="item.icon" :is="item.icon" />
          <Icon v-else :icon="item.iconName" size="18" />
        </el-icon>

        <span>{{ item.label }}</span>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  ChatDotRound,
  ChatLineRound,
  Document,
  Folder,
  House,
  Platform,
  PriceTag,
} from '@element-plus/icons-vue'
import {Icon} from "@iconify/vue";


const route = useRoute()

const menus = [
  { path: '/dashboard', label: '仪表盘', icon: House },
  { path: '/blog', label: '文章管理', icon: Document },
  { path: '/category', label: '分类管理', icon: Folder },
  { path: '/tag', label: '标签管理', icon: PriceTag },
  { path: '/moment', label: '动态管理', icon: ChatDotRound },
  { path: '/comment', label: '评论管理', icon: ChatLineRound },
  { path: '/friend', label: '友链管理', iconName: 'wordpress:people' },
]

// 文章编辑页归属"文章管理"菜单高亮
const activeMenu = computed(() => {
  if (route.path.startsWith('/blog')) return '/blog'
  return route.path
})
</script>
