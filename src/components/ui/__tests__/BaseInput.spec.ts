import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '@/components/ui/BaseInput.vue'

describe('BaseInput', () => {
  it('renders input with modelValue', () => {
    const wrapper = mount(BaseInput, {
      props: { modelValue: 'test' },
    })
    expect(wrapper.find('input').element.value).toBe('test')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(BaseInput, {
      props: { modelValue: '' },
    })
    await wrapper.find('input').setValue('new value')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value'])
  })

  it('displays label when provided', () => {
    const wrapper = mount(BaseInput, {
      props: { modelValue: '', label: 'Name' },
    })
    expect(wrapper.find('label').text()).toContain('Name')
  })

  it('shows asterisk when required', () => {
    const wrapper = mount(BaseInput, {
      props: { modelValue: '', label: 'Email', required: true },
    })
    expect(wrapper.find('.text-red-500').text()).toBe('*')
  })

  it('displays error message', () => {
    const wrapper = mount(BaseInput, {
      props: { modelValue: '', error: 'Required field' },
    })
    expect(wrapper.text()).toContain('Required field')
    expect(wrapper.find('input').classes()).toContain('border-red-500')
  })
})
