import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex, { Store } from 'vuex'
import axios from '@nextcloud/axios'

import App from './App.vue'
import router, { ROUTES } from './routes'
import mainStore, { ACTIONS, MUTATIONS } from './store'

import { Tooltip } from '@nextcloud/vue'

Vue.prototype.t = t
Vue.prototype.n = n
Vue.prototype.OC = OC
Vue.prototype.OCA = OCA

Vue.use(Vuex)
Vue.use(VueRouter)

Vue.directive('tooltip', Tooltip)

const store = new Store(mainStore)

/**
 * Handles errors returned during application runtime
 *
 * @param {Error} error Error thrown
 * @return Promise<Error>
 */
const handleErrors = function(error) {
	store.commit(MUTATIONS.SET_ERROR, error)
	return Promise.reject(error)
}

axios.interceptors.response.use(undefined /* onSuccessCallback is intentionally undefined (triggers on 2xx responses) */,
	// Any status codes that falls outside the range of 2xx cause this function to trigger
	handleErrors,
)

Vue.config.errorHandler = handleErrors
export default new Vue({
	router,
	store,
	el: '#content',
	render: (h) => h(App),
})

// Make store accessible for setting cron warning (also for plugins in the future)
window.store = store

const handleKeyboard = function(keyCode) {
	switch (keyCode) {
	case 'KeyJ':
	case 'KeyN':
	case 'ArrowRight':
		store.dispatch(ACTIONS.GO_NEXT_VISIBLE_ITEM)
		break
	case 'KeyP':
	case 'KeyK':
	case 'ArrowLeft':
		store.dispatch(ACTIONS.GO_PREVIOUS_VISIBLE_ITEM)
		break
	case 'KeyS':
	case 'KeyL':
		store.dispatch(store.getters.selected.starred ? ACTIONS.UNSTAR_ITEM : ACTIONS.STAR_ITEM, { item: store.getters.selected })
		break
	case 'KeyH':
		store.dispatch(ACTIONS.STAR_ITEM, { item: store.getters.selected })
		store.dispatch(ACTIONS.GO_NEXT_VISIBLE_ITEM)
		break
	case 'KeyU':
		store.dispatch(ACTIONS.MARK_UNREAD, { item: store.getters.selected })
		break
	case 'KeyO':
		window.open(store.getters.selected.url, '_blank')
		break
	case 'KeyE':
		store.commit(MUTATIONS.SET_SELECTED_ITEM, { id: undefined })
		break
	case 'KeyR':
		location.reload()
		break
	case 'KeyF':
		// eslint-disable-next-line no-case-declarations
		let feedId
		if (router.currentRoute.params?.folderId) {
			feedId = store.getters.feeds.filter((feed) => { return feed.folderId.toString() === router.currentRoute.params?.folderId })[0].id
		} else if (router.currentRoute.params?.feedId) {
			// eslint-disable-next-line no-case-declarations
			const currentFeed = store.getters.feeds.find((feed) => { return feed.id.toString() === router.currentRoute.params?.feedId })
			let feeds = store.getters.feeds

			if (currentFeed.folderId) {
				feeds = store.getters.feeds.filter((feed) => { return feed.folderId === currentFeed.folderId })
			}
			const idx = feeds.findIndex((feed) => { return feed.id.toString() === router.currentRoute.params?.feedId })
			feedId = feeds[idx + 1].id
		} else {
			feedId = store.getters.feeds[0].id
		}

		router.push({ name: ROUTES.FEED, params: { feedId: feedId.toString() } })
		break
	case 'KeyD':
		// TODO: Load previous feed
		break
	case 'KeyC':
		// TODO: Load previous folder
		break
	case 'KeyV':
		// TODO: Load next folder
		break
	case 'KeyA':
		// TODO: Scroll to active navigation entry
		break
	case 'ShiftKeyA':
		// TODO: Mark all read in current page
		break
	}
}

window.addEventListener('keydown', (ev) => {
	handleKeyboard((ev.shiftKey ? 'Shift' : '') + ev.code)
})
