import type { Note } from '@/types/note'

export type CreateNoteRequest = Omit<Note, 'id'>

export type UpdateNoteRequest = Partial<Note>

export interface NoteResponse extends Note {
	id: string
	createdAt: string
	updatedAt: string
}

export interface ApiErrorResponse {
	message: string
	statusCode: number
	error?: string
}