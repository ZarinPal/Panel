window._ = require('lodash');

window.moment = require('moment-jalaali');
window.moment.loadPersian();
// window.Chart = require('chart.js');

/**
 * Vue is a modern JavaScript library for building interactive web interfaces
 * using reactive data binding and reusable components. Vue's API is clean
 * and simple, leaving you to focus on building your next great project.
 */
import Vue from 'vue';
window.Vue = Vue;
require('vue-resource');

import VueRouter from 'vue-router';
window.VueRouter = VueRouter;
Vue.use(window.VueRouter);

import Vuex from 'vuex';
window.Vuex = Vuex;
Vue.use(Vuex);


import VueI18n from 'vue-i18n';
Vue.use(VueI18n);


const i18n = new VueI18n({
    locale: 'fa',
    fallbackLocale: 'en',
});
window.i18n = i18n;

Vue.directive(
    'clipboard',
    require('./directives/clipboard')
);

Vue.directive(
    'sticky',
    require('./directives/sticky')
);

Vue.directive(
    'ripple',
    require('./directives/ripple').default
);

Vue.directive(
    'click-outside',
    require('./directives/close').default
);

Vue.directive(
    'back',
    require('./directives/back').default
);

/**
 * We'll register a HTTP interceptor to attach the "CSRF" header to each of
 * the outgoing requests issued by this application. The CSRF middleware
 * included with Laravel will automatically verify the header's value.
 */

// Vue.http.interceptors.push((request, next) => {
//     request.headers.set('X-CSRF-TOKEN', Laravel.csrfToken);
//
//     next();
// });
//
/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from "laravel-echo"

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: 'your-pusher-key'
// });
