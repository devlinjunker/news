import { ActionParams } from '../store'
import { FEED_ITEM_MUTATION_TYPES, FEED_MUTATION_TYPES } from '../types/MutationTypes'

import { FeedItem } from '../types/FeedItem'
import { Feed } from '../types/Feed'
import { ItemService } from '../dataservices/item.service'
import { FEED_ACTION_TYPES } from './feed'

export const FEED_ITEM_ACTION_TYPES = {
	FETCH_STARRED: 'FETCH_STARRED',
	FETCH_UNREAD: 'FETCH_UNREAD',
	MARK_READ: 'MARK_READ',
	MARK_UNREAD: 'MARK_UNREAD',
	STAR_ITEM: 'STAR_ITEM',
	UNSTAR_ITEM: 'UNSTAR_ITEM',
	FETCH_FEED_ITEMS: 'FETCH_FEED_ITEMS',
	FETCH_FOLDER_FEED_ITEMS: 'FETCH_FOLDER_FEED_ITEMS',
	FETCH_ITEMS: 'FETCH_ITEMS',

	GO_NEXT_VISIBLE_ITEM: 'GO_NEXT_VISIBLE_ITEM',
	GO_PREVIOUS_VISIBLE_ITEM: 'GO_PREVIOUS_VISIBLE_ITEM',
}

export type ItemState = {
	fetchingItems: { [key: string]: boolean };
	allItemsLoaded: { [key: string]: boolean };
	lastItemLoaded: { [key: string]: number };

	starredCount: number;
	unreadCount: number;

	allItems: FeedItem[];

	selectedId?: string;
	playingItem?: FeedItem

	visibleItems: FeedItem[];
}

const state: ItemState = {
	fetchingItems: {},
	allItemsLoaded: {},
	lastItemLoaded: {},

	starredCount: 0,
	unreadCount: 0,

	allItems: [],

	selectedId: undefined,
	playingItem: undefined,

	visibleItems: [],
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
	allItems(state: ItemState) {
		return state.allItems
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
	async [FEED_ITEM_ACTION_TYPES.FETCH_UNREAD](
		{ commit }: ActionParams<ItemState>,
		{ start }: { start: number } = { start: 0 },
	) {
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
	 * Fetch All Items from Backend and call commit to update state
	 *
	 * @param param0 ActionParams
	 * @param param0.commit
	 * @param param1 ActionArgs
	 * @param param1.start
	 */
	async [FEED_ITEM_ACTION_TYPES.FETCH_ITEMS](
		{ commit }: ActionParams<ItemState>,
		{ start }: { start: number } = { start: 0 },
	) {
		commit(FEED_ITEM_MUTATION_TYPES.SET_FETCHING, { key: 'all', fetching: true })

		const response = await ItemService.debounceFetchAll(start || state.lastItemLoaded.all)

		commit(FEED_ITEM_MUTATION_TYPES.SET_ITEMS, response?.data.items)

		if (response?.data.items.length < 40) {
			commit(FEED_ITEM_MUTATION_TYPES.SET_ALL_LOADED, { key: 'all', loaded: true })
		}

		if (response?.data.items.length > 0) {
			const lastItem = response?.data.items[response?.data.items.length - 1].id
			commit(FEED_ITEM_MUTATION_TYPES.SET_LAST_ITEM_LOADED, { key: 'all', lastItem })
		}
		commit(FEED_ITEM_MUTATION_TYPES.SET_FETCHING, { key: 'all', fetching: false })
	},

	/**
	 * Fetch Starred Items from Backend and call commit to update state
	 *
	 * @param param0 ActionParams
	 * @param param0.commit
	 * @param param1 ActionArgs
	 * @param param1.start
	 */
	async [FEED_ITEM_ACTION_TYPES.FETCH_STARRED](
		{ commit }: ActionParams<ItemState>,
		{ start }: { start: number } = { start: 0 },
	) {
		commit(FEED_ITEM_MUTATION_TYPES.SET_FETCHING, { key: 'starred', fetching: true })
		const response = await ItemService.debounceFetchStarred(start || state.lastItemLoaded.starred)

		commit(FEED_ITEM_MUTATION_TYPES.SET_ITEMS, response?.data.items)
		if (response?.data.starred) {
			commit(FEED_ITEM_MUTATION_TYPES.SET_STARRED_COUNT, response?.data.starred)
		}

		if (response?.data.items.length < 40) {
			commit(FEED_ITEM_MUTATION_TYPES.SET_ALL_LOADED, { key: 'starred', loaded: true })
		}
		if (response?.data.items.length > 0) {
			const lastItem = response?.data.items[response?.data.items.length - 1].id
			commit(FEED_ITEM_MUTATION_TYPES.SET_LAST_ITEM_LOADED, { key: 'starred', lastItem })
		}
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
	async [FEED_ITEM_ACTION_TYPES.FETCH_FEED_ITEMS](
		{ commit }: ActionParams<ItemState>,
		{ feedId, start }: { feedId: number; start: number },
	) {
		commit(FEED_ITEM_MUTATION_TYPES.SET_FETCHING, { key: 'feed-' + feedId, fetching: true })
		const response = await ItemService.debounceFetchFeedItems(feedId, start || state.lastItemLoaded['feed-' + feedId])

		commit(FEED_ITEM_MUTATION_TYPES.SET_ITEMS, response?.data.items)
		if (response?.data.items.length < 40) {
			commit(FEED_ITEM_MUTATION_TYPES.SET_ALL_LOADED, { key: 'feed-' + feedId, loaded: true })
		}
		if (response?.data.items.length > 0) {
			const lastItem = response?.data.items[response?.data.items.length - 1].id
			commit(FEED_ITEM_MUTATION_TYPES.SET_LAST_ITEM_LOADED, { key: 'feed-' + feedId, lastItem })
		}
		commit(FEED_ITEM_MUTATION_TYPES.SET_FETCHING, { key: 'feed-' + feedId, fetching: false })
	},

	/**
	 * Fetch Folder Items from Backend and call commit to update state
	 *
	 * @param param0 ActionParams
	 * @param param0.commit
	 * @param param1 ActionArgs
	 * @param param1.start
	 * @param param1.folderId
	 */
	async [FEED_ITEM_ACTION_TYPES.FETCH_FOLDER_FEED_ITEMS](
		{ commit }: ActionParams<ItemState>,
		{ folderId, start }: { folderId: number; start: number },
	) {
		commit(FEED_ITEM_MUTATION_TYPES.SET_FETCHING, { key: 'folder-' + folderId, fetching: true })
		const response = await ItemService.debounceFetchFolderFeedItems(folderId, start || state.lastItemLoaded['folder-' + folderId])

		commit(FEED_ITEM_MUTATION_TYPES.SET_ITEMS, response?.data.items)
		if (response?.data.items.length < 40) {
			commit(FEED_ITEM_MUTATION_TYPES.SET_ALL_LOADED, { key: 'folder-' + folderId, loaded: true })
		}
		if (response?.data.items.length > 0) {
			const lastItem = response?.data.items[response?.data.items.length - 1].id
			commit(FEED_ITEM_MUTATION_TYPES.SET_LAST_ITEM_LOADED, { key: 'folder-' + folderId, lastItem })
		}
		commit(FEED_ITEM_MUTATION_TYPES.SET_FETCHING, { key: 'folder-' + folderId, fetching: false })
	},

	/**
	 * Sends message to Backend to mark as read, and then call commit to update state
	 *
	 * @param param0 ActionParams
	 * @param param0.commit
	 * @param param0.dispatch
	 * @param param1 ActionArgs
	 * @param param1.item
	 */
	[FEED_ITEM_ACTION_TYPES.MARK_READ](
		{ commit, dispatch }: ActionParams<ItemState>,
		{ item }: { item: FeedItem },
	) {
		ItemService.markRead(item, true)

		if (item.unread) {
			commit(FEED_ITEM_MUTATION_TYPES.SET_UNREAD_COUNT, state.unreadCount - 1)

			dispatch(FEED_ACTION_TYPES.MODIFY_FEED_UNREAD_COUNT, { feedId: item.feedId, delta: -1 })
		}
		item.unread = false
		commit(FEED_ITEM_MUTATION_TYPES.UPDATE_ITEM, { item })
	},

	/**
	 * Sends message to Backend to mark as unread, and then call commit to update state
	 *
	 * @param param0 ActionParams
	 * @param param0.commit
	 * @param param0.dispatch
	 * @param param1 ActionArgs
	 * @param param1.item
	 */
	[FEED_ITEM_ACTION_TYPES.MARK_UNREAD](
		{ commit, dispatch }: ActionParams<ItemState>,
		{ item }: { item: FeedItem},
	) {
		ItemService.markRead(item, false)

		if (!item.unread) {
			commit(FEED_ITEM_MUTATION_TYPES.SET_UNREAD_COUNT, state.unreadCount + 1)

			dispatch(FEED_MUTATION_TYPES.MODIFY_FEED_UNREAD_COUNT, { feedId: item.feedId, delta: +1 })
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
	[FEED_ITEM_ACTION_TYPES.STAR_ITEM](
		{ commit }: ActionParams<ItemState>,
		{ item }: { item: FeedItem},
	) {
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
	[FEED_ITEM_ACTION_TYPES.UNSTAR_ITEM](
		{ commit }: ActionParams<ItemState>,
		{ item }: { item: FeedItem},
	) {
		ItemService.markStarred(item, false)

		item.starred = false
		commit(FEED_ITEM_MUTATION_TYPES.UPDATE_ITEM, { item })
		commit(FEED_ITEM_MUTATION_TYPES.SET_STARRED_COUNT, state.starredCount - 1)
	},

	[FEED_ITEM_ACTION_TYPES.GO_NEXT_VISIBLE_ITEM]({ commit, state }: ActionParams<ItemState>) {
		const selectedIdx = state.visibleItems.findIndex((item) => { return item.id === state.selectedId })
		commit(FEED_ITEM_MUTATION_TYPES.SET_SELECTED_ITEM, { id: state.visibleItems[selectedIdx + 1].id })
		commit(FEED_ITEM_ACTION_TYPES.MARK_READ, { item: state.visibleItems[selectedIdx - 1] })
	},

	[FEED_ITEM_ACTION_TYPES.GO_PREVIOUS_VISIBLE_ITEM]({ commit, state }: ActionParams<ItemState>) {
		const selectedIdx = state.visibleItems.findIndex((item) => { return item.id === state.selectedId })
		commit(FEED_ITEM_MUTATION_TYPES.SET_SELECTED_ITEM, { id: state.visibleItems[selectedIdx - 1].id })
		commit(FEED_ITEM_ACTION_TYPES.MARK_READ, { item: state.visibleItems[selectedIdx - 1] })
	},
}

export const mutations = {
	[FEED_ITEM_MUTATION_TYPES.SET_SELECTED_ITEM](
		state: ItemState,
		{ id }: { id: string },
	) {
		state.selectedId = id
	},

	[FEED_ITEM_MUTATION_TYPES.SET_PLAYING_ITEM](
		state: ItemState,
		item?: FeedItem,
	) {
		state.playingItem = item
	},

	[FEED_ITEM_MUTATION_TYPES.SET_ITEMS](
		state: ItemState,
		items: FeedItem[],
	) {
		if (items) {
			items.forEach(it => {
				if (state.allItems.find((existing: FeedItem) => existing.id === it.id) === undefined) {
					state.allItems.push(it)
				}
			})
		}
	},

	[FEED_ITEM_MUTATION_TYPES.SET_STARRED_COUNT](
		state: ItemState,
		count: number,
	) {
		state.starredCount = count
	},

	[FEED_ITEM_MUTATION_TYPES.SET_UNREAD_COUNT](
		state: ItemState,
		count: number,
	) {
		state.unreadCount = count
	},

	[FEED_ITEM_MUTATION_TYPES.UPDATE_ITEM](
		state: ItemState,
		{ item }: { item: FeedItem },
	) {
		const idx = state.allItems.findIndex((it) => it.id === item.id)
		state.allItems.splice(idx, 1, item)
	},

	[FEED_ITEM_MUTATION_TYPES.SET_FETCHING](
		state: ItemState,
		{ fetching, key }: { fetching: boolean; key: string; },
	) {
		state.fetchingItems[key] = fetching
	},

	[FEED_ITEM_MUTATION_TYPES.SET_ALL_LOADED](
		state: ItemState,
		{ loaded, key }: { loaded: boolean; key: string; },
	) {
		state.allItemsLoaded[key] = loaded
	},

	[FEED_ITEM_MUTATION_TYPES.SET_LAST_ITEM_LOADED](
		state: ItemState,
		{ lastItem, key }: { lastItem: number; key: string; },
	) {
		state.lastItemLoaded[key] = lastItem
	},

	[FEED_MUTATION_TYPES.SET_FEED_ALL_READ](
		state: ItemState,
		feed: Feed,
	) {
		state.allItems.forEach((item: FeedItem) => {
			if (item.feedId === feed.id) {
				item.unread = false
			}
		})
	},

	[FEED_ITEM_MUTATION_TYPES.SET_VISIBLE_ITEMS](
		state: ItemState,
		items: FeedItem[],
	) {
		state.visibleItems = items
	},
}

export default {
	state,
	getters,
	actions,
	mutations,
}
