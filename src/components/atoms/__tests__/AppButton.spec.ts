import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppButton from '@/components/atoms/AppButton.vue'

describe('AppButton', () => {
  it('renders with default props', () => {
    const wrapper = mount(AppButton)
    
    expect(wrapper.text()).toBe('Press me')
    expect(wrapper.classes()).toContain('app-button')
    expect(wrapper.classes()).toContain('app-button--purple')
    expect(wrapper.attributes('disabled')).toBeUndefined()
  })

  it('renders with custom text prop', () => {
    const wrapper = mount(AppButton, {
      props: { text: 'Custom Button' }
    })
    
    expect(wrapper.text()).toBe('Custom Button')
  })

  it('applies correct color classes', () => {
    const wrapperPurple = mount(AppButton, { props: { color: 'purple' } })
    const wrapperGreen = mount(AppButton, { props: { color: 'green' } })
    const wrapperRed = mount(AppButton, { props: { color: 'red' } })
    
    expect(wrapperPurple.classes()).toContain('app-button--purple')
    expect(wrapperGreen.classes()).toContain('app-button--green')
    expect(wrapperRed.classes()).toContain('app-button--red')
  })

  it('handles disabled state correctly', () => {
    const wrapper = mount(AppButton, {
      props: { disabled: true }
    })
    
    expect(wrapper.classes()).toContain('app-button--disabled')
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('handles click interaction correctly', async () => {
    const wrapper = mount(AppButton)
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click event when disabled', async () => {
    const wrapper = mount(AppButton, {
      props: { disabled: true }
    })
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('renders all props together correctly', () => {
    const wrapper = mount(AppButton, {
      props: {
        text: 'Test Button',
        color: 'green',
        disabled: true
      }
    })
    
    expect(wrapper.text()).toBe('Test Button')
    expect(wrapper.classes()).toContain('app-button--green')
    expect(wrapper.classes()).toContain('app-button--disabled')
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})