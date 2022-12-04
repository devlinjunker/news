import { shallowMount, createLocalVue, Wrapper, mount } from '@vue/test-utils'

import AddFeed from '../../../../src/components/AddFeed.vue'

describe('AddFeed.vue', () => {
	'use strict'

	it('should initialize without showing createNewFolder', () => {
		const localVue = createLocalVue()
		const wrapper = shallowMount(AddFeed, {
			localVue,
			mocks: {
				$store: {
					state: {
						folders: [],
					},
				},
			},
		})

		expect(wrapper.vm.$data.createNewFolder).toBeFalsy()
	})

	describe('AddFeed Template', () => {
		let template: Wrapper<AddFeed>

		beforeAll(() => {
			template = mount(AddFeed, {
			})
		})

		it('should always show cron switch', () => {
			// TODO expect(template.find('#cron-switch').exists()).toBeTruthy()
		})
	})
})
