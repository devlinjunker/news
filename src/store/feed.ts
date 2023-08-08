import axios from '@nextcloud/axios'

import { ActionParams, AppState } from '../store'
import { Feed } from '../types/Feed'
import { API_ROUTES } from '../types/ApiRoutes'
import { FOLDER_MUTATION_TYPES, FEED_MUTATION_TYPES } from '../types/MutationTypes'

export const FEED_ACTION_TYPES = {
	ADD_FEED: 'ADD_FEED',
	FETCH_FEEDS: 'FETCH_FEEDS',
}

const state = {
	feeds: [],
}

const getters = {
	feeds(state: AppState) {
		return state.feeds
	},
}

export const actions = {
	async [FEED_ACTION_TYPES.FETCH_FEEDS]({ commit }: ActionParams) {
		const feeds = await axios.get(API_ROUTES.FEED)

		commit(FEED_MUTATION_TYPES.SET_FEEDS, feeds.data.feeds)
	},
	async [FEED_ACTION_TYPES.ADD_FEED](
		{ commit }: ActionParams,
		{ feedReq }: { 
			feedReq: { 
				url: string; 
				folder?: { id: number; name?: string; }, 
				user?: string; 
				password?: string; 
			} 
		}
	) {
		let url = feedReq.url.trim()
		if (!url.startsWith('http')) {
			url = 'https://' + url
		}

		let folderId;
		if (feedReq.folder?.id === undefined && feedReq.folder?.name && feedReq.folder?.name !== '') {
			const response = await axios.post(API_ROUTES.FOLDER, { folderName: feedReq.folder?.name })
			folderId = response.data.folders[0].id;
			commit(FOLDER_MUTATION_TYPES.SET_FOLDERS, response.data.folders);
		} else {
			folderId = feedReq.folder?.id || 0
		}

		const feed: Feed = {
			url,
			folderId,
			title: undefined, // TODO: let user define feed title on create?
			unreadCount: 0,
			autoDiscover: undefined, // TODO: autodiscover?
		}

		// Check that url is resolvable
		try {
			const response = await axios.post(API_ROUTES.FEED, {
				url: feed.url,
				parentFolderId: feed.folderId,
				title: null,
				user: feedReq.user ? feedReq.user : null,
				password: feedReq.password ? feedReq.password : null,
				fullDiscover: feed.autoDiscover,
			})

			commit(FEED_MUTATION_TYPES.ADD_FEED, response.data.feeds[0])
		} catch (e) {
			// TODO: show error to user if failure
			console.log(e)

		}
	},
}

export const mutations = {
	[FEED_MUTATION_TYPES.SET_FEEDS](state: AppState, feeds: Feed[]) {
		feeds.forEach(it => {
			state.feeds.push(it)
		})
	},
	[FEED_MUTATION_TYPES.ADD_FEED](state: AppState, feed: Feed) {
		state.feeds.push(feed)
	},
}

export default {
	state,
	getters,
	actions,
	mutations,
}
