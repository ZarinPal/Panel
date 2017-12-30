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


new Vue({
    name: 'application',
    store,
    i18n,
    router: require('./router').default,
    data() {
      return {
          // baseUrl: 'http://api.zarinpal.localhost', // local: panel base
          baseUrl: 'https://my.zarinpal.com', // production: panel base
      }
    },
    http: {
        // root: 'http://api.zarinpal.localhost/rest/v3',// local: panel base
        root: 'https://my.zarinpal.com/rest/v3',// production: panel base
    },
    created() {
        //init active tab on load
        this.$store.commit('app/loading');
        this.$store.commit('http/boot', this);
        require('./i18n').default(this, function (vm) {
            if (vm.$route.meta.standAlone) {
                vm.$store.commit('app/ready');
            }
        });

        //Try to fix app ready after 10 seconds
        let vm = this;
        setTimeout(function () {
            if(vm.$store.state.auth.check && vm.$store.state.auth.isLoaded && !vm.$store.state.app.isLoaded) {
                vm.$store.commit('app/ready');
            }
        }, 5000);
    },
    components: {
        "flash-message": require('./components/pages/partials/flash-message.vue')
    },
}).$mount('#app');
