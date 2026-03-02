<script setup lang="ts">
import { onMounted } from 'vue'
import { useNoteStore } from '@/stores/useNoteStore'
import NoteItem from '@/components/NoteItem.vue'

const store = useNoteStore()

onMounted(() => {
  store.fetchNotes()
})
</script>

<template>
  <div class="max-w-lg mx-auto flex flex-col gap-3">
    <p v-if="store.notes.length === 0" class="text-base text-gray-400 text-center py-6">
      No notes yet. Start by adding one above.
    </p>
    <NoteItem v-for="note in store.notes" :key="note.title" :note="note" />
  </div>
</template>
