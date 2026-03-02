import client from '@/api/client'
import type { CreateNoteRequest, NoteResponse } from './types'

export const noteService = {
  async getAll(): Promise<NoteResponse[]> {
    const { data } = await client.get('/notes')
    return data
  },

  async create(note: CreateNoteRequest): Promise<NoteResponse> {
    const { data } = await client.post('/notes', note)
    return data
  },

  async remove(id: string): Promise<void> {
    await client.delete(`/notes/${id}`)
  },
}