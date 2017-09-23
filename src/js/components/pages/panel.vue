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
        beforeRouteUpdate (to, from, next) {
            if(!this.$store.state.auth.isRequested){
                next();
            }
            if(!this.checkUserLevel(to.meta.accessLevel, this)) {
                this.$router.push({name: 'home.index',query:{error:'suspend',path:from.name}});
            }
            next();
        },
        computed: {
            refererId() {
                return this.$store.state.app.refererId;
            }
        },
        created(){
            this.$store.commit('app/loading');
            let vm = this;
            this.$store.dispatch('auth/fetch', () => {
                if (!vm.checkUserLevel(vm.$route.meta.accessLevel, vm)) {
                    vm.$router.push({name: 'home.index',query:{error:'suspend',path:vm.$route.name}});
                }
            });

            if(this.refererId) {
                store.commit('flashMessage',{
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
                    '2': 'basic',
                    '3': 'silver',
                    '4': 'gold',
                };

                let userLevel = (vm.$store.state.auth.user.level + 1).toString();
                return _.indexOf(acceptedLevels, levels[userLevel]) !== -1;
            },
        },
        components:{
            navbar,
            sidebar,
            loading,
        }
    }

</script>