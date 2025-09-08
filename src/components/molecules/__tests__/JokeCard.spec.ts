import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import JokeCard from '@/components/molecules/JokeCard.vue'

// Mocks
const mockSetJokeRatingById = vi.fn()
const mockRemoveJokeById = vi.fn()

vi.mock('@/stores/jokes', () => ({
  useJokesStore: () => ({
    setJokeRatingById: mockSetJokeRatingById,
    removeJokeById: mockRemoveJokeById
  })
}))

vi.mock('@/utils', () => ({
  confirmModal: vi.fn(() => true)
}))

describe('JokeCard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const defaultProps = {
    id: 1,
    type: 'programming',
    setup: 'Why do programmers prefer dark mode?',
    punchline: 'Because light attracts bugs!',
    rating: 3,
    byUser: false
  }

  function mountCard(extraProps = {}) {
    return mount(JokeCard, {
      props: { ...defaultProps, ...extraProps },
      global: {
        stubs: {
          AppButton: {
            props: ['text', 'color', 'disabled'],
            template: '<button class="app-button" @click="$emit(\'click\')">{{ text || "Remove" }}</button>'
          },
          AppCard: { template: '<div class="app-card"><slot /></div>' },
          AppRating: {
            props: ['rating', 'selectable'],
            emits: ['ratingSelected'],
            template: '<div class="app-rating" @click="$emit(\'ratingSelected\', 4)">R: {{ rating }}</div>'
          }
        }
      }
    })
  }

  it('renders with required props', async () => {
    const wrapper = mountCard()
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain(defaultProps.setup)
    expect(wrapper.text()).toContain(defaultProps.punchline)
    expect(wrapper.text()).toContain(defaultProps.type)
  })

  it('shows "By you" badge when byUser is true', async () => {
    const wrapper = mountCard({ byUser: true })
    await flushPromises()
    expect(wrapper.text().toLowerCase()).toContain('by you')
  })

  it('does not show "By you" badge when byUser is false', async () => {
    const wrapper = mountCard({ byUser: false })
    await flushPromises()
    expect(wrapper.text().toLowerCase()).not.toContain('by you 💅🔥')
  })

  it('calls setJokeRatingById when rating emitted', async () => {
    const wrapper = mountCard()
    await flushPromises()
    await wrapper.find('.app-rating').trigger('click')
    expect(mockSetJokeRatingById).toHaveBeenCalledWith(defaultProps.id, 4)
  })

  it('calls removeJokeById when remove confirmed', async () => {
    const { confirmModal } = await import('@/utils')
    vi.mocked(confirmModal).mockReturnValue(true)
    const wrapper = mountCard()
    await flushPromises()
    await wrapper.find('.app-button').trigger('click')
    expect(confirmModal).toHaveBeenCalled()
    expect(mockRemoveJokeById).toHaveBeenCalledWith(defaultProps.id)
  })

  it('does not call removeJokeById when remove cancelled', async () => {
    const { confirmModal } = await import('@/utils')
    vi.mocked(confirmModal).mockReturnValue(false)
    const wrapper = mountCard()
    await flushPromises()
    await wrapper.find('.app-button').trigger('click')
    expect(confirmModal).toHaveBeenCalled()
    expect(mockRemoveJokeById).not.toHaveBeenCalled()
  })

  it('handles long text content', async () => {
    const longSetup = 'A'.repeat(180)
    const longPunch = 'B'.repeat(220)
    const wrapper = mountCard({ setup: longSetup, punchline: longPunch })
    await flushPromises()
    expect(wrapper.text()).toContain(longSetup.slice(0, 30))
    expect(wrapper.text()).toContain(longPunch.slice(0, 30))
  })

  it('renders rating stub with correct initial rating', async () => {
    const wrapper = mountCard({ rating: 5 })
    await flushPromises()
    expect(wrapper.find('.app-rating').text()).toContain('R: 5')
  })
})