import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Note } from '@/types/note'

export const useNoteStore = defineStore('note', () => {
	const notes = ref<Note[]>([])

	function addNote(note: Note) {
		notes.value.unshift(note)
	}

	function removeNote(id: string) {
		notes.value = notes.value.filter((n) => n.id !== id)
	}

	return { notes, addNote, removeNote }
})