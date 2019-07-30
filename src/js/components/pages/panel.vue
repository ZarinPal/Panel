<template lang="pug">
  div.full-height
    navbar

    div.zp-container.row
      sidebar

      div.col-xs.main-content
        <!--button.success.pull-left(v-back="") back-->
        router-view(v-if="$store.state.auth.check")
      //
      //notification-bar
      //  div.clear-both


</template>

<script>
    import navbar from '../pages/partials/navbar.vue';
    import sidebar from '../pages/partials/sidebar.vue';
    import loading from '../pages/partials/loading.vue';
    import NotificationBar from "./partials/notification-bar";

    export default {
        name: 'panel',
        beforeRouteUpdate(to, from, next) {
            if (this.$store.state.auth.check
                && !this.checkUserLevel(to.meta.accessLevel, this)) {
                this.$router.push(
                    {name: 'home.index', query: {error: 'suspend', path: from.name}});
            }
            next();
        },
        computed: {
            refererId() {
                return this.$store.state.app.refererId;
            }
        },
        created() {
            let body = document.getElementById('body');
            body.classList.remove("no-scroll");

            this.$store.commit('app/loading');
            let vm = this;

            this.$store.dispatch('auth/fetch', (isOk) => {
                if (vm.$store.state.auth.user.is_migrated) {
                    vm.$router.push({
                        name: 'home.index',
                        query: {error: 'migrated', path: vm.$route.name}
                    });
                } else {
                    if (isOk && !vm.checkUserLevel(vm.$route.meta.accessLevel, vm)) {
                        vm.$router.push({
                            name: 'home.index',
                            query: {error: 'suspend', path: vm.$route.name}
                        });
                    }
                }
            });


//            if (this.refererId) {
//                store.commit('flashMessage', {
//                    text: 'BackToReferrer',
//                    type: 'danger',
//                    important: true
//                });
//            }
        },
        methods: {
            checkUserLevel(acceptedLevels, vm) {
                console.log(acceptedLevels);

                let levels = {
                    '0': 'suspend',
                    '1': 'basic',
                    '2': 'basic',
                    '3': 'silver',
                    '4': 'gold',
                };

                let userLevel = (vm.$store.state.auth.user.level + 1).toString();
                if (!acceptedLevels || !acceptedLevels.length ||
                    userLevel === 1) return true;

                console.log(_.indexOf(acceptedLevels, levels[userLevel]) !== -1);
                return _.indexOf(acceptedLevels, levels[userLevel]) !== -1;
            },
        },
        components: {
            NotificationBar,
            navbar,
            sidebar,
            loading,
        }
    }

</script>