<script setup lang="ts">
import type { NoteResponse } from '@/api/types'

defineProps<{
  note: NoteResponse
}>()
</script>

<template>
  <div class="bg-white border rounded-lg p-4 flex flex-col gap-1 transition-shadow hover:shadow-md cursor-pointer">
    <h2 class="text-base font-semibold text-gray-900">{{ note.title }}</h2>
    <p v-if="note.content" class="text-sm text-gray-600">{{ note.content }}</p>
  </div>
</template>
