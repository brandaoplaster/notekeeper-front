<script setup lang="ts">
import NoteForm from '@/components/NoteForm.vue'
import NoteList from '@/components/NoteList.vue'
</script>

<template>
  <div class="container mx-auto px-4 py-4">
    <div class="mb-10">
      <NoteForm />
    </div>
    <div class="mb-10">
      <NoteList />
    </div>
  </div>
</template>
