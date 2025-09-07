import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppCard from '@/components/atoms/AppCard.vue'

describe('AppCard', () => {
  it('renders with default classes', () => {
    const wrapper = mount(AppCard)
    
    expect(wrapper.classes()).toContain('app-card')
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('renders slot content correctly', () => {
    const slotContent = '<h2>Test Title</h2><p>Test content</p>'
    const wrapper = mount(AppCard, {
      slots: {
        default: slotContent
      }
    })
    
    expect(wrapper.html()).toContain('<h2>Test Title</h2>')
    expect(wrapper.html()).toContain('<p>Test content</p>')
  })

  it('renders text content in slot', () => {
    const wrapper = mount(AppCard, {
      slots: {
        default: 'Simple text content'
      }
    })
    
    expect(wrapper.text()).toBe('Simple text content')
  })

  it('renders multiple elements in slot', () => {
    const wrapper = mount(AppCard, {
      slots: {
        default: `
          <div class="card-header">Header</div>
          <div class="card-body">Body content</div>
          <div class="card-footer">Footer</div>
        `
      }
    })
    
    expect(wrapper.find('.card-header').text()).toBe('Header')
    expect(wrapper.find('.card-body').text()).toBe('Body content')
    expect(wrapper.find('.card-footer').text()).toBe('Footer')
  })

  it('renders empty when no slot content provided', () => {
    const wrapper = mount(AppCard)
    
    expect(wrapper.text()).toBe('')
    expect(wrapper.find('.app-card').exists()).toBe(true)
  })

  it('applies correct CSS styles', () => {
    const wrapper = mount(AppCard)
    const cardElement = wrapper.find('.app-card')
    
    expect(cardElement.exists()).toBe(true)
    
    expect(wrapper.element.classList.contains('app-card')).toBe(true)
  })

  it('handles complex slot content', () => {
    const wrapper = mount(AppCard, {
      slots: {
        default: `
          <img src="test.jpg" alt="test" />
          <h3>Card Title</h3>
          <p>Card description with <strong>bold text</strong></p>
          <button>Action Button</button>
        `
      }
    })
    
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('h3').text()).toBe('Card Title')
    expect(wrapper.find('strong').text()).toBe('bold text')
    expect(wrapper.find('button').text()).toBe('Action Button')
  })
})