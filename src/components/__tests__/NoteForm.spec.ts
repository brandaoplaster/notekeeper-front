import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import NoteForm from '@/components/NoteForm.vue'

describe('NoteForm', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
	})

	it('renders form with all fields', () => {
		const wrapper = mount(NoteForm)

		expect(wrapper.find('input').exists()).toBe(true)
		expect(wrapper.find('textarea').exists()).toBe(true)
		expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
	})

	it('renders title label with required indicator', () => {
		const wrapper = mount(NoteForm)

		expect(wrapper.text()).toContain('Title')
		expect(wrapper.html()).toContain('*')
	})

	it('renders content label', () => {
		const wrapper = mount(NoteForm)

		expect(wrapper.text()).toContain('Content')
	})

	it('renders submit button with correct label', () => {
		const wrapper = mount(NoteForm)

		expect(wrapper.find('button[type="submit"]').text()).toBe('Add Note')
	})
})