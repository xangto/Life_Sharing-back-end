<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-800">友链管理</h2>
    </div>

    <div class="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <el-form inline :model="query" @submit.prevent>
        <el-form-item label="昵称">
          <el-input v-model="query.nickname" clearable></el-input>
        </el-form-item>
        <el-form-item label="网址">
          <el-input v-model="query.website" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
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
        <el-table-column prop="description" label="简介" min-width="240" show-overflow-tooltip/>
        <el-table-column prop="website" label="网址" width="240" show-overflow-tooltip/>

        <el-table-column label="是否公开" width="90">
          <template #default="{ row }">
            <el-switch :model-value="row.isPublished" @change="handlePublish(row as FriendVO)"/>
          </template>
        </el-table-column>
        <el-table-column prop="views" label="浏览量" width="100"/>
        <el-table-column prop="createTime" label="时间" width="170"/>
        <el-table-column label="操作" width="110" fixed="right">
          <template #default="{row}">
            <el-button link type="danger" @click="handleDelete(row.id)">删除</el-button>
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
import {ElMessage, ElMessageBox, vLoading} from 'element-plus'
import type {FriendPageDTO, FriendVO} from '@/api/types'
import {delFriend, getFriendList, updateFriendPublish} from "@/api/friend.ts";
import {Refresh, Search} from "@element-plus/icons-vue";

const loading = ref(false)
const rows = ref<FriendVO[]>([])
const total = ref(0)

const query = reactive<FriendPageDTO>({pageNum: 1, pageSize: 10, nickname: '', website: ''})

async function fetchList() {
  loading.value = true
  try {
    const data = await getFriendList(query)
    rows.value = data.records
    total.value = data.total
  } catch {
    // 错误提示已由拦截器统一处理
  } finally {
    loading.value = false
  }
}


function handleSearch() {
  query.pageNum = 1
  fetchList()
}

function handleReset() {
  query.nickname = ''
  query.website = ''
  handleSearch()
}

const handlePublish = (row: FriendVO) => {
  updateFriendPublish({id: row.id, isPublished: !row.isPublished}).then(() => {
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

  delFriend(id).then(() => {
    ElMessage.success('删除成功')
  }).finally(() => {
    fetchList()
  })
}

onMounted(() => {
  fetchList()
})
</script>
