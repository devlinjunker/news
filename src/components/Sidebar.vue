<template>
	<AppNavigation>
		<AppNavigationNew
			:text="t('news','Subscribe')"
			button-id="new-feed-button"
			button-class="icon-add" />

            <AppNavigationNewItem :title="t('news','New folder')"
                                  icon="icon-add-folder"
                                  @new-item="newFolder">
            </AppNavigationNewItem>

			<AppNavigationItem :title="t('news','Unread articles')" icon="icon-rss">
                <template #actions>
                    <ActionButton icon="icon-checkmark" @click="alert('Edit')">
                        t('news','Mark read')
                    </ActionButton>
                </template>
                <template #counter>
                    <CounterBubble>5</CounterBubble>
                </template>
			</AppNavigationItem>
			<AppNavigationItem :title="t('news','All articles')" icon="icon-rss">
                <template #actions>
                    <ActionButton icon="icon-checkmark" @click="alert('Edit')">
                        t('news','Mark read')
                    </ActionButton>
                </template>
                <template #counter>
                    <CounterBubble>12</CounterBubble>
                </template>
			</AppNavigationItem>
			<AppNavigationItem :title="t('news','Starred')" icon="icon-starred">
                <template #counter>
                    <CounterBubble>35</CounterBubble>
                </template>
			</AppNavigationItem>

            <!-- Folder... -->
            <div
                v-for="item in topLevelNav"
                :key="item.id"
            >
                <AppNavigationItem
                    :title="t('news', item.title || item.name)"
                    :icon="item.title !== undefined ? 'icon-rss' : 'icon-folder'"
                    :allowCollapse="item.title === undefined"
                >
                    <template v-if="item.title === undefined">
                        <AppNavigationItem 
                            v-for="feed in folderFeeds(item.id)"
                            :title="t('news', feed.title || feed.name)"
                            :key="feed.id"
                            :icon="feed.title !== undefined ? 'icon-rss' : 'icon-folder'"
                            />
                    </template>
                </AppNavigationItem>
            </div>
            <!--AppNavigationItem
                v-for="feed in topLevelNav"
                :key="feed.id"
                :title="t('news', feed.title)" 
                icon="icon-rss"
            >
            </!--AppNavigationItem>

            <AppNavigationItem--
                v-for="folder in folders"
                :key="folder.id"
                :title="t('news', folder.name)" 
                :allowCollapse="true"
                icon="icon-folder"
            >
                <template>
                    <AppNavigationItem title="AppNavigationItemChild1" />
                </template>
            </AppNavigationItem-->


            <AppNavigationItem :title="t('news','Explore')" icon="icon-link" @click="alert('Edit')">
                <template #counter>
                    <CounterBubble>35</CounterBubble>
                </template>
            </AppNavigationItem>
	</AppNavigation>
</template>

<script>
import Vuex  from 'vuex'
import AppNavigation from '@nextcloud/vue/dist/Components/AppNavigation'
import AppNavigationNew from '@nextcloud/vue/dist/Components/AppNavigationNew'
import AppNavigationItem from '@nextcloud/vue/dist/Components/AppNavigationItem'
import AppNavigationNewItem from '@nextcloud/vue/dist/Components/AppNavigationNewItem'
import AppNavigationCounter from '@nextcloud/vue/dist/Components/AppNavigationCounter'
import CounterBubble from '@nextcloud/vue/dist/Components/CounterBubble'
import ActionButton from '@nextcloud/vue/dist/Components/ActionButton'

import { ROUTES } from '../routes.js'
import { ACTIONS } from '../store/index.js'


export default {
	components: {
		AppNavigation,
		AppNavigationNew,
		AppNavigationItem,
		AppNavigationNewItem,
		AppNavigationCounter,
        CounterBubble,
        ActionButton
	},
    // props: {
	// 	feeds: {
	// 		type: Array,
	// 		required: false,
	// 	},
	// },
    data() {
        return {
            ROUTES,
        }
    },
    computed: {
        ... Vuex.mapState(['feeds', 'folders']),
        topLevelNav (state) {
            return state.feeds.filter((feed) => {
                return feed.folderId === undefined || feed.folderId === null;
            }).concat(state.folders)
        }
    },
    created() {
        this.$store.dispatch(ACTIONS.FETCH_FEEDS)
        this.$store.dispatch(ACTIONS.FETCH_FOLDERS)
    },
	methods: {
		newFolder(value) {
			alert(value)
		},
        folderFeeds(folderId) {
            return this.$store.state.feeds.filter((feed) => {
                return feed.folderId === folderId;
            })
        }
	},
}
</script>
