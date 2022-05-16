import Vue from "vue";
import VueRouter from "vue-router";

import ExplorePanel from './views/Explore'
import StarredPanel from './views/Starred'

export const ROUTES = {
  EXPLORE: 'explore',
  STARRED: 'starred'
}

var getInitialRoute = function() {
  return ROUTES.EXPLORE
}

const routes = [
	// using
	// { path: '/collections/all', component: CollectionGeneral, alias: '/' },
	// instead of
	{ path: "/", redirect: getInitialRoute() },
	// would also be an option, but it currently does not work
	// reliably with router-link due to
	// https://github.com/vuejs/vue-router/issues/419
	{
		name: ROUTES.EXPLORE,
		path: "/explore",
		component: ExplorePanel,
		props: true
	},
  {
		name: ROUTES.STARRED,
		path: "/starred",
		component: StarredPanel,
		props: true
	},
];

Vue.use(VueRouter);

export default new VueRouter({
	linkActiveClass: "active",
	routes // short for `routes: routes`
});
