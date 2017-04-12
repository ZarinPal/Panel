export default new VueRouter({
    //mode: 'history',
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
        { path: '/', redirect: '/panel/home' },
        {
            path: '/panel',
            component: require('./components/pages/panel.vue'),
            children: [
                {
                    // UserProfile
                    path: 'home',
                    name: 'home.index',
                    component: require('./components/pages/home/home.vue')
                },
                {
                    path: '/home/finishAddFund',
                    name: 'home.finishAddFund',
                    // component: require('./../js-v0/components/views/dashboard/home/finish_add_fund.vue')
                },
                {
                    path: '/ticket/servey/:public_id',
                    name: 'ticket.servey',
                    // component: require('./components/views/dashboard/ticket/servey.vue')
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
                    path: 'webservice/requestUssd',
                    name: 'webservice.requestUssd',
                    // component: require('./components/views/dashboard/webservice/partials/request-ussd.vue')
                },
                {
                    path: 'webservice/requestZarinGate',
                    name: 'webservice.requestZarinGate',
                    // component: require('./components/views/dashboard/webservice/partials/request-zarin-gate.vue')
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
                    path: 'card/create',
                    name: 'card.create',
                    // component: require('./components/views/dashboard/card/partials/create.vue')
                },
                {
                    path: '/card/edit/:public_id',
                    name: 'card.edit',
                    // component: require('./components/views/dashboard/card/partials/edit.vue')
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
                    path: '/easypay/show/:public_id',
                    name: 'easypay.show',
                    // component: require('./components/views/dashboard/easypay/show.vue')
                },
                {
                    path: 'easypay/edit/:public_id',
                    name: 'easypay.edit',
                    component: require('./components/pages/easypay/partials/edit.vue')
                },
                {
                    path: '/purse/create',
                    name: 'purse.create',
                    // component: require('./components/views/dashboard/purse/partials/create.vue')
                },
                {
                    path: '/purse/edit/:purse',
                    name: 'purse.edit',
                    // component: require('./components/views/dashboard/purse/partials/edit.vue')
                },
                {
                    path: '/purse/addFund',
                    name: 'purse.addFund',
                    // component: require('./components/views/dashboard/purse/partials/addFund.vue')
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
                    path: '/coupon/create',
                    name: 'coupon.create',
                    // component: require('./components/views/dashboard/coupon/create.vue')
                },
                {
                    path: '/coupon/edit/:coupon',
                    name: 'coupon.edit',
                    // component: require('./components/views/dashboard/coupon/edit.vue')
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
                    path: '/transaction/show/:public_id',
                    name: 'transaction.show',
                    // component: require('./components/views/dashboard/transaction/show.vue')
                },
                {
                    path: '/transaction/report',
                    name: 'transaction.report',
                    // component: require('./components/views/dashboard/transaction/report.vue')
                },
                {
                    path: '/transaction/p2pTransfer',
                    name: 'transaction.p2pTransfer',
                    // component: require('./components/views/dashboard/transaction/p2pTransfer.vue')
                },
                {
                    path: '/transaction/withdraw',
                    name: 'transaction.withdraw',
                    // component: require('./components/views/dashboard/transaction/withdraw.vue')
                },
                {
                    path: '/auth/logout',
                    name: 'auth.logout',
                    // component: require('./components/views/dashboard/auth/logout.vue')
                },
                {
                    path: '/zarincard/request',
                    name: 'zarincard.request',
                    // component: require('./components/views/dashboard/zarincard/request-card.vue')
                },
                {
                    path: '/zarincard/statement',
                    name: 'zarincard.statement',
                    // component: require('./components/views/dashboard/zarincard/statement.vue')
                },
                {
                    path: '/zarincard/shetab',
                    name: 'zarincard.shetab',
                    // component: require('./components/views/dashboard/zarincard/transfer_shetab.vue')
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
        }
    ]
});