<template>
  <div class="flex h-screen overflow-hidden bg-gray-100">
    <SidebarMenu />
    <div class="flex min-w-0 flex-1 flex-col">
      <HeaderBar />
      <main class="flex-1 overflow-auto p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import SidebarMenu from './SidebarMenu.vue'
import HeaderBar from './HeaderBar.vue'
</script>
