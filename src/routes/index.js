import Vue from 'vue'
import VueRouter from 'vue-router'

import ExplorePanel from '../components/Explore'
import StarredPanel from '../components/Starred'

export const ROUTES = {
	EXPLORE: 'explore',
	STARRED: 'starred',
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
]

Vue.use(VueRouter)

export default new VueRouter({
	linkActiveClass: 'active',
	routes, // short for `routes: routes`
})
