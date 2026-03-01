import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import NoteList from '@/components/NoteList.vue'
import { useNoteStore } from '@/stores/useNoteStore'

describe('NoteList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('shows empty message when there are no notes', () => {
    const wrapper = mount(NoteList)
    expect(wrapper.html()).toContain('No notes yet')
  })

  it('renders list items', () => {
    const store = useNoteStore()
    store.addNote({ title: 'Note 1' })
    store.addNote({ title: 'Note 2' })

    const wrapper = mount(NoteList)
    expect(wrapper.findAll('.border').length).toBe(2)
  })

  it('does not show empty message when there are notes', () => {
    const store = useNoteStore()
    store.addNote({ title: 'Note 1' })

    const wrapper = mount(NoteList)
    expect(wrapper.html()).not.toContain('No notes yet')
  })
})
