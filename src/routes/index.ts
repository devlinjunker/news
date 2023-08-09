import VueRouter from 'vue-router'

import ExplorePanel from '../components/Explore.vue'
import StarredPanel from '../components/Starred.vue'

export const ROUTES = {
	EXPLORE: 'explore',
	STARRED: 'starred',
	FEED_VIEW: 'feed',
	FOLDER_VIEW: 'folder',
}

const getInitialRoute = function() {
	// TODO: Fetch Recent route from Browser Session?
	return ROUTES.EXPLORE
}

const routes = [
	// using
	// { path: '/collections/all', component: CollectionGeneral, alias: '/' },
	// instead of
	{ path: '/', redirect: getInitialRoute() },
	// would also be an option, but it currently does not work
	// reliably with router-link due to
	// https://github.com/vuejs/vue-router/issues/419
	{
		name: ROUTES.EXPLORE,
		path: '/explore',
		component: ExplorePanel,
		props: true,
	},
	{
		name: ROUTES.STARRED,
		path: '/starred',
		component: StarredPanel,
		props: true,
	},
	{
		name: ROUTES.FEED_VIEW,
		path: '/feed',
		// component: FeedViewPanel,
		props: true,
	},
]

export default new VueRouter({
	linkActiveClass: 'active',
	routes, // short for `routes: routes`
})
