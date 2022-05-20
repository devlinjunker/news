<template>
<div id="starred">
    
</div>
</template>

<script>

import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";

export default {
    components: {

    },
    props: {
       
    },
    created() {
        this.fetchStarred();
    },
    methods: {
        async fetchStarred() {
            const starred = await axios.get(
                generateUrl("/apps/news/api/temp/starred")
            );
            // TODO: stuff with starred results
            console.log(starred);
        },
    },
};
</script>