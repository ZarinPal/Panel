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
//        beforeRouteEnter (to, from, next) {
//            next(vm => {
//                vm.checkUserLevel(to, from, next, vm);
//            });
//        },
//        beforeRouteUpdate (to, from, next) {
//            let vm = this;
//            this.checkUserLevel(to, from, next, vm);
//        },
        computed: {
            refererId() {
                return this.$store.state.app.refererId;
            }
        },
        created(){
            this.$store.commit('app/loading');
            let vm = this;
            this.$store.dispatch('auth/fetch', () => {});

            if(this.refererId) {
                store.commit('flashMessage',{
                    text: 'back-to-referer',
                    type: 'danger',
                    important: true
                });
            }
        },
        methods: {
            checkUserLevel(to, from, next, vm) {
                let userLevel;
                if(!vm) {
                    userLevel = this.$store.state.auth.user.level;
                } else {
                    userLevel = vm.$store.state.auth.user.level;
                }

                if(!to.meta.accessLevel || !_.indexOf(to.meta.accessLevel, userLevel)) {
                    next({path: '/panel/home/No/notAllow-' + from.name});
                } else {
                    next();
                }
            },
        },
        components:{
            navbar,
            sidebar,
            loading,
        }
    }

</script>