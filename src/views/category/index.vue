<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-800">分类管理</h2>
      <el-button type="primary" :icon="Plus" @click="openDialog()">新增分类</el-button>
    </div>

    <div class="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <el-table v-loading="loading" :data="rows">
        <!--        <el-table-column prop="id" label="ID" width="80" />-->
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="name" label="分类名称" min-width="160"/>
        <el-table-column label="操作" width="350" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDialog(row as CategoryVO)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row as CategoryVO)">删除</el-button>
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

    <el-dialog
        v-model="dialogVisible"
        :title="editingId ? '编辑分类' : '新增分类'"
        width="420px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" @submit.prevent>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="分类名称" maxlength="30"/>
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
import {createCategory, deleteCategory, getCategoryList, updateCategory} from '@/api/category'
import type {CategoryVO} from '@/api/types'

const loading = ref(false)
const rows = ref<CategoryVO[]>([])
const total = ref(0)
const query = reactive({pageNum: 1, pageSize: 10})

const dialogVisible = ref(false)
const saving = ref(false)
const editingId = ref<string | null>(null)
const formRef = ref<FormInstance>()
const form = reactive({name: ''})

const rules: FormRules = {
  name: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
}

async function fetchList() {
  loading.value = true
  try {
    const data = await getCategoryList({pageNum: query.pageNum, pageSize: query.pageSize})
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

function openDialog(row?: CategoryVO) {
  editingId.value = row?.id ?? null
  form.name = row?.name ?? ''
  dialogVisible.value = true
  formRef.value?.clearValidate()
}

async function handleSave() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    if (editingId.value) {
      await updateCategory({id: editingId.value, name: form.name})
    } else {
      await createCategory({name: form.name})
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

async function handleDelete(row: CategoryVO) {
  try {
    await ElMessageBox.confirm(`确定删除分类「${row.name}」吗？`, '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }
  try {
    await deleteCategory(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch {
    // 错误提示已由拦截器统一处理
  }
}

onMounted(fetchList)
</script>
