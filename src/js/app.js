"use strict";
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


const app = new Vue({
    name: 'application',
    store,
    i18n,
    router: require('./router').default,
    data() {
      return {
          // https://next.zarinpal.com/panel            =======> its for next panel
          // https://api.zarinpal.dev/panelw/index.html =======> its for dev panel
          baseUrl: 'https://next.zarinpal.com/panel', // panel base
          rootUrl: 'https://api.zarinpal.com/rest/v3', //its for transaction pdf
      }
    },
    http: {
        root: 'https://api.zarinpal.com/rest/v3',
    },
    created() {
        //init active tab on load
        this.$store.commit('app/changeTabData', this.$route.name.split('.')[0]);

        this.$store.commit('app/loading');
        this.$store.commit('http/boot', this);
        require('./i18n').default(this, function (vm) {
            if (!vm.$route.meta.standAlone) {
                vm.$store.dispatch('auth/fetch',
                    () => {
                        // vm.$store.commit('app/ready');
                    }
                );
            } else {
                vm.$store.commit('app/ready');
            }
        });

    },
    watch: {
        '$route' (to) {
            this.$store.commit('app/changeTabData', to.name.split('.')[0])
        }
    },
    components: {
        "flash-message": require('./components/pages/partials/flash-message.vue')
    },
}).$mount('#app');
