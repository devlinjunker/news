<template>
	<AppNavigation>
		<AppNavigationNew
			:text="t('news','Subscribe')"
			button-id="new-feed-button"
			button-class="icon-add" />
		<ul id="locations" class="with-icon">

            <AppNavigationNewItem :title="t('news','New folder')"
                                  icon="icon-add-folder"
                                  @new-item="alert">
            </AppNavigationNewItem>

			<AppNavigationItem :title="t('news','Unread articles')" icon="icon-rss" @click="alert('Unread')">
                <template #actions>
                    <ActionButton icon="icon-checkmark" @click="alert('Mark Read')">
                        t('news','Mark read')
                    </ActionButton>
                </template>
                <template #counter>
                    <CounterBubble>5</CounterBubble>
                </template>
			</AppNavigationItem>
			<AppNavigationItem :title="t('news','All articles')" icon="icon-rss" @click="alert('All')">
                <template #actions>
                    <ActionButton icon="icon-checkmark" @click="alert('Mark Read')">
                        t('news','Mark read')
                    </ActionButton>
                </template>
                <template #counter>
                    <CounterBubble>12</CounterBubble>
                </template>
			</AppNavigationItem>
			<AppNavigationItem :title="t('news','Starred')" :to="{ name: ROUTES.STARRED }" icon="icon-starred" >
                <template #counter>
                    <CounterBubble>35</CounterBubble>
                </template>
			</AppNavigationItem>

            <!-- Ordner... -->

            <AppNavigationItem :title="t('news','Explore')" :to="{ name: ROUTES.EXPLORE }"  icon="icon-link">
                <template #counter>
                    <CounterBubble>35</CounterBubble>
                </template>
            </AppNavigationItem>
		</ul>
	</AppNavigation>
</template>

<script>
import AppNavigation from '@nextcloud/vue/dist/Components/AppNavigation'
import AppNavigationNew from '@nextcloud/vue/dist/Components/AppNavigationNew'
import AppNavigationItem from '@nextcloud/vue/dist/Components/AppNavigationItem'
import AppNavigationNewItem from '@nextcloud/vue/dist/Components/AppNavigationNewItem'
import AppNavigationCounter from '@nextcloud/vue/dist/Components/AppNavigationCounter'
import CounterBubble from '@nextcloud/vue/dist/Components/CounterBubble'
import ActionButton from '@nextcloud/vue/dist/Components/ActionButton'

import { ROUTES } from '../routes.js'


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
    data() {
        return {
            ROUTES
        }
    },
	methods: {
		alert(value) {
			window.alert(value)
		},
	},
}
</script>
