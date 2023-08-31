import { ActionParams } from '../store'
import { FEED_ITEM_MUTATION_TYPES } from '../types/MutationTypes'

import { FeedItem } from '../types/FeedItem'
import { ItemService } from '../dataservices/item.service'

export const FEED_ITEM_ACTION_TYPES = {
	FETCH_STARRED: 'FETCH_STARRED',
	FETCH_UNREAD: 'FETCH_UNREAD',
	MARK_READ: 'MARK_READ',
	MARK_UNREAD: 'MARK_UNREAD',
	STAR_ITEM: 'STAR_ITEM',
	UNSTAR_ITEM: 'UNSTAR_ITEM',
	FETCH_FEED_ITEMS: 'FETCH_FEED_ITEMS',
}

export type ItemState = {
	fetchingItems: { [key: string]: boolean };
	allItemsLoaded: { [key: string]: boolean };
	lastItemLoaded: { [key: string]: number };

	starredCount: number;
	unreadCount: number;

	allItems: FeedItem[];

	selectedId?: string;
}

const state: ItemState = {
	fetchingItems: {},
	allItemsLoaded: {},
	lastItemLoaded: {},

	starredCount: 0,
	unreadCount: 0,

	allItems: [],
	selectedId: undefined,
}

const getters = {
	starred(state: ItemState) {
		return state.allItems.filter((item) => item.starred)
	},
	unread(state: ItemState) {
		return state.allItems.filter((item) => item.unread)
	},
	selected(state: ItemState) {
		return state.allItems.find((item: FeedItem) => item.id === state.selectedId)
	},
}

export const actions = {
	/**
	 * Fetch Unread Items from Backend and call commit to update state
	 *
	 * @param param0 ActionParams
	 * @param param0.commit
	 * @param param1 ActionArgs
	 * @param param1.start
	 */
	async [FEED_ITEM_ACTION_TYPES.FETCH_UNREAD]({ commit }: ActionParams, { start }: { start: number } = { start: 0 }) {
		commit(FEED_ITEM_MUTATION_TYPES.SET_FETCHING, { key: 'unread', fetching: true })

		const response = await ItemService.debounceFetchUnread(start || state.lastItemLoaded.unread)

		commit(FEED_ITEM_MUTATION_TYPES.SET_ITEMS, response?.data.items)

		if (response?.data.items.length < 40) {
			commit(FEED_ITEM_MUTATION_TYPES.SET_ALL_LOADED, { key: 'unread', loaded: true })
		}

		const lastItem = response?.data.items[response?.data.items.length - 1].id
		commit(FEED_ITEM_MUTATION_TYPES.SET_LAST_ITEM_LOADED, { key: 'unread', lastItem })
		commit(FEED_ITEM_MUTATION_TYPES.SET_FETCHING, { key: 'unread', fetching: false })
	},

	/**
	 * Fetch Starred Items from Backend and call commit to update state
	 *
	 * @param param0 ActionParams
	 * @param param0.commit
	 * @param param1 ActionArgs
	 * @param param1.start
	 */
	async [FEED_ITEM_ACTION_TYPES.FETCH_STARRED]({ commit }: ActionParams, { start }: { start: number } = { start: 0 }) {
		commit(FEED_ITEM_MUTATION_TYPES.SET_FETCHING, { key: 'starred', fetching: true })
		const response = await ItemService.debounceFetchStarred(start || state.lastItemLoaded.starred)

		commit(FEED_ITEM_MUTATION_TYPES.SET_ITEMS, response?.data.items)
		if (response?.data.starred) {
			commit(FEED_ITEM_MUTATION_TYPES.SET_STARRED_COUNT, response?.data.starred)
		}

		if (response?.data.items.length < 40) {
			commit(FEED_ITEM_MUTATION_TYPES.SET_ALL_LOADED, { key: 'starred', loaded: true })
		}
		const lastItem = response?.data.items[response?.data.items.length - 1].id
		commit(FEED_ITEM_MUTATION_TYPES.SET_LAST_ITEM_LOADED, { key: 'starred', lastItem })
		commit(FEED_ITEM_MUTATION_TYPES.SET_FETCHING, { key: 'starred', fetching: false })
	},

	/**
	 * Fetch All Feed Items from Backend and call commit to update state
	 *
	 * @param param0 ActionParams
	 * @param param0.commit
	 * @param param1 ActionArgs
	 * @param param1.start
	 * @param param1.feedId
	 */
	async [FEED_ITEM_ACTION_TYPES.FETCH_FEED_ITEMS]({ commit }: ActionParams, { feedId, start }: { feedId: number; start: number }) {
		commit(FEED_ITEM_MUTATION_TYPES.SET_FETCHING, { key: 'feed-' + feedId, fetching: true })
		const response = await ItemService.debounceFetchFeedItems(feedId, start || state.lastItemLoaded['feed-' + feedId])

		commit(FEED_ITEM_MUTATION_TYPES.SET_ITEMS, response?.data.items)
		if (response?.data.items.length < 40) {
			commit(FEED_ITEM_MUTATION_TYPES.SET_ALL_LOADED, { key: 'feed-' + feedId, loaded: true })
		}
		const lastItem = response?.data.items[response?.data.items.length - 1].id
		commit(FEED_ITEM_MUTATION_TYPES.SET_LAST_ITEM_LOADED, { key: 'feed-' + feedId, lastItem })
		commit(FEED_ITEM_MUTATION_TYPES.SET_FETCHING, { key: 'feed-' + feedId, fetching: false })
	},

	/**
	 * Sends message to Backend to mark as read, and then call commit to update state
	 *
	 * @param param0 ActionParams
	 * @param param0.commit
	 * @param param1 ActionArgs
	 * @param param1.item
	 */
	[FEED_ITEM_ACTION_TYPES.MARK_READ]({ commit }: ActionParams, { item }: { item: FeedItem }) {
		ItemService.markRead(item, true)

		if (item.unread) {
			commit(FEED_ITEM_MUTATION_TYPES.SET_UNREAD_COUNT, state.unreadCount - 1)
		}
		item.unread = false
		commit(FEED_ITEM_MUTATION_TYPES.UPDATE_ITEM, { item })
	},

	/**
	 * Sends message to Backend to mark as unread, and then call commit to update state
	 *
	 * @param param0 ActionParams
	 * @param param0.commit
	 * @param param1 ActionArgs
	 * @param param1.item
	 */
	[FEED_ITEM_ACTION_TYPES.MARK_UNREAD]({ commit }: ActionParams, { item }: { item: FeedItem}) {
		ItemService.markRead(item, false)

		if (!item.unread) {
			commit(FEED_ITEM_MUTATION_TYPES.SET_UNREAD_COUNT, state.unreadCount + 1)
		}
		item.unread = true
		commit(FEED_ITEM_MUTATION_TYPES.UPDATE_ITEM, { item })
	},

	/**
	 * Sends message to Backend to mark as starred, and then call commit to update state
	 *
	 * @param param0 ActionParams
	 * @param param0.commit
	 * @param param1 ActionArgs
	 * @param param1.item
	 */
	[FEED_ITEM_ACTION_TYPES.STAR_ITEM]({ commit }: ActionParams, { item }: { item: FeedItem}) {
		ItemService.markStarred(item, true)

		item.starred = true
		commit(FEED_ITEM_MUTATION_TYPES.UPDATE_ITEM, { item })
		commit(FEED_ITEM_MUTATION_TYPES.SET_STARRED_COUNT, state.starredCount + 1)
	},

	/**
	 * Sends message to Backend to remove mark as starred, and then call commit to update state
	 *
	 * @param param0 ActionParams
	 * @param param0.commit
	 * @param param1 ActionArgs
	 * @param param1.item
	 */
	[FEED_ITEM_ACTION_TYPES.UNSTAR_ITEM]({ commit }: ActionParams, { item }: { item: FeedItem}) {
		ItemService.markStarred(item, false)

		item.starred = false
		commit(FEED_ITEM_MUTATION_TYPES.UPDATE_ITEM, { item })
		commit(FEED_ITEM_MUTATION_TYPES.SET_STARRED_COUNT, state.starredCount - 1)
	},
}

export const mutations = {
	[FEED_ITEM_MUTATION_TYPES.SET_SELECTED_ITEM](state: ItemState, { id }: { id: string }) {
		state.selectedId = id
	},
	[FEED_ITEM_MUTATION_TYPES.SET_ITEMS](state: ItemState, items: FeedItem[]) {
		if (items) {
			items.forEach(it => {
				if (state.allItems.find((existing: FeedItem) => existing.id === it.id) === undefined) {
					state.allItems.push(it)
				}
			})
		}
	},
	[FEED_ITEM_MUTATION_TYPES.SET_STARRED_COUNT](state: ItemState, count: number) {
		state.starredCount = count
	},
	[FEED_ITEM_MUTATION_TYPES.SET_UNREAD_COUNT](state: ItemState, count: number) {
		state.unreadCount = count
	},
	[FEED_ITEM_MUTATION_TYPES.UPDATE_ITEM](state: ItemState, { item }: { item: FeedItem }) {
		const idx = state.allItems.findIndex((it) => it.id === item.id)
		state.allItems.splice(idx, 1, item)
	},
	[FEED_ITEM_MUTATION_TYPES.SET_FETCHING](state: ItemState, { fetching, key }: { fetching: boolean; key: string; }) {
		state.fetchingItems[key] = fetching
	},
	[FEED_ITEM_MUTATION_TYPES.SET_ALL_LOADED](state: ItemState, { loaded, key }: { loaded: boolean; key: string; }) {
		state.allItemsLoaded[key] = loaded
	},
	[FEED_ITEM_MUTATION_TYPES.SET_LAST_ITEM_LOADED](state: ItemState, { lastItem, key }: { lastItem: number; key: string; }) {
		state.lastItemLoaded[key] = lastItem
	},
}

export default {
	state,
	getters,
	actions,
	mutations,
}
