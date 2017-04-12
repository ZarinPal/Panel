<template lang="pug">
    div(v-if="$store.state.app.isLoaded")
        navbar

        div.zp-container.row
            sidebar

            div.col-xs.main-content
                router-view
        div.clear-both
    div(v-else)
        h1 this is a beautiful loading

</template>


<script>
export default {
    name: 'panel',
    components:{
        navbar: require('./partials/navbar.vue'),
        sidebar: require('./partials/sidebar.vue'),
    }
}

</script>