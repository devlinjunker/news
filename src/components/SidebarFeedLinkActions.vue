<template>
	<span>
		<NcActionButton icon="icon-checkmark"
			@click="alert('TODO: Mark read')">
			{{ t("news", "Mark read") }}
		</NcActionButton>
		<NcActionButton icon="icon-pinned"
			@click="alert('TODO: Unpin from top')">
			{{ t("news", "Unpin from top") }}
		</NcActionButton>
		<NcActionButton icon="icon-caret-dark"
			@click="alert('TODO: Newest First')">
			{{ t("news", "Newest first") }}
		</NcActionButton>
		<NcActionButton icon="icon-caret-dark"
			@click="alert('TODO: Oldest first')">
			{{ t("news", "Oldest first") }}
		</NcActionButton>
		<NcActionButton icon="icon-caret-dark"
			@click="alert('TODO: Default Order')">
			{{ t("news", "Default order") }}
		</NcActionButton>
		<NcActionButton icon="icon-full-text-disabled"
			@click="alert('TODO: Enable Full Text')">
			{{ t("news", "Enable full text") }}
		</NcActionButton>
		<NcActionButton icon="icon-full-text-enabled"
			@click="alert('TODO: DIsable Full Text')">
			{{ t("news", "Disable full text") }}
		</NcActionButton>
		<NcActionButton icon="icon-updatemode-default"
			@click="alert('TODO: Unread Updated')">
			{{ t("news", "Unread updated") }}
		</NcActionButton>
		<NcActionButton icon="icon-updatemode-unread"
			@click="alert('TOODO: Ignore UPdated')">
			{{ t("news", "Ignore updated") }}
		</NcActionButton>
		<NcActionButton icon="icon-icon-rss"
			@click="alert('TODO: Open Feed URL')">
			{{ t("news", "Open feed URL") }}
		</NcActionButton>
		<NcActionButton icon="icon-icon-rename"
			@click="alert('TODO: Rename')">
			{{ t("news", "Rename") }}
		</NcActionButton>
		<NcActionButton icon="icon-delete"
			@click="alert('TODO: Delete Feed')">
			{{ t("news", "Delete") }}
		</NcActionButton>
	</span>
</template>

<script lang="ts">

import { mapState } from 'vuex'
import Vue from 'vue'

import NcActionButton from '@nextcloud/vue/dist/Components/NcActionButton.js'

// import { ACTIONS, AppState } from '../store'

// import { Feed } from '../types/Feed'

// TODO?
const SidebarFeedLinkState = { }

export default Vue.extend({
	components: {
		NcActionButton,
	},
	props: {
		feed: {},
	},
	data: () => {
		return {
			// TODO?
		}
	},

	computed: {
		...mapState(SidebarFeedLinkState),
	},
	created() {
		// TODO: init?
	},
	methods: {
		alert(msg: string) {
			window.alert(msg)
		},
	},
})

</script>
