import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSkeleton from '@/components/atoms/AppSkeleton.vue'

describe('AppSkeleton', () => {
  it('renders with correct element structure', () => {
    const wrapper = mount(AppSkeleton)
    
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.classes()).toContain('skeleton')
  })

  it('displays loading text', () => {
    const wrapper = mount(AppSkeleton)
    
    expect(wrapper.text()).toContain('Loading...')
    expect(wrapper.find('p').text()).toBe('Loading...')
  })

  it('has proper CSS class applied', () => {
    const wrapper = mount(AppSkeleton)
    
    expect(wrapper.find('.skeleton').exists()).toBe(true)
    expect(wrapper.element.classList.contains('skeleton')).toBe(true)
  })

  it('renders paragraph element inside span', () => {
    const wrapper = mount(AppSkeleton)
    
    const paragraph = wrapper.find('p')
    expect(paragraph.exists()).toBe(true)
    expect(paragraph.text()).toBe('Loading...')
  })

  it('has correct HTML structure', () => {
    const wrapper = mount(AppSkeleton)
    
    expect(wrapper.html()).toContain('class="skeleton"')
    expect(wrapper.html()).toContain('Loading...')
    expect(wrapper.html()).toContain('</span>')
  })
})