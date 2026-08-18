<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-800">动态管理</h2>
      <el-button type="primary" :icon="Plus" @click="openDialog()">新增动态</el-button>
    </div>

    <div class="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <el-table v-loading="loading" :data="rows">
        <!--        <el-table-column prop="id" label="ID" width="70" />-->
        <el-table-column type="index" label="序号" width="60" align="center"/>
        <el-table-column prop="content" label="内容" min-width="260" show-overflow-tooltip/>
        <el-table-column prop="likes" label="点赞" width="100"/>
        <el-table-column label="发布" width="100">
          <template #default="{ row }">
            <el-switch
                :model-value="row.isPublished"
                @change="(v) => handlePublish(row as MomentVO, v)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170"/>
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDialog(row as MomentVO)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row as MomentVO)">删除</el-button>
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

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑动态' : '新增动态'" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="60px">
        <el-form-item label="内容" prop="content">
          <el-input
              v-model="form.content"
              type="textarea"
              :rows="5"
              placeholder="说点什么..."
              maxlength="500"
              show-word-limit
          />
        </el-form-item>
        <el-form-item label="发布">
          <el-switch v-model="form.isPublished"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {vLoading} from 'element-plus'
import {Plus} from '@element-plus/icons-vue'
import type {FormInstance, FormRules} from 'element-plus'
import {
  createMoment,
  deleteMoment,
  getMomentList,
  publishMoment,
  updateMoment,
} from '@/api/moment'
import type {MomentVO} from '@/api/types'

const loading = ref(false)
const rows = ref<MomentVO[]>([])
const total = ref(0)
const query = reactive({pageNum: 1, pageSize: 10})

const dialogVisible = ref(false)
const saving = ref(false)
const editingId = ref<string | null>(null)
const formRef = ref<FormInstance>()
const form = reactive({content: '', isPublished: false})

const rules: FormRules = {
  content: [{required: true, message: '请输入内容', trigger: 'blur'}],
}

async function fetchList() {
  loading.value = true
  try {
    const data = await getMomentList({pageNum: query.pageNum, pageSize: query.pageSize})
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

function openDialog(row?: MomentVO) {
  editingId.value = row?.id ?? null
  form.content = row?.content ?? ''
  form.isPublished = row?.isPublished ?? false
  dialogVisible.value = true
  formRef.value?.clearValidate()
}

async function handleSave() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    if (editingId.value) {
      await updateMoment({id: editingId.value, content: form.content, isPublished: form.isPublished})
    } else {
      await createMoment({content: form.content, isPublished: form.isPublished})
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    fetchList()
  } catch {
    // 错误提示已由拦截器统一处理
  } finally {
    saving.value = false
  }
}

async function handlePublish(row: MomentVO, value: string | number | boolean) {
  const next = Boolean(value)
  try {
    await publishMoment({id: row.id, isPublished: next})
    row.isPublished = next
    ElMessage.success(next ? '已发布' : '已取消发布')
  } catch {
    // 失败时开关随绑定值自动回退
  }
}

async function handleDelete(row: MomentVO) {
  try {
    await ElMessageBox.confirm('确定删除这条动态吗？', '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }
  try {
    await deleteMoment(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch {
    // 错误提示已由拦截器统一处理
  }
}

onMounted(fetchList)
</script>
