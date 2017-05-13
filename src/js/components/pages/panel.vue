<template lang="pug">
    div(v-if="$store.state.app.isLoaded")
        navbar

        div.zp-container.row
            sidebar

            div.col-xs.main-content
                button.success.pull-left(v-back="") back
                router-view
        div.clear-both
    div(v-else)
        h1 loading

</template>


<script>
    import navbar from '../pages/partials/navbar.vue';
    import sidebar from '../pages/partials/sidebar.vue';
    import loading from '../pages/partials/loading.vue';

    export default {
    name: 'panel',
    components:{
        navbar,
        sidebar,
        loading,
    }
}

</script>