import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'

// Count async factory evaluations
let jokesPageEvalCount = 0

// IMPORTANT: mock BEFORE importing App (dynamic import will use this)
vi.mock('@/page/JokesPage.vue', () => {
  jokesPageEvalCount++
  return {
    __esModule: true,
    default: defineComponent({
      name: 'JokesPage',
      template: '<div data-test="jokes-page-stub">Jokes Page Stub</div>'
    })
  }
})

import App from '@/App.vue'

async function resolveAsync() {
  // flushPromises sometimes needs to run twice for async components
  await flushPromises()
  await flushPromises()
}

describe('App.vue', () => {
  it('renders async JokesPage component', async () => {
    const wrapper = mount(App)
    await resolveAsync()
    expect(wrapper.find('[data-test="jokes-page-stub"]').exists()).toBe(true)
  })

  it('evaluates async page module only once', async () => {
    const wrapper = mount(App)
    await resolveAsync()
    expect(jokesPageEvalCount).toBe(1)
    expect(wrapper.html()).toContain('jokes-page-stub')
  })
})