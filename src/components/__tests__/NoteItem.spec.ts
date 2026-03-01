import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NoteItem from '@/components/NoteItem.vue'

describe('NoteItem', () => {
  it('renders the title', () => {
    const wrapper = mount(NoteItem, {
      props: { note: { title: 'My note' } }
    })
    expect(wrapper.html()).toContain('My note')
  })

  it('renders the content when present', () => {
    const wrapper = mount(NoteItem, {
      props: { note: { title: 'Title', content: 'Note content' } }
    })
    expect(wrapper.html()).toContain('Note content')
  })

  it('does not render content when absent', () => {
    const wrapper = mount(NoteItem, {
      props: { note: { title: 'Title' } }
    })
    expect(wrapper.find('p').exists()).toBe(false)
  })
})
