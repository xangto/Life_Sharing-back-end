<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-800">文章管理</h2>
      <el-button type="primary" :icon="Plus" @click="router.push('/blog/edit')">
        新增文章
      </el-button>
    </div>

    <div class="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <el-form inline :model="query" @submit.prevent>
        <el-form-item label="标题">
          <el-input
              v-model="query.title"
              placeholder="按标题搜索"
              clearable
              class="w-52"
              @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="query.categoryId" placeholder="全部分类" clearable
                     style="width: calc(var(--spacing) * 44)">
            <el-option
                v-for="c in categories"
                :key="c.value"
                :label="c.label"
                :value="c.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="rows">
        <!--        <el-table-column prop="id" label="ID" width="70"/>-->
        <el-table-column type="index" label="序号" width="60" align="center"/>
        <el-table-column label="标题" min-width="220">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <el-tag v-if="row.isTop" type="danger" size="small">置顶</el-tag>
              <!--              <el-image-->
              <!--                  v-if="row.firstPicture"-->
              <!--                  :src="row.firstPicture"-->
              <!--                  fit="cover"-->
              <!--                  class="h-8 w-12 shrink-0 rounded"-->
              <!--              />-->
              <span class="truncate">{{ row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="分类" width="110">
          <template #default="{ row }">{{ categoryName(row.categoryId) }}</template>
        </el-table-column>
        <el-table-column prop="words" label="字数" width="80"/>
        <el-table-column prop="views" label="阅读" width="80"/>
        <el-table-column label="发布" width="80">
          <template #default="{ row }">
            <el-switch
                :model-value="row.isPublished"
                @change="(v) => handlePublish(row as BlogVO, v)"
            />
          </template>
        </el-table-column>
        <el-table-column label="置顶" width="80">
          <template #default="{ row }">
            <el-switch
                :model-value="row.isTop"
                @change="(v) => handleTop(row as BlogVO, v)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170"/>
        <el-table-column label="操作" width="130" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="router.push(`/blog/edit/${row.id}`)">
              编辑
            </el-button>
            <el-button link type="danger" @click="handleDelete(row as BlogVO)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-end">
        <el-pagination
            v-model:current-page="query.pageNum"
            v-model:page-size="query.pageSize"
            :total="total"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next"
            @current-change="fetchList"
            @size-change="handleSearch"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {vLoading} from 'element-plus'
import {Plus, Refresh, Search} from '@element-plus/icons-vue'
import {deleteBlog, getBlogList, setBlogPublish, setBlogTop} from '@/api/blog'
import {getAllCategory} from '@/api/category'
import type {BlogVO, OptionVO} from '@/api/types'

const router = useRouter()

const loading = ref(false)
const rows = ref<BlogVO[]>([])
const total = ref(0)
const categories = ref<OptionVO[]>([])

const query = reactive({pageNum: 1, pageSize: 10, title: '', categoryId: ''})

async function fetchList() {
  loading.value = true
  try {
    const data = await getBlogList({
      pageNum: query.pageNum,
      pageSize: query.pageSize,
      title: query.title || undefined,
      categoryId: query.categoryId || undefined,
    })
    rows.value = data.records
    total.value = data.total
  } catch {
    // 错误提示已由拦截器统一处理
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    categories.value = await getAllCategory()
  } catch {
    // 错误提示已由拦截器统一处理
  }
}

function categoryName(id: string) {
  return categories.value.find((c) => c.value === id)?.label ?? '-'
}

function handleSearch() {
  query.pageNum = 1
  fetchList()
}

function handleReset() {
  query.title = ''
  query.categoryId = ''
  handleSearch()
}

async function handlePublish(row: BlogVO, value: string | number | boolean) {
  const next = Boolean(value)
  try {
    await setBlogPublish({id: String(row.id), isPublished: next})
    row.isPublished = next
    ElMessage.success(next ? '已发布' : '已取消发布')
  } catch {
    // 失败时开关随绑定值自动回退（row.isPublished 未变）
  }
}

async function handleTop(row: BlogVO, value: string | number | boolean) {
  const next = Boolean(value)
  try {
    await setBlogTop({id: String(row.id), isTop: next})
    row.isTop = next
    ElMessage.success(next ? '已置顶' : '已取消置顶')
  } catch {
    // 失败时开关随绑定值自动回退
  }
}

async function handleDelete(row: BlogVO) {
  try {
    await ElMessageBox.confirm(`确定删除文章「${row.title}」吗？`, '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }
  try {
    await deleteBlog(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch {
    // 错误提示已由拦截器统一处理
  }
}

onMounted(() => {
  fetchCategories()
  fetchList()
})
</script>
