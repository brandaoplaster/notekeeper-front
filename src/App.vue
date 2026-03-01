<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <nav class="container mx-auto px-4 py-4">
        <RouterLink to="/" class="text-xl font-bold text-gray-900">
          NoteKeeper
        </RouterLink>
      </nav>
    </header>

    <RouterView />
  </div>
</template>

<style scoped></style>
