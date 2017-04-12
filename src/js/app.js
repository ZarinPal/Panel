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
    name:'application',
    store,
    router: require('./router').default,
    http: {
        root: 'https://api.zarinpal.com/rest/v3',
    },
    created() {
        this.$store.commit('app/loading');
        this.$store.commit('http/boot', this);
        if(!this.$route.meta.standAlone){
            this.$store.dispatch('auth/fetch');
        }
        require('./i18n').default(this, function (vm) {
            vm.$store.commit('app/ready')
        });
    },
    components: {
        "flash-message": require('./components/pages/partials/flash-message.vue')
    }
}).$mount('#app');
