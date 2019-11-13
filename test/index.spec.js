import { shallowMount } from '@vue/test-utils'

import VueCroep from '../src/Index.vue'

/* eslint-disable */
describe('VueCroep', () => {
  test('is a Vue instance', () => {
    const wrapper = shallowMount(VueCroep)

    expect (wrapper.isVueInstance()).toBeTruthy()
  })
})
