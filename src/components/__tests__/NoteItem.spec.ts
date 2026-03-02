import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NoteItem from '@/components/NoteItem.vue'
import type { NoteResponse } from '@/api/types'

describe('NoteItem', () => {
  const createMockNote = (overrides?: Partial<NoteResponse>): NoteResponse => ({
    id: '1',
    title: 'Default Title',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    ...overrides
  })

  it('renders the title', () => {
    const wrapper = mount(NoteItem, {
      props: { note: createMockNote({ title: 'My note' }) }
    })
    expect(wrapper.html()).toContain('My note')
  })

  it('renders the content when present', () => {
    const wrapper = mount(NoteItem, {
      props: {
        note: createMockNote({
          title: 'Title',
          content: 'Note content'
        })
      }
    })
    expect(wrapper.html()).toContain('Note content')
  })

  it('does not render content when absent', () => {
    const wrapper = mount(NoteItem, {
      props: { note: createMockNote({ title: 'Title' }) }
    })
    expect(wrapper.find('p').exists()).toBe(false)
  })
})
