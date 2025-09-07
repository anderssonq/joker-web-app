import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AppFooter from '@/components/atoms/AppFooter.vue'

describe('AppFooter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders with default classes', () => {
    const wrapper = mount(AppFooter)
    
    expect(wrapper.classes()).toContain('app-footer')
    expect(wrapper.element.tagName).toBe('FOOTER')
  })

  it('renders the correct link with proper attributes', () => {
    const wrapper = mount(AppFooter)
    const link = wrapper.find('a')
    
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://andersoftware.com/')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
    expect(link.text()).toBe('Ander was here')
  })

  it('displays the current year', () => {
    const wrapper = mount(AppFooter)
    
    expect(wrapper.text()).toContain('2025')
  })

  it('displays the complete footer text', () => {
    const wrapper = mount(AppFooter)
    
    expect(wrapper.text()).toBe('Ander was here. 2025')
  })

  it('renders footer element structure correctly', () => {
    const wrapper = mount(AppFooter)
    
    expect(wrapper.element.tagName).toBe('FOOTER')
    
    expect(wrapper.html()).toContain('2025')
  })

  it('handles different years correctly', () => {
    vi.setSystemTime(new Date('2024-12-31'))
    
    const wrapper = mount(AppFooter)
    
    expect(wrapper.text()).toContain('2024')
    expect(wrapper.text()).toBe('Ander was here. 2024')
  })

  it('link has security attributes for external link', () => {
    const wrapper = mount(AppFooter)
    const link = wrapper.find('a')
    
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })

  it('applies correct CSS structure', () => {
    const wrapper = mount(AppFooter)
    
    expect(wrapper.find('.app-footer').exists()).toBe(true)
    expect(wrapper.element.classList.contains('app-footer')).toBe(true)
  })
})