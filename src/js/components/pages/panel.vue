<template lang="pug">
    div.full-height(v-if="$store.state.app.isLoaded")
        navbar

        div.zp-container.row
            sidebar

            div.col-xs.main-content
                <!--button.success.pull-left(v-back="") back-->
                router-view


        div.clear-both
    div(v-else)
        div.loading.ta-center
            div.spinner

</template>


<script>
    import navbar from '../pages/partials/navbar.vue';
    import sidebar from '../pages/partials/sidebar.vue';
    import loading from '../pages/partials/loading.vue';

    export default {
    name: 'panel',
    computed: {
        refererId(){
            return this.$store.state.app.refererId;
        }
    },
    created(){
//        //Application init
//        this.$store.commit('http/boot', this);
//        require('./i18n').default(this, function (vm) {
//            if (!vm.$route.meta.standAlone) {
//                vm.$store.dispatch('auth/fetch',
//                    () => {
//                        // vm.$store.commit('app/ready');
//                    }
//                );
//            } else {
//                vm.$store.commit('app/ready');
//            }
//        });

        if(this.refererId) {
            store.commit('flashMessage',{
                text: 'back-to-referer',
                type: 'danger',
                important: true
            });
        }
    },
    components:{
        navbar,
        sidebar,
        loading,
    }
}

</script>