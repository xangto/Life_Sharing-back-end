<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-800">评论管理</h2>
    </div>

    <div class="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <el-form inline :model="query" @submit.prevent>
        <el-form-item label="按文章筛选">
          <el-select
              v-model="query.blogId"
              placeholder="全部文章"
              clearable
              filterable
              class="w-72"
              @change="handleSearch"
          >
            <el-option v-for="b in blogs" :key="b.value" :label="b.label" :value="b.value"/>
          </el-select>
        </el-form-item>
      </el-form>

      <el-table
          v-loading="loading"
          :data="rows"
          row-key="id"
          :tree-props="{ children: 'children' }"
          default-expand-all
      >
        <el-table-column prop="nickname" label="昵称" width="140"/>
        <el-table-column width="100" label="头像">
          <template #default="{row}">
            <el-image v-if="row.avatar" :src="row.avatar"/>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" min-width="240" show-overflow-tooltip/>
        <el-table-column prop="blogId" label="文章" width="200">
          <template #default="{row}">
            {{ blogMap.get(row.blogId) }}
          </template>
        </el-table-column>
        <el-table-column label="是否公开" width="90">
          <template #default="{ row }">
            <el-switch :model-value="row.isPublished" @change="handlePublish(row as CommentVO)"/>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP" width="130"/>
        <el-table-column prop="createTime" label="时间" width="170"/>
        <el-table-column label="操作" width="110" fixed="right">
          <template #default="{row}">
            <el-tooltip content="接口待接入">
              <span>
                <el-button link type="danger" @click="handleDelete(row.id)">删除</el-button>
              </span>
            </el-tooltip>
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
import {onMounted, reactive, ref, shallowRef} from 'vue'
import {ElMessage, ElMessageBox, vLoading} from 'element-plus'
import {getAllBlog} from '@/api/blog'
import {delComment, getCommentList, updateCommentPublish} from '@/api/comment'
import type {CommentVO, OptionVO} from '@/api/types'

const loading = ref(false)
const rows = ref<CommentVO[]>([])
const total = ref(0)
const blogs = ref<OptionVO[]>([])
const blogMap = shallowRef(new Map())

const query = reactive({pageNum: 1, pageSize: 10, blogId: undefined as string | undefined})

async function fetchList() {
  loading.value = true
  try {
    const data = await getCommentList({
      pageNum: query.pageNum,
      pageSize: query.pageSize,
      blogId: query.blogId || undefined,
    })
    rows.value = data.records
    total.value = data.total
  } catch {
    // 错误提示已由拦截器统一处理
  } finally {
    loading.value = false
  }
}

async function fetchBlogs() {
  try {
    blogs.value = await getAllBlog()
    blogs.value.forEach(e => {
      blogMap.value.set(e.value, e.label)
    })
  } catch {
    // 错误提示已由拦截器统一处理
  }
}

function handleSearch() {
  query.pageNum = 1
  fetchList()
}

const handlePublish = (row: CommentVO) => {
  updateCommentPublish(row.id, !row.isPublished).then(() => {
    ElMessage.success('操作成功')
    row.isPublished = !row.isPublished
  })
}

const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm(`确定删除评论吗？`, '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }

  delComment(id).then(() => {
    ElMessage.success('删除成功')
  }).finally(() => {
    fetchList()
  })
}

onMounted(() => {
  fetchBlogs()
  fetchList()
})
</script>
