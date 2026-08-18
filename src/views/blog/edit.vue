<template>
  <div class="mx-auto max-w-5xl">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-800">{{ isEdit ? '编辑文章' : '新增文章' }}</h2>
      <div class="flex gap-2">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </div>
    </div>

    <div class="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="文章标题" maxlength="100"/>
        </el-form-item>
        <div class="grid grid-cols-2 gap-x-6">
          <el-form-item label="分类" prop="categoryId">
            <el-select v-model="form.categoryId" placeholder="选择分类" class="w-full">
              <el-option
                  v-for="c in categories"
                  :key="c.value"
                  :label="c.label"
                  :value="c.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="标签" prop="tags">
            <!--            <el-input v-model="form.tags" placeholder="多个标签用英文逗号分隔"/>-->
            <el-select v-model="form.tags" multiple placeholder="选择标签" class="w-full">
              <el-option
                  v-for="c in tags"
                  :key="c.value"
                  :label="c.label"
                  :value="c.value"
              />
            </el-select>
            <!--            <div v-if="isEdit" class="mt-1 text-xs text-gray-400">编辑时标签无法回填，保存会覆盖原标签</div>-->
          </el-form-item>
        </div>
        <el-form-item label="封面" prop="firstPicture">
          <el-input v-model="form.firstPicture" placeholder="https://..."/>
        </el-form-item>
        <el-form-item label="摘要">
          <el-input
              v-model="form.description"
              type="textarea"
              :rows="2"
              placeholder="文章摘要（可选）"
          />
        </el-form-item>
        <el-form-item label="正文" prop="content">
          <MdEditor v-model="form.content" class="w-full" :no-upload-img="true" placeholder="开始写作..."/>
        </el-form-item>
        <el-form-item label="发布">
          <el-switch v-model="form.isPublished" active-text="发布" inactive-text="草稿"/>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {MdEditor} from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import {ElMessage} from 'element-plus'
import type {FormInstance, FormRules} from 'element-plus'
import {createBlog, getBlogDetail, updateBlog} from '@/api/blog'
import {getAllCategory} from '@/api/category'
import type {OptionVO} from '@/api/types'
import {getAllTag} from "@/api/tag.ts";

const route = useRoute()
const router = useRouter()

const blogId = route.params.id
const isEdit = blogId !== null

const formRef = ref<FormInstance>()
const saving = ref(false)
const categories = ref<OptionVO[]>([])
const tags = ref<OptionVO[]>([])

const form = reactive({
  title: '',
  categoryId: '',
  tags: [] as string[],
  firstPicture: '',
  description: '',
  content: '',
  isPublished: false,
})

const rules: FormRules = {
  title: [{required: true, message: '请输入标题', trigger: 'blur'}],
  firstPicture: [{required: true, message: '请输入封面图url', trigger: 'blur'}],
  categoryId: [{required: true, message: '请选择分类', trigger: 'change'}],
  content: [{required: true, message: '请输入正文内容', trigger: 'change'}],
  tags: [{required: true, message: '请选择标签', trigger: 'change'}],
}

onMounted(async () => {
  getAllCategory()
      .then((data) => {
        categories.value = data
      })
      .catch(() => {
        // 错误提示已由拦截器统一处理
      })

  getAllTag()
      .then((data) => {
        tags.value = data
      })

  if (blogId) {
    try {
      const detail = await getBlogDetail(blogId as string)
      form.title = detail.title
      form.categoryId = String(detail.categoryId)
      form.firstPicture = detail.firstPicture
      form.description = detail.description
      form.content = detail.content
      form.isPublished = detail.isPublished
      form.tags = detail.tags
      // 注意：BlogVO 无 tags 字段，编辑时标签无法回填，提交会覆盖为当前输入
    } catch {
      router.push('/blog')
    }
  }
})

function countWords(text: string) {
  return text.replace(/\s/g, '').length
}

function handleCancel() {
  if (router.options.history.state.back) {
    router.back()
  } else {
    router.push('/blog')
  }
}

async function handleSave() {
  if (saving.value) return
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  const words = countWords(form.content)
  const payload = {
    title: form.title,
    firstPicture: form.firstPicture,
    description: form.description || undefined,
    content: form.content,
    isPublished: form.isPublished,
    words,
    readTime: Math.max(1, Math.ceil(words / 400)),
    categoryId: form.categoryId,
    tags: form.tags.join(","),
  }
  try {
    if (blogId) {
      await updateBlog({id: String(blogId), ...payload})
    } else {
      await createBlog(payload)
    }
    ElMessage.success('保存成功')
    router.push('/blog')
  } catch {
    // 错误提示已由拦截器统一处理
  } finally {
    saving.value = false
  }
}
</script>
