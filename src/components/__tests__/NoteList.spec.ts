import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import NoteList from '@/components/NoteList.vue'
import { noteService } from '@/api/noteService'

vi.mock('@/api/noteService', () => ({
  noteService: {
    getAll: vi.fn(),
    create: vi.fn(),
    remove: vi.fn()
  }
}))

describe('NoteList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('shows empty message when there are no notes', async () => {
    vi.mocked(noteService.getAll).mockResolvedValue([])

    const wrapper = mount(NoteList)
    await flushPromises()

    expect(wrapper.html()).toContain('No notes yet')
  })

  it('renders list items', async () => {
    const mockNotes = [
      { id: '1', title: 'Note 1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', title: 'Note 2', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
    ]

    vi.mocked(noteService.getAll).mockResolvedValue(mockNotes)

    const wrapper = mount(NoteList)
    await flushPromises()

    expect(wrapper.findAll('.border').length).toBe(2)
  })

  it('does not show empty message when there are notes', async () => {
    const mockNotes = [
      { id: '1', title: 'Note 1', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
    ]

    vi.mocked(noteService.getAll).mockResolvedValue(mockNotes)

    const wrapper = mount(NoteList)
    await flushPromises()

    expect(wrapper.html()).not.toContain('No notes yet')
  })
})
