<template>
  <div id="explore">
    <div class="grid-container">
        <div
            v-for="entry in explorableSites"
            :key="entry.title"
            class="explore-feed grid-item"
        >
            <h2
                v-if="entry.favicon"
                class="explore-title"
                :style="{
                    backgroundImage: 'url(' + entry.favicon + ')',
                }"
            >
                <a
                    target="_blank"
                    rel="noreferrer"
                    :href="entry.url"
                    >{{ entry.title }}</a
                >
            </h2>
            <h2
                v-if="!entry.favicon"
                class="icon-rss explore-title"
            >
                {{ entry.title }}
            </h2>
            <div class="explore-content">
                <p>{{ entry.description }}</p>

                <div class="explore-logo">
                    <img :src="entry.image" />
                </div>
            </div>
            <button class="explore-subscribe" @click="subscribe">
                {{ t("news", "Subscribe to") }} {{ entry.title }}
            </button>
        </div>
    </div>
</div>
</template>

<script>
import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";


export default {
    components: {

    },
    props: {
        explorableSites: {
            type: Array,
            default: () => [],
        },
    },
    created() {
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
        async subscribe() {
            // TODO
        },
    },
};
</script>