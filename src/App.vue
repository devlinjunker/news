<template>
	<Content app-name="news">
		<Sidebar />
        <AppContent>
            <div id="explore">
                <div class="grid-container">
                    <div v-for="entry in explorableSites" class="explore-feed grid-item" >
                        <h2 class="explore-title" v-if="entry.favicon"
                            :style="{ backgroundImage: 'url(' + entry.favicon + ')'}">
                            <a target="_blank" rel="noreferrer" :href="entry.url">{{ entry.title }}</a>
                        </h2>
                        <h2 class="icon-rss explore-title" v-if="!entry.favicon">
                            {{ entry.title }}
                        </h2>
                        <div class="explore-content">
                            <p>{{ entry.description }}</p>

                            <div class="explore-logo">
                                <img :src="entry.image" >
                            </div>
                        </div>
                        <button class="explore-subscribe" @click="subscribe">
                            {{t('news', 'Subscribe to')}} {{ entry.title }}
                        </button>
                    </div>
                </div>
            </div>
        </AppContent>
	</Content>
</template>

<script>
import Content from '@nextcloud/vue/dist/Components/Content'
import AppContent from '@nextcloud/vue/dist/Components/AppContent'
import Sidebar from './components/Sidebar.vue'
import axios from '@nextcloud/axios'

export default {
	components: {
		Content,
		Sidebar,
        AppContent
	},
    props: {
        explorableSites: {
            type: Array,
            default: () => [],
            required: true,
        },
    },
    methods: {
        async sites() {
            const settings = await axios.get("/index.php/apps/news/settings");
            console.log(settings.data);
            console.log(settings.data.settings.exploreUrl);

            const exploreUrl = settings.data.settings.exploreUrl + 'feeds.en.json';
            const explore = await axios.get(exploreUrl);
            console.log(Object.keys(explore.data));

            Object.keys(explore.data).forEach(key =>
                explore.data[key].forEach(value =>
                    this.explorableSites.push(value)
                )
            );
        },
        async subscribe() {
            // TODO
        }
    },
    created() {
        this.sites();
    }
}
</script>
<style>

.grid-container {
    display: grid;
}
</style>
