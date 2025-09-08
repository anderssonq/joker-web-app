import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AppToolBar from '@/components/organisms/AppToolBar.vue'

const mockLoadJokeTypes = vi.fn()
const mockSetTypeSelected = vi.fn()
const mockGetTypeSelected = vi.fn()
const mockSetSortBy = vi.fn()
const mockGetSortBy = vi.fn()
const mockGetSortTypes = vi.fn()
const mockSetPerPage = vi.fn()
const mockGetPerPage = vi.fn()
const mockSetModeForm = vi.fn()
const mockGetModeForm = vi.fn()
const mockGetLoading = vi.fn()

function buildStore() {
  return {
    useJokesStore: () => ({
      loadJokeTypes: mockLoadJokeTypes,
      setTypeSelected: mockSetTypeSelected,
      getTypeSelected: mockGetTypeSelected,
      setSortBy: mockSetSortBy,
      getSortBy: mockGetSortBy,
      getSortTypes: mockGetSortTypes,
      setPerPage: mockSetPerPage,
      getPerPage: mockGetPerPage,
      setModeForm: mockSetModeForm,
      getModeForm: mockGetModeForm,
      getLoading: mockGetLoading
    })
  }
}

vi.mock('@/stores/jokes', () => buildStore())
vi.mock('../../stores/jokes', () => buildStore())

const stubs = {
  AppCard: {
    name: 'AppCard',
    template: '<div class="app-card"><slot /></div>'
  },
  AppDropdown: {
    name: 'AppDropdown',
    props: {
      title: String,
      items: { type: Array, default: () => [] },
      itemSelected: [String, Number]
    },
    emits: ['handleSelect'],
    template: `
      <div class="app-dropdown" :data-title="title">
        <div class="selected">{{ title }}: {{ itemSelected }}</div>
        <ul>
          <li v-for="it in items"
              :key="it"
              class="dropdown-item"
              @click="$emit('handleSelect', it)">{{ it }}</li>
        </ul>
      </div>`
  },
  AppButton: {
    name: 'AppButton',
    props: { text: String, disabled: Boolean },
    emits: ['click'],
    template: `<button class="app-button" :data-text="text" :disabled="disabled" @click="$emit('click')">{{ text }}</button>`
  },
  AppPagination: {
    name: 'AppPagination',
    template: '<div class="app-pagination-stub" />'
  },
  AppSkeleton: {
    name: 'AppSkeleton',
    template: '<div class="app-skeleton">Loading...</div>'
  }
}

async function mountToolBar() {
  const wrapper = mount(AppToolBar, {
    global: { stubs }
  })
  await flushPromises()
  return wrapper
}

beforeEach(() => {
  vi.clearAllMocks()
  mockLoadJokeTypes.mockResolvedValue(['general', 'programming', 'dad'])
  mockGetTypeSelected.mockReturnValue('general')
  mockGetSortTypes.mockReturnValue(['alphabetical', 'reverse'])
  mockGetSortBy.mockReturnValue('alphabetical')
  mockGetPerPage.mockReturnValue(5)
  mockGetModeForm.mockReturnValue('none')
  mockGetLoading.mockReturnValue(false)
})

describe('AppToolBar', () => {
  it('renders base structure', async () => {
    const w = await mountToolBar()
    expect(w.find('.app-tool-bar').exists()).toBe(true)
    expect(w.text()).toContain('Menu')
  })

  it('calls loadJokeTypes on mount and populates first dropdown', async () => {
    const w = await mountToolBar()
    expect(mockLoadJokeTypes).toHaveBeenCalledTimes(1)
    const typeDropdown = w.find('[data-title="Select a joke type"]')
    const items = typeDropdown.findAll('.dropdown-item').map(li => li.text())
    expect(items).toEqual(['general', 'programming', 'dad'])
  })

  it('shows skeleton when loading', async () => {
    mockGetLoading.mockReturnValue(true)
    const w = await mountToolBar()
    expect(w.find('.app-skeleton').exists()).toBe(true)
  })

  it('hides skeleton when not loading', async () => {
    mockGetLoading.mockReturnValue(false)
    const w = await mountToolBar()
    expect(w.find('.app-skeleton').exists()).toBe(false)
  })

  it('selecting a joke type triggers setTypeSelected', async () => {
    const w = await mountToolBar()
    const programming = w.find('[data-title="Select a joke type"] .dropdown-item:nth-child(2)')
    await programming.trigger('click')
    expect(mockSetTypeSelected).toHaveBeenCalledWith('programming')
  })

  it('selecting a sort option triggers setSortBy', async () => {
    const w = await mountToolBar()
    const reverse = w.find('[data-title="Order jokes by"] .dropdown-item:nth-child(2)')
    await reverse.trigger('click')
    expect(mockSetSortBy).toHaveBeenCalledWith('reverse')
  })

  it('selecting per page triggers setPerPage with number', async () => {
    const w = await mountToolBar()
    const perPageDropdown = w.find('[data-title="Number of jokes per page"]')
    const ten = perPageDropdown.findAll('.dropdown-item')[2]
    await ten.trigger('click')
    expect(mockSetPerPage).toHaveBeenCalledWith(10)
  })

  it('add button enabled when mode != create and calls setModeForm', async () => {
    mockGetModeForm.mockReturnValue('none')
    const w = await mountToolBar()
    const addBtn = w.find('.app-button[data-text="Add a new Joke 😜"]')
    expect(addBtn.attributes('disabled')).toBeUndefined()
    await addBtn.trigger('click')
    expect(mockSetModeForm).toHaveBeenCalledWith('create')
  })

  it('add button disabled when mode == create', async () => {
    mockGetModeForm.mockReturnValue('create')
    const w = await mountToolBar()
    const addBtn = w.find('.app-button[data-text="Add a new Joke 😜"]')
    expect(addBtn.attributes('disabled')).toBeDefined()
  })

  it('renders pagination stub', async () => {
    const w = await mountToolBar()
    expect(w.find('.app-pagination-stub').exists()).toBe(true)
  })
})