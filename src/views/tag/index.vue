<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-800">标签管理</h2>
      <el-button type="primary" :icon="Plus" @click="openDialog()">新增标签</el-button>
    </div>

    <div class="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <el-table v-loading="loading" :data="rows">
        <!--        <el-table-column prop="id" label="ID" width="80" />-->
        <el-table-column type="index" label="序号" width="60" align="center"/>
        <el-table-column prop="name" label="标签名称" min-width="140"/>
        <el-table-column label="颜色" min-width="140">
          <template #default="{ row }">
            <span class="inline-flex items-center gap-2">
              <span class="inline-block h-6 w-16 rounded" :style="{ backgroundColor: row.color }"/>
              <span class="text-xs text-gray-400">{{ row.color }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDialog(row as TagVO)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row as TagVO)">删除</el-button>
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

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑标签' : '新增标签'" width="420px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" @submit.prevent>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="标签名称" maxlength="30"/>
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-color-picker v-model="form.color"/>
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
import {createTag, deleteTag, getTagList, updateTag} from '@/api/tag'
import type {TagVO} from '@/api/types'

const loading = ref(false)
const rows = ref<TagVO[]>([])
const total = ref(0)
const query = reactive({pageNum: 1, pageSize: 10})

const dialogVisible = ref(false)
const saving = ref(false)
const editingId = ref<string | null>(null)
const formRef = ref<FormInstance>()
const form = reactive({name: '', color: '#409eff'})

const rules: FormRules = {
  name: [{required: true, message: '请输入标签名称', trigger: 'blur'}],
  color: [{required: true, message: '请选择颜色', trigger: 'change'}],
}

async function fetchList() {
  loading.value = true
  try {
    const data = await getTagList({pageNum: query.pageNum, pageSize: query.pageSize})
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

function openDialog(row?: TagVO) {
  editingId.value = row?.id ?? null
  form.name = row?.name ?? ''
  form.color = row?.color ?? '#409eff'
  dialogVisible.value = true
  formRef.value?.clearValidate()
}

async function handleSave() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    if (editingId.value) {
      await updateTag({id: editingId.value, name: form.name, color: form.color})
    } else {
      await createTag({name: form.name, color: form.color})
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

async function handleDelete(row: TagVO) {
  try {
    await ElMessageBox.confirm(`确定删除标签「${row.name}」吗？`, '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }
  try {
    await deleteTag(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch {
    // 错误提示已由拦截器统一处理
  }
}

onMounted(fetchList)
</script>
