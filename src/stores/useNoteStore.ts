import { defineStore } from 'pinia'
import { ref } from 'vue'
import { noteService } from '@/api/noteService'
import type { NoteResponse, CreateNoteRequest } from '@/api/types'

export const useNoteStore = defineStore('note', () => {
  const notes = ref<NoteResponse[]>([])
  const loading = ref(false)

  async function fetchNotes() {
    loading.value = true
    try {
      notes.value = await noteService.getAll()
    } finally {
      loading.value = false
    }
  }

  async function addNote(note: CreateNoteRequest) {
    const created = await noteService.create(note)
    notes.value.unshift(created)
  }

  async function removeNote(id: string) {
    await noteService.remove(id)
    notes.value = notes.value.filter((n) => n.id !== id)
  }

  return { notes, loading, fetchNotes, addNote, removeNote }
})
