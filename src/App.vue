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
    props: {
        explorableSites: {
            type: Array,
            default: () => [],
            required: true,
        },
    },
    created() {
        this.$store.dispatch('loadFolder')
        this.sites();
    },
    methods: {
        async sites() {
            const settings = await axios.get(
                generateUrl("/apps/news/settings")
            );
            console.log(settings.data);
            console.log(settings.data.settings.exploreUrl);

            const exploreUrl =
                settings.data.settings.exploreUrl + "feeds.en.json";
            const explore = await axios.get(exploreUrl);
            console.log(Object.keys(explore.data));

            Object.keys(explore.data).forEach((key) =>
                explore.data[key].forEach((value) =>
                    this.explorableSites.push(value)
                )
            );
        },
    }

}
</script>
