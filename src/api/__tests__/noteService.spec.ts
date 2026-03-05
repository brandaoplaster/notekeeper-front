import { describe, it, expect, beforeEach, vi } from 'vitest'
import { noteService } from '@/api/noteService'
import client from '@/api/client'
import type { CreateNoteRequest, NoteResponse } from '@/api/types'

vi.mock('@/api/client')

describe('noteService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockNote: NoteResponse = {
    id: '1',
    title: 'Test Note',
    content: 'Test content',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  describe('getAll', () => {
    it('should fetch all notes successfully', async () => {
      const mockNotes = [mockNote, { ...mockNote, id: '2', title: 'Note 2' }]
      vi.mocked(client.get).mockResolvedValue({ data: mockNotes })

      const result = await noteService.getAll()

      expect(client.get).toHaveBeenCalledWith('/notes')
      expect(result).toEqual(mockNotes)
      expect(result).toHaveLength(2)
    })

    it('should return empty array when no notes exist', async () => {
      vi.mocked(client.get).mockResolvedValue({ data: [] })

      const result = await noteService.getAll()

      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it('should throw error when request fails', async () => {
      const error = new Error('Network error')
      vi.mocked(client.get).mockRejectedValue(error)

      await expect(noteService.getAll()).rejects.toThrow('Network error')
      expect(client.get).toHaveBeenCalledWith('/notes')
    })

    it('should handle 500 server error', async () => {
      const serverError = new Error('Internal server error')
      vi.mocked(client.get).mockRejectedValue(serverError)

      await expect(noteService.getAll()).rejects.toThrow('Internal server error')
    })

    it('should call correct endpoint', async () => {
      vi.mocked(client.get).mockResolvedValue({ data: [] })

      await noteService.getAll()

      expect(client.get).toHaveBeenCalledTimes(1)
      expect(client.get).toHaveBeenCalledWith('/notes')
    })
  })

  describe('create', () => {
    it('should create note with title and content', async () => {
      const newNote: CreateNoteRequest = {
        title: 'New Note',
        content: 'New content',
      }

      vi.mocked(client.post).mockResolvedValue({ data: mockNote })

      const result = await noteService.create(newNote)

      expect(client.post).toHaveBeenCalledWith('/notes', newNote)
      expect(result).toEqual(mockNote)
      expect(result.id).toBeDefined()
      expect(result.createdAt).toBeDefined()
      expect(result.updatedAt).toBeDefined()
    })

    it('should create note with only title (no content)', async () => {
      const newNote: CreateNoteRequest = {
        title: 'Title only',
      }

      const responseNote = { ...mockNote, content: undefined }
      vi.mocked(client.post).mockResolvedValue({ data: responseNote })

      const result = await noteService.create(newNote)

      expect(client.post).toHaveBeenCalledWith('/notes', newNote)
      expect(result.title).toBe('Test Note')
      expect(result.content).toBeUndefined()
    })

    it('should throw error when creation fails', async () => {
      const newNote: CreateNoteRequest = { title: 'Test' }
      const error = new Error('Creation failed')
      vi.mocked(client.post).mockRejectedValue(error)

      await expect(noteService.create(newNote)).rejects.toThrow('Creation failed')
      expect(client.post).toHaveBeenCalledWith('/notes', newNote)
    })

    it('should send correct payload structure', async () => {
      const newNote: CreateNoteRequest = {
        title: 'Test Title',
        content: 'Test Content',
      }

      vi.mocked(client.post).mockResolvedValue({ data: mockNote })

      await noteService.create(newNote)

      const callArgs = vi.mocked(client.post).mock.calls[0]!
      expect(callArgs[0]).toBe('/notes')
      expect(callArgs[1]).toEqual(newNote)
      expect(callArgs[1]).toHaveProperty('title')
      expect(callArgs[1]).not.toHaveProperty('id')
    })

    it('should handle validation errors', async () => {
      const invalidNote: CreateNoteRequest = { title: '' }
      const validationError = new Error('Title is required')
      vi.mocked(client.post).mockRejectedValue(validationError)

      await expect(noteService.create(invalidNote)).rejects.toThrow('Title is required')
    })

    it('should return note with all required fields', async () => {
      const newNote: CreateNoteRequest = { title: 'Test' }
      vi.mocked(client.post).mockResolvedValue({ data: mockNote })

      const result = await noteService.create(newNote)

      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('title')
      expect(result).toHaveProperty('createdAt')
      expect(result).toHaveProperty('updatedAt')
    })
  })

  describe('remove', () => {
    it('should delete note by id', async () => {
      vi.mocked(client.delete).mockResolvedValue({ data: undefined })

      await noteService.remove('1')

      expect(client.delete).toHaveBeenCalledWith('/notes/1')
    })

    it('should handle deletion of non-existent note', async () => {
      const notFoundError = new Error('Note not found')
      vi.mocked(client.delete).mockRejectedValue(notFoundError)

      await expect(noteService.remove('non-existent')).rejects.toThrow('Note not found')
      expect(client.delete).toHaveBeenCalledWith('/notes/non-existent')
    })

    it('should throw error when deletion fails', async () => {
      const error = new Error('Deletion failed')
      vi.mocked(client.delete).mockRejectedValue(error)

      await expect(noteService.remove('1')).rejects.toThrow('Deletion failed')
    })

    it('should call correct endpoint with id', async () => {
      vi.mocked(client.delete).mockResolvedValue({ data: undefined })

      await noteService.remove('abc-123')

      expect(client.delete).toHaveBeenCalledTimes(1)
      expect(client.delete).toHaveBeenCalledWith('/notes/abc-123')
    })

    it('should not return any data on successful deletion', async () => {
      vi.mocked(client.delete).mockResolvedValue({ data: undefined })

      const result = await noteService.remove('1')

      expect(result).toBeUndefined()
    })

    it('should handle server errors during deletion', async () => {
      const serverError = new Error('Internal server error')
      vi.mocked(client.delete).mockRejectedValue(serverError)

      await expect(noteService.remove('1')).rejects.toThrow('Internal server error')
    })
  })

  describe('payload validation', () => {
    it('should reject note without title', async () => {
      const invalidNote = {} as CreateNoteRequest
      const error = new Error('Title is required')
      vi.mocked(client.post).mockRejectedValue(error)

      await expect(noteService.create(invalidNote)).rejects.toThrow()
    })

    it('should accept note with empty content', async () => {
      const noteWithEmptyContent: CreateNoteRequest = {
        title: 'Title',
        content: '',
      }

      vi.mocked(client.post).mockResolvedValue({
        data: { ...mockNote, content: '' },
      })

      const result = await noteService.create(noteWithEmptyContent)

      expect(result.content).toBe('')
    })

    it('should preserve content field when provided', async () => {
      const noteWithContent: CreateNoteRequest = {
        title: 'Title',
        content: 'Some content',
      }

      vi.mocked(client.post).mockResolvedValue({ data: mockNote })

      await noteService.create(noteWithContent)

      const callPayload = vi.mocked(client.post).mock.calls[0]![1] as CreateNoteRequest
      expect(callPayload).toHaveProperty('content')
      expect(callPayload.content).toBe('Some content')
    })
  })

  describe('error handling', () => {
    it('should propagate network errors', async () => {
      const networkError = new Error('Network timeout')
      vi.mocked(client.get).mockRejectedValue(networkError)

      await expect(noteService.getAll()).rejects.toThrow('Network timeout')
    })

    it('should handle unauthorized errors', async () => {
      const authError = new Error('Unauthorized')
      vi.mocked(client.get).mockRejectedValue(authError)

      await expect(noteService.getAll()).rejects.toThrow('Unauthorized')
    })

    it('should handle rate limit errors', async () => {
      const rateLimitError = new Error('Too many requests')
      vi.mocked(client.post).mockRejectedValue(rateLimitError)

      await expect(noteService.create({ title: 'Test' })).rejects.toThrow('Too many requests')
    })
  })
})
