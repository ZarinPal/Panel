'use strict';
/**
 * First we will load all of this project's JavaScript dependencies which
 * include Vue and Vue Resource. This gives a great starting point for
 * building robust, powerful web applications using Vue and Laravel.
 */
require('./bootstrap');

require('./filters');

require('./store');

// Vue.transition('list-item', {
//     enterClass: 'lightSpeedIn',
//     leaveClass: 'lightSpeedOut'
// });
// Vue.transition('dialog', {
//     enterClass: 'flipInX',
//     leaveClass: 'flipOutX'
// });

new Vue({
    name: 'application',
    store,
    i18n,
    router: require('./router').default,
    data() {
        return {
            baseUrl: siteConfigs.baseUrl,
        };
    },
    http: {
        root: siteConfigs.baseUrl + '/rest/v3',
    },
    created() {
        //init active tab on load
        this.$store.commit('app/loading');
        this.$store.commit('http/boot', this);
        require('./i18n').default(this, function (vm) {
            // if (vm.$route.meta.standAlone) {
            //     // vm.$store.commit('app/ready');
            // }
        });

        //Try to fix app ready after 10 seconds
        let vm = this;
        setTimeout(function () {
            if (vm.$store.state.auth.check && vm.$store.state.auth.isLoaded &&
                !vm.$store.state.app.isLoaded) {
                vm.$store.commit('app/ready');
            }
        }, 5000);

        //Redirect to panel/home if user logged in(its for don`t see login/register page if logged in)
        if (this.$route.meta.standAlone) {
            if (this.$route.meta.notLoading) {
                vm.$store.commit('app/ready');

                return;
            }

            let standAlonePages = [
                'auth.register',
            ];

            if (standAlonePages.indexOf(this.$route.name) !== -1) {
                this.$store.state.http.requests['oauth.check'].get().then(() => {
                    vm.$router.push({name: 'home.index'});
                }).catch(() => {
                    vm.$store.commit('app/ready');
                });
            }
        }
    },
    components: {
        'flash-message': require('./components/pages/partials/flash-message.vue'),
        'mainLoading': require('./components/pages/partials/main-loading.vue'),
    },
}).$mount('#app');
