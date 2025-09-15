/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { MODE_CREATE, MODE_EDIT, MODE_NONE } from '@/const'
import type { Joke } from '@/interfaces/joke.interface'

vi.mock('@/utils', () => {
  const confirmModal = vi.fn(() => true)
  return { confirmModal, __confirmModalMock: confirmModal }
})

vi.mock('@/stores/jokes', () => {
  const store = {
    setModeForm: vi.fn(),
    getTypes: vi.fn(() => ['general', 'programming', 'dad', 'knock-knock']),
    addJoke: vi.fn(),
    getJokes: vi.fn(() => [] as Joke[]),
    getJokeId: vi.fn(() => 1),
    updateJoke: vi.fn()
  }
  return {
    useJokesStore: () => store,
    __storeMock: store
  }
})

// Imports AFTER mocks, to ensure they use the mocked versions
import AppFormJoke from '@/components/organisms/AppFormJoke.vue'
import { useJokesStore } from '@/stores/jokes'
import { confirmModal } from '@/utils'

// Get the mocked store instance
const storeMock = vi.mocked(useJokesStore())
// Get the mocked confirmModal function
const confirmModalMock = vi.mocked(confirmModal)

// ---- Helpers ----
function findButtonByText(wrapper: any, text: string) {
  const btn = wrapper.findAll('button').find((b: any) => b.text().includes(text))
  if (!btn) throw new Error(`Button with text "${text}" not found`)
  return btn
}

const sampleJoke: Joke = {
  id: 1,
  type: 'programming',
  setup: 'Why do programmers prefer dark mode?',
  punchline: 'Because light attracts bugs!',
  rating: 4,
  byUser: true
}

function resetStoreDefaults() {
  storeMock.setModeForm.mockClear()
  storeMock.addJoke.mockClear()
  storeMock.updateJoke.mockClear()
  storeMock.getTypes.mockClear().mockReturnValue(['general', 'programming', 'dad', 'knock-knock'])
  storeMock.getJokes.mockClear().mockReturnValue([])
  storeMock.getJokeId.mockClear().mockReturnValue(1)
  confirmModalMock.mockClear().mockReturnValue(true)
}

function mountFormJoke(props: any = {}) {
  return mount(AppFormJoke, {
    props: { mode: MODE_CREATE, ...props },
    global: {
      stubs: {
        AppCard: { template: '<div class="app-card"><slot /></div>' },
        AppButton: {
          props: ['text', 'color', 'disabled'],
          emits: ['click'],
          template: '<button :disabled="disabled" @click="$emit(\'click\')">{{ text }}</button>'
        },
        AppTextField: {
          props: ['modelValue', 'placeholder'],
          emits: ['update:modelValue'],
          template: '<input :value="modelValue" :placeholder="placeholder" @input="$emit(\'update:modelValue\', $event.target.value)" />'
        },
        AppDropdown: {
          props: ['title', 'items', 'itemSelected'],
          emits: ['handleSelect'],
          template: `
            <select @change="$emit('handleSelect', $event.target.value)">
              <option v-for="item in items" :key="item" :value="item" :selected="item===itemSelected">{{ item }}</option>
            </select>`
        }
      }
    }
  })
}

const getSetupInput = (w: any) => w.find('input[placeholder="Enter the setup here"]')
const getPunchlineInput = (w: any) => w.find('input[placeholder="Enter the punchline here"]')

// ---- Test Suites ----
describe('AppFormJoke', () => {
  beforeEach(() => resetStoreDefaults())

  describe('Component Mounting', () => {
    it('renders with default create mode props', async () => {
      const wrapper = mountFormJoke()
      await flushPromises()
      expect(wrapper.find('.joke-form').exists()).toBe(true)
      expect(wrapper.text()).toMatch(/Add a new\s+Joke/)
    })

    it('renders with edit mode', async () => {
      storeMock.getJokes.mockReturnValue([sampleJoke])
      const wrapper = mountFormJoke({ mode: MODE_EDIT })
      await flushPromises()
      expect(wrapper.text()).toMatch(/Edit a\s+Joke/)
      expect(findButtonByText(wrapper, 'Update Joke').exists()).toBe(true)
    })

    it('loads existing joke data in edit mode', async () => {
      storeMock.getJokes.mockReturnValue([sampleJoke])
      const wrapper = mountFormJoke({ mode: MODE_EDIT })
      await flushPromises()
      expect(getSetupInput(wrapper).element.value).toBe(sampleJoke.setup)
      expect(getPunchlineInput(wrapper).element.value).toBe(sampleJoke.punchline)
    })
  })

  describe('Form Validation', () => {
    const getSaveButton = (w: any) => findButtonByText(w, 'Save Joke')

    it('disables save button with empty form', () => {
      const wrapper = mountFormJoke()
      expect(getSaveButton(wrapper).attributes('disabled')).toBeDefined()
    })

    it('enables save button with valid form', async () => {
      const wrapper = mountFormJoke()
      await getSetupInput(wrapper).setValue('A')
      await getPunchlineInput(wrapper).setValue('B')
      expect(getSaveButton(wrapper).attributes('disabled')).toBeUndefined()
    })

    it('trims whitespace and keeps disabled', async () => {
      const wrapper = mountFormJoke()
      await getSetupInput(wrapper).setValue('   ')
      await getPunchlineInput(wrapper).setValue('   ')
      expect(getSaveButton(wrapper).attributes('disabled')).toBeDefined()
    })

    it('invalid if only one field filled', async () => {
      const wrapper = mountFormJoke()
      await getSetupInput(wrapper).setValue('Only setup')
      expect(getSaveButton(wrapper).attributes('disabled')).toBeDefined()
    })

    it('disabled button prevents confirmModal call', async () => {
      const wrapper = mountFormJoke()
      await findButtonByText(wrapper, 'Save Joke').trigger('click')
      expect(confirmModalMock).not.toHaveBeenCalled()
    })

    it('does not call addJoke when invalid', async () => {
      const wrapper = mountFormJoke()
      await getSetupInput(wrapper).setValue('Only')
      await findButtonByText(wrapper, 'Save Joke').trigger('click')
      expect(storeMock.addJoke).not.toHaveBeenCalled()
      expect(confirmModalMock).not.toHaveBeenCalled()
    })
  })

  describe('Form Interactions', () => {
    it('updates setup field', async () => {
      const wrapper = mountFormJoke()
      await getSetupInput(wrapper).setValue('New setup')
      expect(getSetupInput(wrapper).element.value).toBe('New setup')
    })

    it('updates punchline field', async () => {
      const wrapper = mountFormJoke()
      await getPunchlineInput(wrapper).setValue('New punch')
      expect(getPunchlineInput(wrapper).element.value).toBe('New punch')
    })

    it('handles type selection', async () => {
      const wrapper = mountFormJoke()
      await wrapper.find('select').setValue('dad')
      expect(wrapper.find('select').element.value).toBe('dad')
    })

    it('default selected type is first type', () => {
      const wrapper = mountFormJoke()
      expect(wrapper.find('select').element.value).toBe('general')
    })

    it('changing type before text keeps save disabled', async () => {
      const wrapper = mountFormJoke()
      await wrapper.find('select').setValue('dad')
      expect(findButtonByText(wrapper, 'Save Joke').attributes('disabled')).toBeDefined()
    })
  })

  describe('Create Mode Actions', () => {
    it('calls addJoke on confirmed save', async () => {
      const wrapper = mountFormJoke({ mode: MODE_CREATE })
      await getSetupInput(wrapper).setValue('Setup X')
      await getPunchlineInput(wrapper).setValue('Punchline X')
      await findButtonByText(wrapper, 'Save Joke').trigger('click')
      expect(confirmModalMock).toHaveBeenCalledWith('Are you sure you want to add this joke? 🤡')
      expect(storeMock.addJoke).toHaveBeenCalledWith({
        id: 0,
        type: 'general',
        setup: 'Setup X',
        punchline: 'Punchline X'
      })
      expect(storeMock.setModeForm).toHaveBeenCalledWith(MODE_NONE)
    })

    it('aborts when confirm denied', async () => {
      confirmModalMock.mockReturnValue(false)
      const wrapper = mountFormJoke({ mode: MODE_CREATE })
      await getSetupInput(wrapper).setValue('S')
      await getPunchlineInput(wrapper).setValue('P')
      await findButtonByText(wrapper, 'Save Joke').trigger('click')
      expect(storeMock.addJoke).not.toHaveBeenCalled()
      expect(storeMock.setModeForm).not.toHaveBeenCalled()
    })

    it('does not call addJoke if invalid form', async () => {
      const wrapper = mountFormJoke({ mode: MODE_CREATE })
      await getSetupInput(wrapper).setValue('Only one side')
      await findButtonByText(wrapper, 'Save Joke').trigger('click')
      expect(storeMock.addJoke).not.toHaveBeenCalled()
      expect(confirmModalMock).not.toHaveBeenCalled()
    })

    it('saves with different selected type', async () => {
      const wrapper = mountFormJoke({ mode: MODE_CREATE })
      await getSetupInput(wrapper).setValue('Typed setup')
      await getPunchlineInput(wrapper).setValue('Typed punchline')
      await wrapper.find('select').setValue('dad')
      await findButtonByText(wrapper, 'Save Joke').trigger('click')
      expect(storeMock.addJoke).toHaveBeenCalledWith(expect.objectContaining({ type: 'dad' }))
    })

    it('does not include byUser flag', async () => {
      const wrapper = mountFormJoke({ mode: MODE_CREATE })
      await getSetupInput(wrapper).setValue('A')
      await getPunchlineInput(wrapper).setValue('B')
      await findButtonByText(wrapper, 'Save Joke').trigger('click')
      const arg = storeMock.addJoke.mock.calls[0][0]
      expect(arg.byUser).toBeUndefined()
    })

    it('respects confirmModal multiple calls (second deny)', async () => {
      confirmModalMock.mockReturnValueOnce(true).mockReturnValueOnce(false)
      const w1 = mountFormJoke({ mode: MODE_CREATE })
      await getSetupInput(w1).setValue('One')
      await getPunchlineInput(w1).setValue('Two')
      await findButtonByText(w1, 'Save Joke').trigger('click')
      const w2 = mountFormJoke({ mode: MODE_CREATE })
      await getSetupInput(w2).setValue('Three')
      await getPunchlineInput(w2).setValue('Four')
      await findButtonByText(w2, 'Save Joke').trigger('click')
      expect(storeMock.addJoke).toHaveBeenCalledTimes(1)
    })
  })

  describe('Edit Mode Actions', () => {
    beforeEach(() => {
      storeMock.getJokes.mockReturnValue([sampleJoke])
    })

    it('calls updateJoke on confirmed update with modified setup', async () => {
      const wrapper = mountFormJoke({ mode: MODE_EDIT })
      await flushPromises()
      await getSetupInput(wrapper).setValue('Updated setup')
      await findButtonByText(wrapper, 'Update Joke').trigger('click')
      expect(confirmModalMock).toHaveBeenCalledWith('Are you sure you want to update this joke? 🤡')
      expect(storeMock.updateJoke).toHaveBeenCalledWith(1, {
        id: 1,
        type: 'programming',
        setup: 'Updated setup',
        punchline: 'Because light attracts bugs!'
      })
      expect(storeMock.setModeForm).toHaveBeenCalledWith(MODE_NONE)
    })

    it('updates when only punchline changes', async () => {
      const wrapper = mountFormJoke({ mode: MODE_EDIT })
      await flushPromises()
      await getPunchlineInput(wrapper).setValue('New punchline only')
      await findButtonByText(wrapper, 'Update Joke').trigger('click')
      const [, payload] = storeMock.updateJoke.mock.calls[0]
      expect(payload.setup).toBe(sampleJoke.setup)
      expect(payload.punchline).toBe('New punchline only')
    })

    it('does not update when confirm denied', async () => {
      confirmModalMock.mockReturnValue(false)
      const wrapper = mountFormJoke({ mode: MODE_EDIT })
      await flushPromises()
      await findButtonByText(wrapper, 'Update Joke').trigger('click')
      expect(storeMock.updateJoke).not.toHaveBeenCalled()
      expect(storeMock.setModeForm).not.toHaveBeenCalled()
    })

    it('handles missing joke gracefully', async () => {
      storeMock.getJokes.mockReturnValue([])
      const wrapper = mountFormJoke({ mode: MODE_EDIT })
      await flushPromises()
      expect(getSetupInput(wrapper).element.value).toBe('')
    })

    it('updates joke type when changed before saving', async () => {
      const wrapper = mountFormJoke({ mode: MODE_EDIT })
      await flushPromises()
      await wrapper.find('select').setValue('dad')
      await findButtonByText(wrapper, 'Update Joke').trigger('click')
      expect(storeMock.updateJoke).toHaveBeenCalledWith(1, expect.objectContaining({ type: 'dad' }))
    })

    it('updates even if fields unchanged', async () => {
      const wrapper = mountFormJoke({ mode: MODE_EDIT })
      await flushPromises()
      await findButtonByText(wrapper, 'Update Joke').trigger('click')
      expect(storeMock.updateJoke).toHaveBeenCalled()
    })

    it('cancel sets mode none', async () => {
      const wrapper = mountFormJoke({ mode: MODE_EDIT })
      await flushPromises()
      await findButtonByText(wrapper, 'Cancel').trigger('click')
      expect(storeMock.setModeForm).toHaveBeenCalledWith(MODE_NONE)
    })

    it('does not update if setup invalid', async () => {
      const wrapper = mountFormJoke({ mode: MODE_EDIT })
      await flushPromises()
      await getSetupInput(wrapper).setValue('   ')
      await findButtonByText(wrapper, 'Update Joke').trigger('click')
      expect(storeMock.updateJoke).not.toHaveBeenCalled()
      expect(confirmModalMock).not.toHaveBeenCalled()
    })

    it('does not update if punchline invalid', async () => {
      const wrapper = mountFormJoke({ mode: MODE_EDIT })
      await flushPromises()
      await getPunchlineInput(wrapper).setValue('   ')
      await findButtonByText(wrapper, 'Update Joke').trigger('click')
      expect(storeMock.updateJoke).not.toHaveBeenCalled()
    })

    it('keeps id consistent after update', async () => {
      const wrapper = mountFormJoke({ mode: MODE_EDIT })
      await flushPromises()
      await getSetupInput(wrapper).setValue('Another change')
      await findButtonByText(wrapper, 'Update Joke').trigger('click')
      const [, payload] = storeMock.updateJoke.mock.calls[0]
      expect(payload.id).toBe(1)
    })

    it('gracefully handles non-existent jokeId', async () => {
      storeMock.getJokeId.mockReturnValue(99)
      const wrapper = mountFormJoke({ mode: MODE_EDIT })
      await flushPromises()
      expect(getSetupInput(wrapper).element.value).toBe('')
    })
  })

  describe('Cancel Action', () => {
    it('sets mode none on cancel in create', async () => {
      const wrapper = mountFormJoke()
      await findButtonByText(wrapper, 'Cancel').trigger('click')
      expect(storeMock.setModeForm).toHaveBeenCalledWith(MODE_NONE)
    })
  })

  describe('Form Labels & Accessibility', () => {
    it('renders labels', () => {
      const wrapper = mountFormJoke()
      expect(wrapper.find('label[for="type"]').text()).toBe('Type:')
      expect(wrapper.find('label[for="setup"]').text()).toBe('Setup:')
      expect(wrapper.find('label[for="punchline"]').text()).toBe('Punchline:')
    })
  })

  describe('Props Handling', () => {
    it('MODE_NONE behaves like create', () => {
      const wrapper = mountFormJoke({ mode: MODE_NONE })
      expect(findButtonByText(wrapper, 'Save Joke').exists()).toBe(true)
    })

    it('button text differs per mode', () => {
      const c = mountFormJoke({ mode: MODE_CREATE })
      storeMock.getJokes.mockReturnValue([sampleJoke])
      const e = mountFormJoke({ mode: MODE_EDIT })
      expect(findButtonByText(c, 'Save Joke').exists()).toBe(true)
      expect(findButtonByText(e, 'Update Joke').exists()).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('empty types array -> no options', () => {
      storeMock.getTypes.mockReturnValue([])
      const wrapper = mountFormJoke()
      expect(wrapper.find('select').findAll('option')).toHaveLength(0)
    })

    it('changing type keeps form valid if fields filled', async () => {
      const wrapper = mountFormJoke()
      await getSetupInput(wrapper).setValue('Setup')
      await getPunchlineInput(wrapper).setValue('Punchline')
      await wrapper.find('select').setValue('programming')
      expect(findButtonByText(wrapper, 'Save Joke').attributes('disabled')).toBeUndefined()
    })

    it('cancel keeps field values but sets mode none', async () => {
      const wrapper = mountFormJoke()
      await getSetupInput(wrapper).setValue('S')
      await getPunchlineInput(wrapper).setValue('P')
      await findButtonByText(wrapper, 'Cancel').trigger('click')
      expect(storeMock.setModeForm).toHaveBeenCalledWith(MODE_NONE)
      expect(getSetupInput(wrapper).element.value).toBe('S')
    })

    it('edit mode with getJokeId = -1 no prefill', async () => {
      storeMock.getJokeId.mockReturnValue(-1)
      storeMock.getJokes.mockReturnValue([sampleJoke])
      const wrapper = mountFormJoke({ mode: MODE_EDIT })
      await flushPromises()
      expect(getSetupInput(wrapper).element.value).toBe('')
    })
  })

  describe('confirmModal messaging', () => {
    it('uses add message in create mode', async () => {
      const wrapper = mountFormJoke()
      await getSetupInput(wrapper).setValue('A')
      await getPunchlineInput(wrapper).setValue('B')
      await findButtonByText(wrapper, 'Save Joke').trigger('click')
      expect(confirmModalMock).toHaveBeenCalledWith(expect.stringContaining('add this joke'))
      expect(confirmModalMock).toHaveBeenCalledWith(expect.stringContaining('🤡'))
    })

    it('uses update message in edit mode', async () => {
      storeMock.getJokes.mockReturnValue([sampleJoke])
      const wrapper = mountFormJoke({ mode: MODE_EDIT })
      await findButtonByText(wrapper, 'Update Joke').trigger('click')
      expect(confirmModalMock).toHaveBeenCalledWith(expect.stringContaining('update this joke'))
    })

    it('not called when edit form invalid', async () => {
      storeMock.getJokes.mockReturnValue([sampleJoke])
      const wrapper = mountFormJoke({ mode: MODE_EDIT })
      await getPunchlineInput(wrapper).setValue('   ')
      await findButtonByText(wrapper, 'Update Joke').trigger('click')
      expect(confirmModalMock).not.toHaveBeenCalled()
    })
  })

  describe('Additional Coverage', () => {
    it('multiple sequential saves keep id 0 for create', async () => {
      const wrapper = mountFormJoke({ mode: MODE_CREATE })
      await getSetupInput(wrapper).setValue('S1')
      await getPunchlineInput(wrapper).setValue('P1')
      await findButtonByText(wrapper, 'Save Joke').trigger('click')
      await getSetupInput(wrapper).setValue('S2')
      await getPunchlineInput(wrapper).setValue('P2')
      await findButtonByText(wrapper, 'Save Joke').trigger('click')
      expect(storeMock.addJoke).toHaveBeenCalledTimes(2)
      expect(storeMock.addJoke.mock.calls[0][0].id).toBe(0)
      expect(storeMock.addJoke.mock.calls[1][0].id).toBe(0)
    })
  })
})

// Store consistency
describe('Store mock consistency', () => {
  it('component and test share same store object', () => {
    const storeFromHook = useJokesStore()
    expect(storeFromHook).toBe(storeMock)
  })
})