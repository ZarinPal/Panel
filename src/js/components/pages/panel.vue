<template lang="pug">
    div.full-height(:class="{'blur-screen': $store.state.app.logOuting || !$store.state.app.isLoaded}")
        navbar

        div.zp-container.row
            sidebar

            div.col-xs.main-content
                <!--button.success.pull-left(v-back="") back-->
                router-view

            div.three-circle-loading(v-if="$store.state.app.logOuting || !$store.state.app.isLoaded")
                div.spinner
                div.spinner
                div.spinner

        div.clear-both
    <!--div(v-else)-->
        <!--div.loading.ta-center-->
            <!--div.spinner-->

</template>


<script>
    import navbar from '../pages/partials/navbar.vue';
    import sidebar from '../pages/partials/sidebar.vue';
    import loading from '../pages/partials/loading.vue';

    export default {
        name: 'panel',
        beforeRouteUpdate (to, from, next) {
            if (this.$store.state.auth.check
                && !this.checkUserLevel(to.meta.accessLevel, this)) {
                this.$router.push({name: 'home.index', query: {error: 'suspend', path: from.name}});
            }
            next();
        },
        computed: {
            refererId() {
                return this.$store.state.app.refererId;
            }
        },
        created(){
            let body = document.getElementById('body');
            body.classList.remove("no-scroll");

            this.$store.commit('app/loading');
            let vm = this;
            this.$store.dispatch('auth/fetch', (isOk) => {
                if (isOk && !vm.checkUserLevel(vm.$route.meta.accessLevel, vm)) {
                    vm.$router.push({name: 'home.index', query: {error: 'suspend', path: vm.$route.name}});
                }
            });

            if (this.refererId) {
                store.commit('flashMessage', {
                    text: 'back-to-referer',
                    type: 'danger',
                    important: true
                });
            }
        },
        methods: {
            checkUserLevel(acceptedLevels, vm) {
                let levels = {
                    '0': 'suspend',
                    '1': 'basic',
                    '2': 'basic',
                    '3': 'silver',
                    '4': 'gold',
                };

                let userLevel = (vm.$store.state.auth.user.level + 1).toString();
                if (!acceptedLevels || !acceptedLevels.length || userLevel === 1) return true;
                return _.indexOf(acceptedLevels, levels[userLevel]) !== -1;
            },
        },
        components: {
            navbar,
            sidebar,
            loading,
        }
    }

</script>