import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from '@/components/atoms/AppHeader.vue'

describe('AppHeader', () => {
  it('renders with correct element structure', () => {
    const wrapper = mount(AppHeader)
    
    expect(wrapper.element.tagName).toBe('HEADER')
    expect(wrapper.classes()).toContain('app-header')
  })

  it('displays the correct header text with emoji', () => {
    const wrapper = mount(AppHeader)
    
    expect(wrapper.text()).toBe('Jokes 🃏')
  })

  it('contains the joker emoji', () => {
    const wrapper = mount(AppHeader)
    
    expect(wrapper.text()).toContain('🃏')
  })

  it('has proper CSS class applied', () => {
    const wrapper = mount(AppHeader)
    
    expect(wrapper.find('.app-header').exists()).toBe(true)
    expect(wrapper.element.classList.contains('app-header')).toBe(true)
  })

  it('renders as a header element', () => {
    const wrapper = mount(AppHeader)
    
    expect(wrapper.element.tagName).toBe('HEADER')
  })

  it('has correct HTML structure', () => {
    const wrapper = mount(AppHeader)
    
    expect(wrapper.html()).toContain('class="app-header"')
    expect(wrapper.html()).toContain('Jokes 🃏')
    expect(wrapper.html()).toContain('</header>')
  })

  it('displays only the expected content', () => {
    const wrapper = mount(AppHeader)
    
    expect(wrapper.text().trim()).toBe('Jokes 🃏')
    expect(wrapper.findAll('*').length).toBe(1)
  })
})