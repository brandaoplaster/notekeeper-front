import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'

describe('BaseTextarea', () => {
	it('renders with modelValue', () => {
		const wrapper = mount(BaseTextarea, {
			props: { modelValue: 'content' }
		})
		expect(wrapper.find('textarea').element.value).toBe('content')
	})

	it('emits update:modelValue on input', async () => {
		const wrapper = mount(BaseTextarea, {
			props: { modelValue: '' }
		})
		await wrapper.find('textarea').setValue('new text')
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new text'])
	})

	it('applies placeholder', () => {
		const wrapper = mount(BaseTextarea, {
			props: { modelValue: '', placeholder: 'Type here' }
		})
		expect(wrapper.find('textarea').attributes('placeholder')).toBe('Type here')
	})

	it('uses 3 rows by default', () => {
		const wrapper = mount(BaseTextarea, {
			props: { modelValue: '' }
		})
		expect(wrapper.find('textarea').attributes('rows')).toBe('3')
	})

	it('accepts custom rows', () => {
		const wrapper = mount(BaseTextarea, {
			props: { modelValue: '', rows: 5 }
		})
		expect(wrapper.find('textarea').attributes('rows')).toBe('5')
	})
})