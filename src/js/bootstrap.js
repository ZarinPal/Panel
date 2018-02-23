window._ = require('lodash');

window.moment = require('moment-jalaali');
window.moment.loadPersian();
// window.Chart = require('chart.js');
/**
 * Vue is a modern JavaScript library for building interactive web interfaces
 * using reactive data binding and reusable components. Vue's API is clean
 * and simple, leaving you to focus on building your next great project.
 */

import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import VueI18n from "vue-i18n";
/**
 * Vee validate
 */
import VeeValidate from "vee-validate";
import messagesFa from "./lang/validation/fa";
import VueSentry from "vue2-sentry";

import NumberFormat from './mixin/number_format';
import Validation from './mixin/validation';

Vue.use(VeeValidate, {
    locale: 'fa',
    dictionary: {
        fa: messagesFa,
    }
});

window.Vue = Vue;
require('vue-resource');

window.VueRouter = VueRouter;
Vue.use(window.VueRouter);

window.Vuex = Vuex;
Vue.use(Vuex);

Vue.use(VueI18n);

const i18n = new VueI18n({
    locale: 'fa',
    fallbackLocale: 'en',
});
window.i18n = i18n;

Vue.use(VueSentry, {
    protocol: 'https', // default is https
    key: '0e52e25ebe614c0892b9a057b52a8d21',
    server: 'sentry.zarinpal.com',
    project: '5',
    config: {
        release: process.env.GIT_SHA
    },
    enable: process.env.NODE_ENV === 'production',
});

Vue.directive(
    'clipboard',
    require('./directives/clipboard')
);

// Vue.directive(
//     'sticky',
//     require('./directives/sticky')
// );

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

Vue.directive(
    'english-number',
    require('./directives/back').default
);

Vue.directive(
    'mask',
    require('./directives/mask').default
);

Vue.directive(
    'avatar',
    require('./directives/avatar').default
);
Vue.directive(
    'focus',
    require('./directives/focus').default
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
