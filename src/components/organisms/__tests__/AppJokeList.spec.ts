// Updated: make paginatedJokes a function (component calls paginatedJokes()), keep dual path mocks,
// use global stubs, and ensure re-render after data mutation.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AppJokeList from '@/components/organisms/AppJokeList.vue'
import type { Joke } from '@/interfaces/joke.interface'

let jokesData: Joke[] = []
let loadingState = false

function buildStoreMock() {
  return {
    useJokesStore: () => ({
      paginatedJokes: () => jokesData,
      getLoading: () => loadingState
    })
  }
}

vi.mock('@/stores/jokes', () => buildStoreMock())
vi.mock('../../stores/jokes', () => buildStoreMock())

const stubs = {
  AppSkeleton: {
    name: 'AppSkeleton',
    template: '<div class="app-skeleton">Loading...</div>'
  },
  AppCard: {
    name: 'AppCard',
    template: '<div class="app-card"><slot /></div>'
  },
  JokeCard: {
    name: 'JokeCard',
    props: {
      id: [Number, String],
      type: String,
      setup: String,
      punchline: String,
      rating: Number,
      byUser: Boolean
    },
    template: `<div class="joke-card"
      :data-id="id"
      :data-type="type"
      :data-rating="rating"
      :data-by-user="byUser"
    >
      <h4 class="setup">{{ setup }}</h4>
      <p class="punchline">{{ punchline }}</p>
    </div>`
  }
}

async function mountList() {
  const wrapper = mount(AppJokeList, { global: { stubs } })
  await flushPromises()
  return wrapper
}

beforeEach(() => {
  jokesData = []
  loadingState = false
})

describe('AppJokeList', () => {
  it('shows skeleton while loading', async () => {
    loadingState = true
    const w = await mountList()
    expect(w.find('.app-skeleton').exists()).toBe(true)
  })

  it('renders joke cards from store', async () => {
    jokesData = [
      { id: 1, type: 'general', setup: 'S1', punchline: 'P1', rating: 4, byUser: false },
      { id: 2, type: 'programming', setup: 'S2', punchline: 'P2', rating: 5, byUser: true }
    ]
    const w = await mountList()
    const cards = w.findAll('.joke-card')
    expect(cards).toHaveLength(2)
    expect(cards[0].attributes('data-type')).toBe('general')
    expect(cards[1].attributes('data-by-user')).toBe('true')
  })

  it('passes full props to JokeCard', async () => {
    jokesData = [
      { id: 10, type: 'dad', setup: 'Why?', punchline: 'Because.', rating: 3, byUser: true }
    ]
    const w = await mountList()
    const card = w.get('.joke-card')
    expect(card.attributes('data-id')).toBe('10')
    expect(card.find('.setup').text()).toBe('Why?')
    expect(card.find('.punchline').text()).toBe('Because.')
  })

  it('shows empty state card when no jokes', async () => {
    jokesData = []
    const w = await mountList()
    expect(w.text()).toMatch(/No more jokes available/i)
    expect(w.findAll('.joke-card')).toHaveLength(0)
  })

  it('does not show empty state when jokes exist', async () => {
    jokesData = [{ id: 1, type: 'general', setup: 'S', punchline: 'P', rating: 1, byUser: false }]
    const w = await mountList()
    expect(w.findAll('.joke-card')).toHaveLength(1)
    expect(w.text()).not.toMatch(/No more jokes available/i)
  })

  it('updates when jokes list changes (forced re-render)', async () => {
    jokesData = [{ id: 1, type: 'general', setup: 'S', punchline: 'P', rating: 1, byUser: false }]
    const w = await mountList()
    expect(w.findAll('.joke-card')).toHaveLength(1)

    jokesData = []
    await w.vm.$forceUpdate()
    await flushPromises()

    expect(w.findAll('.joke-card')).toHaveLength(0)
    expect(w.text()).toMatch(/No more jokes available/i)
  })
})