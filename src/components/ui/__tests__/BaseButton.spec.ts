import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/components/ui/BaseButton.vue'

describe('BaseButton', () => {
  it('renders label', () => {
    const wrapper = mount(BaseButton, {
      props: { label: 'Click here' },
    })
    expect(wrapper.text()).toBe('Click here')
  })

  it('uses button type by default', () => {
    const wrapper = mount(BaseButton, {
      props: { label: 'Button' },
    })
    expect(wrapper.find('button').attributes('type')).toBe('button')
  })

  it('accepts submit type', () => {
    const wrapper = mount(BaseButton, {
      props: { label: 'Submit', type: 'submit' },
    })
    expect(wrapper.find('button').attributes('type')).toBe('submit')
  })
})
