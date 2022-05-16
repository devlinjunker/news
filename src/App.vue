<template>
    <Content app-name="news">
        <Sidebar />
        <AppContent>
            <RouterView />
        </AppContent>
    </Content>
</template>

<script>
import Content from '@nextcloud/vue/dist/Components/Content'
import AppContent from '@nextcloud/vue/dist/Components/AppContent'
import Sidebar from './components/Sidebar.vue'

export default {
	components: {
		Content,
		Sidebar,
        AppContent,
    },
    methods: {
        async subscribe() {
            // TODO
        },
    },
};
</script>
