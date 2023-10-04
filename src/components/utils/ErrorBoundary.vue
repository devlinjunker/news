<script>
import Vue from 'vue'

export default Vue.extend({
	props: {
		// eslint-disable-next-line vue/require-default-prop, vue/require-prop-types
		watch: {
			required: false,
		},
	},
	data: () => ({
		error: false,
	}),
	watch: {
		watch() {
			this.error = false
		},
	},
	errorCaptured(/* err, vm, info */) {
		this.error = true
		return false
	},
	render(h) {
		if (this.error) {
			return this.$slots?.error ? this.$slots?.error[0] : h('p', t('news', 'Something went wrong'))
		} else {
			return this.$slots.default[0]
		}
	},
})

</script>
