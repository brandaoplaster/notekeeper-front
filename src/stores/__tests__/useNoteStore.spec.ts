import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNoteStore } from '@/stores/useNoteStore'
import { noteService } from '@/api/noteService'
import type { NoteResponse, CreateNoteRequest } from '@/api/types'

vi.mock('@/api/noteService', () => ({
  noteService: {
    getAll: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
  },
}))

describe('useNoteStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const mockNote: NoteResponse = {
    id: '1',
    title: 'Test Note',
    content: 'Test content',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  describe('initial state', () => {
    it('should initialize with empty notes array', () => {
      const store = useNoteStore()
      expect(store.notes).toEqual([])
    })

    it('should initialize with loading as false', () => {
      const store = useNoteStore()
      expect(store.loading).toBe(false)
    })
  })

  describe('fetchNotes', () => {
    it('should fetch and set notes', async () => {
      const mockNotes = [mockNote]
      vi.mocked(noteService.getAll).mockResolvedValue(mockNotes)

      const store = useNoteStore()
      await store.fetchNotes()

      expect(noteService.getAll).toHaveBeenCalledOnce()
      expect(store.notes).toEqual(mockNotes)
    })

    it('should set loading to true during fetch', async () => {
      vi.mocked(noteService.getAll).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve([]), 100)),
      )

      const store = useNoteStore()
      const fetchPromise = store.fetchNotes()

      expect(store.loading).toBe(true)
      await fetchPromise
    })

    it('should set loading to false after successful fetch', async () => {
      vi.mocked(noteService.getAll).mockResolvedValue([mockNote])

      const store = useNoteStore()
      await store.fetchNotes()

      expect(store.loading).toBe(false)
    })

    it('should set loading to false after failed fetch', async () => {
      vi.mocked(noteService.getAll).mockRejectedValue(new Error('API Error'))

      const store = useNoteStore()

      try {
        await store.fetchNotes()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe('API Error')
      }

      expect(store.loading).toBe(false)
    })
  })

  describe('addNote', () => {
    it('should add note to the beginning of the list', async () => {
      const existingNote: NoteResponse = {
        id: '2',
        title: 'Existing',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      vi.mocked(noteService.create).mockResolvedValue(mockNote)

      const store = useNoteStore()
      store.notes = [existingNote]

      const newNote: CreateNoteRequest = {
        title: 'Test Note',
        content: 'Test content',
      }

      await store.addNote(newNote)

      expect(noteService.create).toHaveBeenCalledWith(newNote)
      expect(store.notes).toHaveLength(2)
      expect(store.notes[0]).toEqual(mockNote)
      expect(store.notes[1]).toEqual(existingNote)
    })

    it('should add note to empty list', async () => {
      vi.mocked(noteService.create).mockResolvedValue(mockNote)

      const store = useNoteStore()
      const newNote: CreateNoteRequest = {
        title: 'Test Note',
        content: 'Test content',
      }

      await store.addNote(newNote)

      expect(store.notes).toHaveLength(1)
      expect(store.notes[0]).toEqual(mockNote)
    })

    it('should throw error when creation fails', async () => {
      vi.mocked(noteService.create).mockRejectedValue(new Error('Creation failed'))

      const store = useNoteStore()
      const newNote: CreateNoteRequest = { title: 'Test' }

      await expect(store.addNote(newNote)).rejects.toThrow('Creation failed')
      expect(store.notes).toHaveLength(0)
    })
  })

  describe('removeNote', () => {
    it('should remove note from the list', async () => {
      vi.mocked(noteService.remove).mockResolvedValue()

      const store = useNoteStore()
      store.notes = [mockNote, { ...mockNote, id: '2', title: 'Note 2' }]

      await store.removeNote('1')

      expect(noteService.remove).toHaveBeenCalledWith('1')
      expect(store.notes).toHaveLength(1)
      expect(store.notes[0]?.id).toBe('2')
    })

    it('should not modify list if note id does not exist', async () => {
      vi.mocked(noteService.remove).mockResolvedValue()

      const store = useNoteStore()
      store.notes = [mockNote]

      await store.removeNote('non-existent')

      expect(store.notes).toHaveLength(1)
      expect(store.notes[0]).toEqual(mockNote)
    })

    it('should throw error when deletion fails', async () => {
      vi.mocked(noteService.remove).mockRejectedValue(new Error('Deletion failed'))

      const store = useNoteStore()
      store.notes = [mockNote]

      await expect(store.removeNote('1')).rejects.toThrow('Deletion failed')
      expect(store.notes).toHaveLength(1)
    })

    it('should handle removing from empty list', async () => {
      vi.mocked(noteService.remove).mockResolvedValue()

      const store = useNoteStore()

      await store.removeNote('1')

      expect(store.notes).toHaveLength(0)
    })
  })

  describe('state reactivity', () => {
    it('should maintain reactivity when notes are updated', async () => {
      vi.mocked(noteService.getAll).mockResolvedValue([mockNote])

      const store = useNoteStore()
      const notesCopy = [...store.notes]

      await store.fetchNotes()

      expect(store.notes).not.toBe(notesCopy)
      expect(store.notes).toHaveLength(1)
    })
  })
})
