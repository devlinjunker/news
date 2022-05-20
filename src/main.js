import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'

import router from './routes.js'
import store from './store/index.js'

Vue.prototype.t = t
Vue.prototype.n = n
Vue.prototype.OC = OC
Vue.prototype.OCA = OCA

Vue.use(Vuex)

export default new Vue({
	el: '#content',
	store: new Vuex.Store(store),
	router,
	render: h => h(App),
})
