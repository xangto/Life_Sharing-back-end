<template>
  <div>
    <h2 class="pb-4 text-xl font-semibold text-gray-800">首页</h2>
    <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <el-skeleton
        v-for="i in 4"
        :key="i"
        animated
        class="rounded-lg border border-gray-100 bg-white p-5 shadow-sm"
      />
    </div>
    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="item in stats"
        :key="item.label"
        class="cursor-pointer rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
        @click="router.push(item.path)"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">{{ item.label }}</p>
            <p class="mt-2 text-3xl font-semibold text-gray-800">{{ item.count }}</p>
          </div>
          <el-icon :size="36" :color="item.color"><component :is="item.icon" /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChatDotRound, Document, Folder, PriceTag } from '@element-plus/icons-vue'
import { getBlogList } from '@/api/blog'
import { getCategoryList } from '@/api/category'
import { getMomentList } from '@/api/moment'
import { getTagList } from '@/api/tag'

const router = useRouter()
const loading = ref(false)

const stats = ref([
  { label: '文章', count: 0, icon: Document, color: '#409eff', path: '/blog' },
  { label: '分类', count: 0, icon: Folder, color: '#67c23a', path: '/category' },
  { label: '标签', count: 0, icon: PriceTag, color: '#e6a23c', path: '/tag' },
  { label: '动态', count: 0, icon: ChatDotRound, color: '#f56c6c', path: '/moment' },
])

onMounted(async () => {
  loading.value = true
  try {
    const [blog, category, tag, moment] = await Promise.all([
      getBlogList({ pageNum: 1, pageSize: 1 }),
      getCategoryList({ pageNum: 1, pageSize: 1 }),
      getTagList({ pageNum: 1, pageSize: 1 }),
      getMomentList({ pageNum: 1, pageSize: 1 }),
    ])
    stats.value[0].count = blog.total
    stats.value[1].count = category.total
    stats.value[2].count = tag.total
    stats.value[3].count = moment.total
  } catch {
    // 错误提示已由拦截器统一处理
  } finally {
    loading.value = false
  }
})
</script>
