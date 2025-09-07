import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppRating from '@/components/atoms/AppRating.vue'

describe('AppRating', () => {
  it('renders with default props', () => {
    const wrapper = mount(AppRating, {
      props: { rating: 3 }
    })
    
    expect(wrapper.classes()).toContain('app-rating')
    expect(wrapper.findAll('.star')).toHaveLength(5)
    expect(wrapper.find('.rating-text').text()).toBe('3/5')
  })

  it('renders correct number of stars based on maxRating', () => {
    const wrapper = mount(AppRating, {
      props: { rating: 2, maxRating: 10 }
    })
    
    expect(wrapper.findAll('.star')).toHaveLength(10)
    expect(wrapper.find('.rating-text').text()).toBe('2/10')
  })

  it('applies filled class to correct number of stars', () => {
    const wrapper = mount(AppRating, {
      props: { rating: 3, maxRating: 5 }
    })
    
    const filledStars = wrapper.findAll('.star--filled')
    expect(filledStars).toHaveLength(3)
    
    // Check that first 3 stars are filled
    const stars = wrapper.findAll('.star')
    expect(stars[0].classes()).toContain('star--filled')
    expect(stars[1].classes()).toContain('star--filled')
    expect(stars[2].classes()).toContain('star--filled')
    expect(stars[3].classes()).not.toContain('star--filled')
    expect(stars[4].classes()).not.toContain('star--filled')
  })

  it('normalizes rating within bounds', () => {
    const wrapperHigh = mount(AppRating, {
      props: { rating: 10, maxRating: 5 }
    })
    expect(wrapperHigh.find('.rating-text').text()).toBe('5/5')
    expect(wrapperHigh.findAll('.star--filled')).toHaveLength(5)
    
    const wrapperLow = mount(AppRating, {
      props: { rating: -2, maxRating: 5 }
    })
    expect(wrapperLow.find('.rating-text').text()).toBe('0/5')
    expect(wrapperLow.findAll('.star--filled')).toHaveLength(0)
  })

  it('emits ratingSelected event when star is clicked', async () => {
    const wrapper = mount(AppRating, {
      props: { rating: 2 }
    })
    
    const stars = wrapper.findAll('.star')
    await stars[3].trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('ratingSelected')
    expect(wrapper.emitted('ratingSelected')).toEqual([[4]])
  })

  it('emits correct rating when different stars are clicked', async () => {
    const wrapper = mount(AppRating, {
      props: { rating: 0 }
    })
    
    const stars = wrapper.findAll('.star')
    
    await stars[0].trigger('click')
    expect(wrapper.emitted('ratingSelected')?.[0]).toEqual([1])
    
    await stars[4].trigger('click')
    expect(wrapper.emitted('ratingSelected')?.[1]).toEqual([5])
  })

  it('applies selectable class to all stars', () => {
    const wrapper = mount(AppRating, {
      props: { rating: 3 }
    })
    
    const stars = wrapper.findAll('.star')
    stars.forEach(star => {
      expect(star.classes()).toContain('star--selectable')
    })
  })

  it('displays star emoji in each star element', () => {
    const wrapper = mount(AppRating, {
      props: { rating: 2 }
    })
    
    const stars = wrapper.findAll('.star')
    stars.forEach(star => {
      expect(star.text()).toBe('⭐')
    })
  })

  it('handles zero rating correctly', () => {
    const wrapper = mount(AppRating, {
      props: { rating: 0 }
    })
    
    expect(wrapper.findAll('.star--filled')).toHaveLength(0)
    expect(wrapper.find('.rating-text').text()).toBe('0/5')
  })

  it('handles decimal ratings correctly -> Should floor to 2', () => {
    const wrapper = mount(AppRating, {
      props: { rating: 2.7 }
    })
    
    expect(wrapper.findAll('.star--filled')).toHaveLength(2)
    expect(wrapper.find('.rating-text').text()).toBe('2.7/5')
  })

  it('has correct CSS structure', () => {
    const wrapper = mount(AppRating, {
      props: { rating: 3 }
    })
    
    expect(wrapper.find('.app-rating').exists()).toBe(true)
    expect(wrapper.find('.rating-text').exists()).toBe(true)
    
    const stars = wrapper.findAll('.star')
    expect(stars.length).toBeGreaterThan(0)
    stars.forEach(star => {
      expect(star.classes()).toContain('star')
      expect(star.classes()).toContain('star--selectable')
    })
  })
})