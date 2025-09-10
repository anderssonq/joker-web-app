/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AppPagination from '@/components/molecules/AppPagination.vue'

// Store mocks
const mockGetTotalPages = vi.fn()
const mockGetCurrentPage = vi.fn()
const mockSetCurrentPage = vi.fn()

vi.mock('@/stores/jokes', () => ({
  useJokesStore: () => ({
    getTotalPages: mockGetTotalPages,
    getCurrentPage: mockGetCurrentPage,
    setCurrentPage: mockSetCurrentPage
  })
}))

async function mountPagination(props: Record<string, any> = {}) {
  const wrapper = mount(AppPagination, {
    props: { maxVisiblePages: 5, ...props },
    global: {
      stubs: {
        AppButton: {
          name: 'AppButton',
          props: {
            text: { type: String, default: '' },
            color: { type: String, default: 'purple' },
            disabled: { type: Boolean, default: false }
          },
          emits: ['click'],
          template: `<button
            class="app-button"
            :data-text="text"
            :data-color="color"
            :disabled="disabled"
            @click="$emit('click')"
          >{{ text }}</button>`
        }
      }
    }
  })
  await flushPromises()
  return wrapper
}

function pageButtons(wrapper: any) {
  return wrapper.findAll('button')
    .filter((b: any) => !['Previous', 'Next'].includes(b.text()))
    .filter((b: any) => b.text().trim() !== '')
}

beforeEach(() => {
  vi.clearAllMocks()
  mockGetTotalPages.mockReturnValue(10)
  mockGetCurrentPage.mockReturnValue(1)
})

describe('AppPagination', () => {
  it('renders base structure', async () => {
    const w = await mountPagination()
    expect(w.find('.app-pagination').exists()).toBe(true)
    expect(w.find('.pagination-pages').exists()).toBe(true)
  })

  it('renders Previous and Next buttons', async () => {
    const w = await mountPagination()
    const texts = w.findAll('button').map(b => b.text())
    expect(texts).toContain('Previous')
    expect(texts).toContain('Next')
  })

  it('disables Previous on first page', async () => {
    mockGetCurrentPage.mockReturnValue(1)
    const w = await mountPagination()
    const prev = w.get('button[data-text="Previous"]')
    expect(prev.attributes('disabled')).toBeDefined()
  })

  it('disables Next on last page', async () => {
    mockGetCurrentPage.mockReturnValue(10)
    mockGetTotalPages.mockReturnValue(10)
    const w = await mountPagination()
    const next = w.get('button[data-text="Next"]')
    expect(next.attributes('disabled')).toBeDefined()
  })

  it('enables nav buttons on middle page', async () => {
    mockGetCurrentPage.mockReturnValue(5)
    const w = await mountPagination()
    const prev = w.get('button[data-text="Previous"]')
    const next = w.get('button[data-text="Next"]')
    expect(prev.attributes('disabled')).toBeUndefined()
    expect(next.attributes('disabled')).toBeUndefined()
  })

  it('shows default maxVisiblePages = 5', async () => {
    mockGetCurrentPage.mockReturnValue(5)
    const w = await mountPagination()
    expect(pageButtons(w).length).toBe(5)
  })

  it('respects custom maxVisiblePages', async () => {
    mockGetCurrentPage.mockReturnValue(5)
    const w = await mountPagination({ maxVisiblePages: 3 })
    expect(pageButtons(w).length).toBe(3)
  })

  it('highlights current page (data-color="green")', async () => {
    mockGetCurrentPage.mockReturnValue(3)
    const w = await mountPagination()
    const current = pageButtons(w).find((b: any) => b.text() === '3')
    expect(current?.attributes('data-color')).toBe('green')
  })

  it('non-current pages use purple', async () => {
    mockGetCurrentPage.mockReturnValue(3)
    const w = await mountPagination()
    pageButtons(w)
      .filter((b: any) => b.text() !== '3')
      .forEach((b: any) => expect(b.attributes('data-color')).toBe('purple'))
  })

  it('sets page when clicking different page', async () => {
    mockGetCurrentPage.mockReturnValue(1)
    const w = await mountPagination()
    const btn2 = pageButtons(w).find((b: any) => b.text() === '2')!
    await btn2.trigger('click')
    expect(mockSetCurrentPage).toHaveBeenCalledWith(2)
  })

  it('does not set page when clicking current page', async () => {
    mockGetCurrentPage.mockReturnValue(2)
    const w = await mountPagination()
    const current = pageButtons(w).find((b: any) => b.text() === '2')!
    await current.trigger('click')
    expect(mockSetCurrentPage).not.toHaveBeenCalled()
  })

  it('Previous navigates back', async () => {
    mockGetCurrentPage.mockReturnValue(4)
    const w = await mountPagination()
    await w.get('button[data-text="Previous"]').trigger('click')
    expect(mockSetCurrentPage).toHaveBeenCalledWith(3)
  })

  it('Next navigates forward', async () => {
    mockGetCurrentPage.mockReturnValue(4)
    const w = await mountPagination()
    await w.get('button[data-text="Next"]').trigger('click')
    expect(mockSetCurrentPage).toHaveBeenCalledWith(5)
  })

  it('shows all pages when total < maxVisiblePages', async () => {
    mockGetTotalPages.mockReturnValue(3)
    mockGetCurrentPage.mockReturnValue(2)
    const w = await mountPagination({ maxVisiblePages: 5 })
    expect(pageButtons(w).map((b: any) => b.text())).toEqual(['1','2','3'])
  })

  it('single page scenario', async () => {
    mockGetTotalPages.mockReturnValue(1)
    mockGetCurrentPage.mockReturnValue(1)
    const w = await mountPagination()
    expect(pageButtons(w).length).toBe(1)
  })

  it('zero pages scenario', async () => {
    mockGetTotalPages.mockReturnValue(0)
    mockGetCurrentPage.mockReturnValue(1)
    const w = await mountPagination()
    expect(pageButtons(w).length).toBe(0)
  })
})