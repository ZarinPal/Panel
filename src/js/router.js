export default new VueRouter({
    // mode: 'history',
    // base:'panel',
    routes: [
        {
            path: '/auth/login',
            name: 'auth.login',
            component: require('./components/pages/auth/login.vue'),
            meta: {standAlone: true}
        },
        {
            path: '/auth/register',
            name: 'auth.register',
            component: require('./components/pages/auth/register.vue'),
            meta: {standAlone: true}
        },
        {
            path: '/panel',
            component: require('./components/pages/panel.vue'),
            children: [
                {
                    path: 'home',
                    name: 'home.index',
                    component: require('./components/pages/home/home.vue')
                },
                {
                    path: 'home/finishAddFund',
                    name: 'home.finishAddFund',
                    component: require('./components/pages/home/partials/finish-add-fund.vue')
                },
                {
                    path: 'webservice',
                    name: 'webservice.index',
                    component: require('./components/pages/webservice/index.vue')
                },
                {
                    path: 'webservice/create',
                    name: 'webservice.create',
                    component: require('./components/pages/webservice/partials/create.vue')
                },
                {
                    path: 'webservice/edit/:merchantCode',
                    name: 'webservice.edit',
                    component: require('./components/pages/webservice/partials/edit.vue')
                },
                {
                    path: 'card',
                    name: 'card.index',
                    component: require('./components/pages/card/index.vue')
                },
                {
                    path: 'card/statement',
                    name: 'card.statement',
                    component: require('./components/pages/card/partials/zarinCardStatement.vue')
                },
                {
                    path: 'easypay',
                    name: 'easypay.index',
                    component: require('./components/pages/easypay/index.vue')
                },
                {
                    path: 'easypay/create',
                    name: 'easypay.create',
                    component: require('./components/pages/easypay/partials/create.vue')
                },
                {
                    path: 'easypay/edit/:public_id',
                    name: 'easypay.edit',
                    component: require('./components/pages/easypay/partials/edit.vue')
                },
                {
                    path: 'coupon',
                    name: 'coupon.index',
                    component: require('./components/pages/coupon/index.vue')
                },                {
                    path: 'coupon/test',
                    name: 'coupon.test',
                    component: require('./components/pages/coupon/test.vue')
                },
                {
                    path: 'coupon/create',
                    name: 'coupon.create',
                    component: require('./components/pages/coupon/partials/create.vue')
                },
                {
                    path: 'coupon/edit/:entity_id',
                    name: 'coupon.edit',
                    component: require('./components/pages/coupon/partials/edit.vue')
                },
                {
                    path: 'ticket/create',
                    name: 'ticket.create',
                    component: require('./components/pages/ticket/create.vue')
                },
                {
                    path: 'transactionsession/:id',
                    name: 'transactionsession.index',
                    component: require('./components/pages/transactionsession/index.vue')
                },
                {
                    path: 'transaction/:type/:id',
                    name: 'transaction.index',
                    component: require('./components/pages/transaction/index.vue')
                },
                {
                    path: 'report/:type/:id',
                    name: 'report.index',
                    component: require('./components/pages/report/index.vue')
                }
            ]
        },
        {
            path: '/panel/ticket',
            component: require('./components/pages/ticket/index.vue'),
            children: [
                {
                    path: '',
                    name: 'ticket.index',
                    component: require('./components/pages/ticket/pages/empty.vue')
                },
                {
                    path: 'show/:id',
                    name: 'ticket.show',
                    component: require('./components/pages/ticket/pages/show.vue')
                }
            ]
        },
        { path: '/', redirect: '/panel/home' },
    ],
    scrollBehavior (to, from, savedPosition) {
        return { x: 0, y: 0 }
    }
});