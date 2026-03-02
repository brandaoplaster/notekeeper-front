import type { Note } from '@/types/note'

export interface CreateNoteRequest extends Omit<Note, 'id'> { }

export interface UpdateNoteRequest extends Partial<Note> { }

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