<template>
  <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
    <template #title>
      <el-icon>
        <Icon v-if="item.iconName" :icon="item.iconName" size="18"/>
      </el-icon>
      <span>{{ item.label }}</span>
    </template>
    <!-- 递归渲染子项 -->
    <MenuItem
        v-for="sub in item.children"
        :key="sub.path"
        :item="sub"
    />
  </el-sub-menu>

  <!-- 没有子菜单，普通菜单项 -->
  <el-menu-item v-else :index="item.path">
    <el-icon>
      <Icon v-if="item.iconName" :icon="item.iconName" size="18"/>
    </el-icon>
    <span>{{ item.label }}</span>
  </el-menu-item>

</template>

<script setup lang="ts">
import {Icon} from "@iconify/vue";

type menuItem = {
  path: string
  label: string
  iconName: string | undefined
  children?: menuItem[]
}

defineProps<{
  item: menuItem
}>()
</script>
