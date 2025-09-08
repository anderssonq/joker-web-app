/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AppDropdown from '@/components/molecules/AppDropdown.vue'

function mountDropdown(props: Record<string, any> = {}) {
  return mount(AppDropdown, {
    props: {
      title: 'Select a joke type',
      items: [],
      itemSelected: 'general',
      ...props
    },
    global: {
      stubs: {
        AppButton: {
          name: 'AppButton',
          props: {
            text: { type: String, default: '' },
            color: { type: String, default: 'purple' }
          },
            // keep a data attribute for assertions
          template: `<button class="app-button" :data-color="color">{{ text }}</button>`
        }
      }
    }
  })
}

describe('AppDropdown', () => {
  const defaultProps = {
    title: 'Select Type',
    items: ['general', 'programming', 'dad'],
    itemSelected: 'general'
  }

  it('renders with default props', async () => {
    const wrapper = mountDropdown()
    await flushPromises()
    expect(wrapper.classes()).toContain('dropdown')
    expect(wrapper.find('.dropdown-content').exists()).toBe(true)
  })

  it('renders with custom props', async () => {
    const wrapper = mountDropdown(defaultProps)
    await flushPromises()
    const button = wrapper.findComponent({ name: 'AppButton' })
    expect(button.props('text')).toBe('Select Type: general')
    expect(button.props('color')).toBe('purple')
  })

  it('displays correct button text with title and selected item', async () => {
    const wrapper = mountDropdown({
      title: 'Joke Category',
      itemSelected: 'programming',
      items: ['general', 'programming']
    })
    await flushPromises()
    expect(wrapper.findComponent({ name: 'AppButton' }).props('text'))
      .toBe('Joke Category: programming')
  })

  it('renders all dropdown items', async () => {
    const items = ['general', 'programming', 'dad', 'misc']
    const wrapper = mountDropdown({ ...defaultProps, items })
    await flushPromises()
    const dropdownItems = wrapper.findAll('.dropdown-content a')
    expect(dropdownItems).toHaveLength(4)
    items.forEach((item, i) => expect(dropdownItems[i].text()).toBe(item))
  })

  it('handles numeric items correctly', async () => {
    const wrapper = mountDropdown({
      title: 'Select Number',
      items: [1, 2, 3, 4, 5],
      itemSelected: 3
    })
    await flushPromises()
    expect(wrapper.findComponent({ name: 'AppButton' }).props('text'))
      .toBe('Select Number: 3')
    const dropdownItems = wrapper.findAll('.dropdown-content a')
    expect(dropdownItems).toHaveLength(5)
    expect(dropdownItems[2].text()).toBe('3')
  })

  it('emits handleSelect when item is clicked', async () => {
    const wrapper = mountDropdown(defaultProps)
    await flushPromises()
    const dropdownItems = wrapper.findAll('.dropdown-content a')
    await dropdownItems[1].trigger('click')
    expect(wrapper.emitted('handleSelect')?.[0]).toEqual(['programming'])
  })

  it('emits correct value for multiple clicks', async () => {
    const wrapper = mountDropdown(defaultProps)
    await flushPromises()
    const dropdownItems = wrapper.findAll('.dropdown-content a')
    await dropdownItems[0].trigger('click')
    await dropdownItems[2].trigger('click')
    expect(wrapper.emitted('handleSelect')?.[0]).toEqual(['general'])
    expect(wrapper.emitted('handleSelect')?.[1]).toEqual(['dad'])
  })

  it('handles empty items array', async () => {
    const wrapper = mountDropdown({
      title: 'Empty List',
      items: [],
      itemSelected: 'none'
    })
    await flushPromises()
    expect(wrapper.findAll('.dropdown-content a')).toHaveLength(0)
  })

  it('uses defaults when props omitted', async () => {
    const wrapper = mountDropdown()
    await flushPromises()
    const button = wrapper.findComponent({ name: 'AppButton' })
    expect(button.props('text')).toBe('Select a joke type: general')
    expect(wrapper.findAll('.dropdown-content a')).toHaveLength(0)
  })

  it('CSS structure intact', async () => {
    const wrapper = mountDropdown(defaultProps)
    await flushPromises()
    expect(wrapper.find('.dropdown').exists()).toBe(true)
    expect(wrapper.find('.dropdown-content').exists()).toBe(true)
    wrapper.findAll('.dropdown-content a')
      .forEach(a => expect(a.element.tagName).toBe('A'))
  })

  it('handles mixed type arrays', async () => {
    const wrapper = mountDropdown({
      title: 'Mixed Types',
      items: ['text', 123, 'more text'],
      itemSelected: 'text'
    })
    await flushPromises()
    const dropdownItems = wrapper.findAll('.dropdown-content a')
    expect(dropdownItems.map(i => i.text())).toEqual(['text', '123', 'more text'])
  })

  it('passes correct props to AppButton', async () => {
    const wrapper = mountDropdown(defaultProps)
    await flushPromises()
    const button = wrapper.findComponent({ name: 'AppButton' })
    expect(button.exists()).toBe(true)
    expect(button.props('color')).toBe('purple')
    expect(button.props('text')).toContain(defaultProps.title)
    expect(button.props('text')).toContain(defaultProps.itemSelected)
  })

  it('emits raw number for numeric items (no forced string conversion)', async () => {
    const wrapper = mountDropdown({
      title: 'Numbers',
      items: [1, 2, 3],
      itemSelected: 1
    })
    await flushPromises()
    const first = wrapper.findAll('.dropdown-content a')[0]
    await first.trigger('click')
    expect(wrapper.emitted('handleSelect')?.[0]).toEqual(['1'])
  })
})