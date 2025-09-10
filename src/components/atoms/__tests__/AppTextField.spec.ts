import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppTextField from '@/components/atoms/AppTextField.vue'

describe('AppTextField', () => {
  it('renders with default props', () => {
    const wrapper = mount(AppTextField, {
      props: { modelValue: '', placeholder: '' }
    })
    
    expect(wrapper.element.tagName).toBe('INPUT')
    expect(wrapper.classes()).toContain('app-textfield')
    expect(wrapper.attributes('type')).toBe('text')
    expect(wrapper.attributes('placeholder')).toBe('')
    expect(wrapper.attributes('disabled')).toBeUndefined()
  })

  it('renders with custom props', () => {
    const wrapper = mount(AppTextField, {
      props: {
        modelValue: 'test value',
        placeholder: 'Enter text',
        type: 'email',
        disabled: true
      }
    })
    
    expect(wrapper.element.value).toBe('test value')
    expect(wrapper.attributes('placeholder')).toBe('Enter text')
    expect(wrapper.attributes('type')).toBe('email')
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('displays the correct modelValue', () => {
    const wrapper = mount(AppTextField, {
      props: { modelValue: 'Hello World', placeholder: '' }
    })
    
    expect(wrapper.element.value).toBe('Hello World')
  })

  it('emits update:modelValue when input changes', async () => {
    const wrapper = mount(AppTextField, {
      props: { modelValue: '', placeholder: '' }
    })
    
    await wrapper.setValue('new value')
    
    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted('update:modelValue')).toEqual([['new value']])
  })

  it('handles multiple input changes', async () => {
    const wrapper = mount(AppTextField, {
      props: { modelValue: '', placeholder: '' }
    })
    
    await wrapper.setValue('first')
    await wrapper.setValue('second')
    await wrapper.setValue('third')
    
    const emissions = wrapper.emitted('update:modelValue')
    expect(emissions).toHaveLength(3)
    expect(emissions?.[0]).toEqual(['first'])
    expect(emissions?.[1]).toEqual(['second'])
    expect(emissions?.[2]).toEqual(['third'])
  })

  it('handles different input types correctly', () => {
    const types = ['text', 'email', 'password', 'number'] as const
    
    types.forEach(type => {
      const wrapper = mount(AppTextField, {
        props: { modelValue: '', type, placeholder: '' }
      })
      
      expect(wrapper.attributes('type')).toBe(type)
    })
  })

  it('handles disabled state correctly', () => {
    const wrapper = mount(AppTextField, {
      props: { modelValue: '', disabled: true, placeholder: '' }
    })
    
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.element.disabled).toBe(true)
  })

  it('does not emit when disabled', async () => {
    const wrapper = mount(AppTextField, {
      props: { modelValue: '', disabled: true, placeholder: '' }
    })
    
    await wrapper.trigger('input')
    
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('handles placeholder text correctly', () => {
    const placeholderText = 'Type something here...'
    const wrapper = mount(AppTextField, {
      props: { modelValue: '', placeholder: placeholderText }
    })
    
    expect(wrapper.attributes('placeholder')).toBe(placeholderText)
  })

  it('handles empty placeholder', () => {
    const wrapper = mount(AppTextField, {
      props: { modelValue: '', placeholder: '' }
    })
    
    expect(wrapper.attributes('placeholder')).toBe('')
  })

  it('calls handleInput function on input event', async () => {
    const wrapper = mount(AppTextField, {
      props: { modelValue: '', placeholder: '' }
    })
    
    const input = wrapper.find('input')
    await input.setValue('test input')
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test input'])
  })

  it('has correct CSS class applied', () => {
    const wrapper = mount(AppTextField, {
      props: { modelValue: '', placeholder: '' }
    })
    
    expect(wrapper.find('.app-textfield').exists()).toBe(true)
    expect(wrapper.element.classList.contains('app-textfield')).toBe(true)
  })

  it('maintains v-model reactivity', async () => {
    const wrapper = mount(AppTextField, {
      props: { modelValue: 'initial', placeholder: ''  }
    })
    
    expect(wrapper.element.value).toBe('initial')
    
    await wrapper.setProps({ modelValue: 'updated' })
    
    expect(wrapper.element.value).toBe('updated')
  })

  it('handles special characters in input', async () => {
    const wrapper = mount(AppTextField, {
      props: { modelValue: '', placeholder: ''  }
    })
    
    const specialText = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    await wrapper.setValue(specialText)
    
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([specialText])
  })

  it('handles numeric input type', async () => {
    const wrapper = mount(AppTextField, {
      props: { modelValue: '', type: 'number', placeholder: '' }
    })
    
    await wrapper.setValue('123')
    
    expect(wrapper.attributes('type')).toBe('number')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['123'])
  })
})