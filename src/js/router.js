export default new VueRouter({
    mode: 'history',
    // base:'panel',
    routes: [
        {
            path: '/auth/login/:refererId?',
            name: 'auth.login',
            component: require('./components/pages/auth/login.vue'),
            meta: {standAlone: true}
        },
        {
            path: '/auth/register/:refererId?/:mobile?',
            name: 'auth.register',
            component: require('./components/pages/auth/register.vue'),
            meta: {standAlone: true}
        },
        {
            path: '/panel/error/404',
            name: 'error.404',
            component: require('./components/pages/error/404.vue'),
            meta: {standAlone: true}
        },
        {
            path: '/panel',
            component: require('./components/pages/panel.vue'),
            children: [
                {
                    path: '',
                    component: require('./components/pages/partials/containers/standard.vue'),
                    children: [
                        {
                            path: 'home/:createPurse?/:limitAccessLevelFor?',
                            name: 'home.index',
                            component: require('./components/pages/home/home.vue'),
                            meta: {
                                accessLevel: ['-1', '1', '2', '3']
                            }
                        },
                        {
                            path: 'home/finishAddFund',
                            name: 'home.finishAddFund',
                            component: require('./components/pages/home/partials/finish-add-fund.vue'),
                            meta: {
                                accessLevel: ['1', '2', '3']
                            }
                        },
                        {
                            path: 'webservice',
                            name: 'webservice.index',
                            component: require('./components/pages/webservice/index.vue'),
                            meta: {
                                accessLevel: ['2', '3']
                            }
                        },
                        {
                            path: 'webservice/create',
                            name: 'webservice.create',
                            component: require('./components/pages/webservice/partials/create.vue'),
                            meta: {
                                accessLevel: ['2', '3']
                            }
                        },
                        {
                            path: 'webservice/edit/:merchantCode',
                            name: 'webservice.edit',
                            component: require('./components/pages/webservice/partials/edit.vue'),
                            meta: {
                                accessLevel: ['2', '3']
                            }
                        },
                        {
                            path: 'card',
                            name: 'card.index',
                            component: require('./components/pages/card/index.vue'),
                            meta: {
                                accessLevel: ['1', '2', '3']
                            }
                        },
                        {
                            path: 'card/statement',
                            name: 'card.statement',
                            component: require('./components/pages/card/partials/zarinCardStatement.vue'),
                            meta: {
                                accessLevel: ['1', '2', '3']
                            }
                        },
                        {
                            path: 'easypay',
                            name: 'easypay.index',
                            component: require('./components/pages/easypay/index.vue'),
                            meta: {
                                accessLevel: ['1', '2', '3']
                            }
                        },
                        {
                            path: 'easypay/create',
                            name: 'easypay.create',
                            component: require('./components/pages/easypay/partials/create.vue'),
                            meta: {
                                accessLevel: ['1', '2', '3']
                            }
                        },
                        {
                            path: 'easypay/edit/:public_id',
                            name: 'easypay.edit',
                            component: require('./components/pages/easypay/partials/edit.vue'),
                            meta: {
                                accessLevel: ['1', '2', '3']
                            }
                        },
                        {
                            path: 'coupon',
                            name: 'coupon.index',
                            component: require('./components/pages/coupon/index.vue'),
                            meta: {
                                accessLevel: ['2', '3']
                            }
                        },                {
                            path: 'coupon/test',
                            name: 'coupon.test',
                            component: require('./components/pages/coupon/test.vue'),
                        },
                        {
                            path: 'coupon/create',
                            name: 'coupon.create',
                            component: require('./components/pages/coupon/partials/create.vue'),
                            meta: {
                                accessLevel: ['2', '3']
                            }
                        },
                        {
                            path: 'coupon/edit/:entity_id',
                            name: 'coupon.edit',
                            component: require('./components/pages/coupon/partials/edit.vue'),
                            meta: {
                                accessLevel: ['2', '3']
                            }
                        },
                        {
                            path: 'ticket/create',
                            name: 'ticket.create',
                            component: require('./components/pages/ticket/create.vue'),
                            meta: {
                                accessLevel: ['-1', '1', '2', '3']
                            }
                        },
                        {
                            path: 'transactionsession/:id',
                            name: 'transactionsession.index',
                            component: require('./components/pages/transactionsession/index.vue'),
                            meta: {
                                accessLevel: ['1', '2', '3']
                            }
                        },
                        {
                            path: 'transaction/:type/:id/:transactionId?',
                            name: 'transaction.index',
                            component: require('./components/pages/transaction/index.vue'),
                            meta: {
                                accessLevel: ['1', '2', '3']
                            }
                        },
                        {
                            path: 'report/:type/:id',
                            name: 'report.index',
                            component: require('./components/pages/report/index.vue'),
                            meta: {
                                accessLevel: ['1', '2', '3']
                            }
                        },
                        {
                            path: 'requestMoney/:type?',
                            name: 'requestMoney.index',
                            component: require('./components/pages/requestـmoney/index.vue'),
                            meta: {
                                accessLevel: ['1', '2', '3']
                            }
                        },
                        {
                            path: 'telegram/referer',
                            name: 'telegram.referer',
                            component: require('./components/pages/telegram/referer.vue'),
                        },
                        {
                            path: 'user/addAddress',
                            name: 'user.addAddress',
                            component: require('./components/pages/user/partials/add_address.vue'),
                            meta: {
                                accessLevel: ['1', '2', '3']
                            }
                        },
                        {
                            path: 'user/uploadDocument',
                            name: 'user.uploadDocument',
                            component: require('./components/pages/user/partials/upload_document.vue'),
                            meta: {
                                accessLevel: ['1', '2', '3']
                            }
                        },
                        {
                            path: 'user/notificationSetting',
                            name: 'user.notificationSetting',
                            component: require('./components/pages/user/partials/notification_setting.vue'),
                            meta: {
                                accessLevel: ['1', '2', '3']
                            }
                        },
                    ]
                },
                {
                    path: '',
                    component: require('./components/pages/partials/containers/ticket.vue'),
                    children: [
                        {
                            path: '/panel/ticket',
                            component: require('./components/pages/ticket/index.vue'),
                            children: [
                                {
                                    path: '',
                                    name: 'ticket.index',
                                    component: require('./components/pages/ticket/pages/empty.vue'),
                                    meta: {
                                        accessLevel: ['-1', '1', '2', '3']
                                    }
                                },
                                {
                                    path: 'show/:id',
                                    name: 'ticket.show',
                                    component: require('./components/pages/ticket/pages/show.vue'),
                                    meta: {
                                        accessLevel: ['-1', '1', '2', '3']
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        { path: '/*', redirect: '/panel/error/404' },
    ],
    scrollBehavior (to, from, savedPosition) {
        return { x: 0, y: 0 }
    },
});