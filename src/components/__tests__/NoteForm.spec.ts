import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import NoteForm from '@/components/NoteForm.vue'
import { useNoteStore } from '@/stores/useNoteStore'

describe('NoteForm', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  const mountComponent = () =>
    mount(NoteForm, {
      global: {
        plugins: [pinia],
      },
    })

  describe('rendering', () => {
    it('renders form with all fields', () => {
      const wrapper = mountComponent()

      expect(wrapper.find('input').exists()).toBe(true)
      expect(wrapper.find('textarea').exists()).toBe(true)
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })

    it('renders title label with required indicator', () => {
      const wrapper = mountComponent()

      expect(wrapper.text()).toContain('Title')
      expect(wrapper.html()).toContain('*')
    })
  })

  describe('validation', () => {
    it('shows error when submitting empty title', async () => {
      const wrapper = mountComponent()

      const input = wrapper.find('input')

      await input.setValue('')
      await input.trigger('blur')

      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(wrapper.html()).toContain('Title is required')
    })

    it('does not show error with valid title', async () => {
      const wrapper = mountComponent()
      const store = useNoteStore()
      vi.spyOn(store, 'addNote').mockResolvedValue()

      await wrapper.find('input').setValue('Valid Title')
      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(wrapper.text()).not.toContain('Title is required')
    })
  })

  describe('form submission', () => {
    it('calls store.addNote with title only', async () => {
      const wrapper = mountComponent()
      const store = useNoteStore()
      const addNoteSpy = vi.spyOn(store, 'addNote').mockResolvedValue()

      await wrapper.find('input').setValue('Test Note')
      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(addNoteSpy).toHaveBeenCalledWith({
        title: 'Test Note',
        content: undefined,
      })
    })

    it('calls store.addNote with title and content', async () => {
      const wrapper = mountComponent()
      const store = useNoteStore()
      const addNoteSpy = vi.spyOn(store, 'addNote').mockResolvedValue()

      await wrapper.find('input').setValue('Test Note')
      await wrapper.find('textarea').setValue('Test content')
      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(addNoteSpy).toHaveBeenCalledWith({
        title: 'Test Note',
        content: 'Test content',
      })
    })

    it('trims whitespace from content', async () => {
      const wrapper = mountComponent()
      const store = useNoteStore()
      const addNoteSpy = vi.spyOn(store, 'addNote').mockResolvedValue()

      await wrapper.find('input').setValue('Title')
      await wrapper.find('textarea').setValue('  Content  ')
      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(addNoteSpy).toHaveBeenCalledWith({
        title: 'Title',
        content: 'Content',
      })
    })
  })

  describe('error handling', () => {
    it('keeps form data on error', async () => {
      const wrapper = mountComponent()
      const store = useNoteStore()

      vi.spyOn(store, 'addNote').mockRejectedValue(new Error('API Error'))

      await wrapper.find('input').setValue('Test Note')
      await wrapper.find('textarea').setValue('Test content')
      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(wrapper.find('input').element.value).toBe('Test Note')
      expect(wrapper.find('textarea').element.value).toBe('Test content')
    })
  })
})
