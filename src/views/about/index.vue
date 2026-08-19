<template>
  <div class="mx-auto">
    <div class="pb-4 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-800">关于我</h2>
      <div class="flex gap-2">
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </div>
    </div>
    <div class="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item v-if="form.title" label="标题" prop="title">
          <el-input v-model="form.title.content" placeholder="标题" maxlength="100"/>
        </el-form-item>
        <el-form-item v-if="form.content" label="正文" prop="content">
          <MdEditor v-model="form.content.content" class="w-full" :no-upload-img="true" placeholder="开始写作..."/>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {MdEditor} from "md-editor-v3";
import 'md-editor-v3/lib/style.css'
import {onMounted, reactive, ref} from "vue";
import {ElMessage, type FormInstance, type FormRules} from "element-plus";
import {getAboutInfo, updateAboutInfo} from "@/api/about.ts";
import type {AboutDTO} from "@/api/types.ts";

const formRef = ref<FormInstance>()
const saving = ref(false)

const form = reactive<AboutDTO>({})

const rules: FormRules = {
  title: [{required: true, message: '请输入标题', trigger: 'blur'}],
  content: [{required: true, message: '请输入正文内容', trigger: 'change'}],
}

async function handleSave() {
  if (saving.value) return
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  await updateAboutInfo(form)
  ElMessage.success('保存成功')
  saving.value = false
}

onMounted(() => {
  getAboutInfo().then(data => {
    if (!data) return
    form.title = data.title;
    form.content = data.content;
  })
})

</script>
