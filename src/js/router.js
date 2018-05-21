export default new VueRouter({
  mode: siteConfigs.routerMode,
  // base:'panel',
  routes: [
    {
      path: '/auth/verify/:email/:otp',
      name: 'auth.verify',
      component: require('./components/pages/auth/login.vue'),
      meta: {standAlone: true},
    },
    {
      path: '/auth/login/:refererId?',
      name: 'auth.login',
      component: require('./components/pages/auth/login.vue'),
      meta: {standAlone: true},
    },
    {
      path: '/auth/register/:referrerId?/:mobile?',
      name: 'auth.register',
      component: require('./components/pages/auth/register.vue'),
      meta: {standAlone: true},
    },
    {
      path: '/panel/error/404',
      name: 'error.404',
      component: require('./components/pages/error/404.vue'),
      meta: {
        standAlone: true,
        notLoading: true,
      },
    },
    {
      path: '/panel/error/connection',
      name: 'error.connection',
      component: require('./components/pages/error/connection.vue'),
      meta: {
        standAlone: true,
      },
    },
    {
      path: '/panel/ticket/guest/:phone?/:publicId?',
      name: 'ticket.guest',
      component: require('./components/pages/ticket/guest.vue'),
      meta: {
        standAlone: true,
        notLoading: true,
      },
    },
    {
      path: '/panel/',
      component: require('./components/pages/panel.vue'),
      meta:{
        breadcrumb: [
          {
            crumbName:'panel.home',
            routeName:'home.index'
          }
        ]
      },
      children: [
        {path: '/', redirect: '/panel/home'},
        {
          path: '',
          component: require(
              './components/pages/partials/containers/standard.vue'),
          children: [
            {
              path: 'home/:createPurse?',
              name: 'home.index',
              component: require('./components/pages/home/home.vue'),
              meta: {
                accessLevel: ['suspend', 'basic', 'silver', 'gold'],
              },
            },
            {
              path: 'webservice',
              name: 'webservice.index',
              component: require('./components/pages/webservice/index.vue'),
              meta: {
                accessLevel: ['suspend', 'silver', 'gold'],
                breadcrumb: [
                    'panel.webservice'
                ],
              },
            },
            {
              path: 'webservice/create',
              name: 'webservice.create',
              component: require(
                  './components/pages/webservice/partials/create.vue'),
              meta: {
                accessLevel: ['silver', 'gold'],
                breadcrumb: [
                  {
                    crumbName:'panel.webservice',
                    routeName:'webservice.index'
                  },
                  'webservice.create'],


              },
            },
            {
              path: 'webservice/edit/:merchantCode',
              name: 'webservice.edit',
              component: require(
                  './components/pages/webservice/partials/edit.vue'),
              meta: {
                accessLevel: ['silver', 'gold'],
                breadcrumb: [
                  {
                    crumbName:'panel.webservice',
                    routeName:'webservice.index'
                  },
                    'webservice.editWebservice'
                ],
              },
            },
            {
              path: 'card',
              name: 'card.index',
              component: require('./components/pages/card/index.vue'),
              meta: {
                accessLevel: ['suspend', 'basic', 'silver', 'gold'],
                breadcrumb: ['panel.card'],
              },
            },
            {
              path: 'card/statement',
              name: 'card.statement',
              component: require(
                  './components/pages/card/partials/zarinCardStatement.vue'),
              meta: {
                accessLevel: ['basic', 'silver', 'gold'],

              },
            },
            {
              path: 'easypay/create',
              name: 'easypay.create',
              component: require(
                  './components/pages/easypay/partials/create.vue'),
              meta: {
                accessLevel: ['basic', 'silver', 'gold'],
                breadcrumb: [
                  {
                    crumbName:'panel.easypay',
                    routeName:'easypay.index'
                  },
                  'easypay.createEasypay'],
              },
            },
            {
              path: 'easypay',
              name: 'easypay.index',
              component: require('./components/pages/easypay/index.vue'),
              meta: {
                accessLevel: ['suspend', 'silver', 'gold'],
                breadcrumb: [' panel.easypay'],

              },
            },
            {
              path: 'easypay/edit/:public_id',
              name: 'easypay.edit',
              component: require(
                  './components/pages/easypay/partials/edit.vue'),
              meta: {
                accessLevel: ['basic', 'silver', 'gold'],
                breadcrumb:['easypay.editEasyPay'],

              },
            },
            {
              path: 'user/verifyNotification/:id',
              name: 'user.verifyNotification',
              component: require('./components/pages/user/verfiy-telegram.vue'),
              meta: {
                accessLevel: ['basic', 'silver', 'gold'],
              },
            },
            {
              path: 'coupon',
              name: 'coupon.index',
              component: require('./components/pages/coupon/index.vue'),
              meta: {
                accessLevel: ['suspend', 'silver', 'gold'],
                breadcrumb: ['panel.coupon'],

              },
            },
            {
              path: 'coupon/create',
              name: 'coupon.create',
              component: require(
                  './components/pages/coupon/partials/create.vue'),
              meta: {
                accessLevel: ['silver', 'gold'],
                breadcrumb: [
                  {
                    crumbName:'panel.coupon',
                    routeName:'coupon.index'
                  },
                  'coupon.createCoupon'],

              },
            },
            {
              path: 'coupon/edit/:entity_id',
              name: 'coupon.edit',
              component: require('./components/pages/coupon/partials/edit.vue'),
              meta: {
                accessLevel: ['silver', 'gold'],
                breadcrumb: [
                  {
                    crumbName:'panel.coupon',
                    routeName:'coupon.index'
                  },
                    'coupon.editCoupon'
                ],
              },
            },
            {
              path: 'ticket/create',
              name: 'ticket.create',
              component: require('./components/pages/ticket/create.vue'),
              meta: {
                accessLevel: ['suspend', 'basic', 'silver', 'gold'],
                breadcrumb: [
                  {
                    crumbName:'panel.ticket',
                    routeName:'ticket.index'
                  },

                  'ticket.addTicket'],

              },
            },
            {
              path: 'transactionsession/:id',
              name: 'transactionsession.index',
              component: require(
                  './components/pages/transaction_sessions/index.vue'),
              meta: {
                accessLevel: ['suspend', 'basic', 'silver', 'gold'],
                breadcrumb: [
                  {
                    crumbName:'panel.webservice',
                    routeName:'webservice.index'
                  },
                    'panel.transactionsession'
                ],


              },
            },
            {
              path: 'transaction/:type/:id/:transactionId?',
              name: 'transaction.index',
              component: require('./components/pages/transaction/index.vue'),
              meta: {
                accessLevel: ['suspend', 'basic', 'silver', 'gold'],
                breadcrumb:[
                  {
                    crumbName:'panel.webservice',
                    routeName:'webservice.index'
                  },
                    'panel.transaction'
                ],

              },
            },
            {
              path: 'report/:reportFor/:reportId',
              name: 'report.index',
              component: require('./components/pages/report/index.vue'),
              meta: {
                accessLevel: ['suspend', 'basic', 'silver', 'gold'],
                breadcrumb:[
                  {
                    crumbName:'panel.webservice',
                    routeName:'webservice.index'
                  },
                    'report.title'
                ],
              },
            },
            {
              path: 'requestMoney/:type?',
              name: 'requestMoney.index',
              component: require('./components/pages/requestـmoney/index.vue'),
              meta: {
                accessLevel: ['basic', 'silver', 'gold'],
                breadcrumb: ['common.dangiDongi'],
              },
            },
            {
              path: 'user/addAddress',
              name: 'user.addAddress',
              component: require(
                  './components/pages/user/partials/add_address.vue'),
              meta: {
                accessLevel: ['basic', 'silver', 'gold'],
                breadcrumb: [' user.addNewAddress'],

              },
            },
            {
              path: 'user/levelUp',
              name: 'user.levelUp',
              component: require('./components/pages/user/partials/level_up'),
              meta: {
                accessLevel: ['basic'],
              },
            },
            {
              path: 'user/notificationSetting',
              name: 'user.notificationSetting',
              component: require(
                  './components/pages/user/partials/notification_setting.vue'),
              meta: {
                accessLevel: ['suspend', 'basic', 'silver', 'gold'],
                breadcrumb: ['user.notificationSetting'],

              },
            },
            {
              path: 'user/showProgress',
              name: 'user.showProgress',
              component: require('./components/pages/user/user_progress.vue'),
              meta: {
                accessLevel: ['suspend', 'basic', 'silver', 'gold'],
                breadcrumb:[' user.userProgress'] ,

              },
            },
          ],
        },
        {
          path: '',
          component: require(
              './components/pages/partials/containers/ticket.vue'),

            children: [
            {
              path: '/panel/ticket',
              component: require('./components/pages/ticket/index.vue'),
              children: [
                {
                  path: '',
                  name: 'ticket.index',
                  component: require(
                      './components/pages/ticket/pages/empty.vue'),
                  meta: {
                    accessLevel: ['suspend', 'basic', 'silver', 'gold'],
                    breadcrumb: ['panel.ticket'],
                    additionalClass: "ticket-breadcrumb-title"
                  },
                },
                {
                  path: 'show/:id',
                  name: 'ticket.show',
                  component: require(
                      './components/pages/ticket/pages/show.vue'),
                  meta: {
                    accessLevel: ['suspend', 'basic', 'silver', 'gold'],
                    additionalClass: "ticket-breadcrumb-title",
                    breadcrumb: [
                      {
                        crumbName:'panel.ticket',
                        routeName:'ticket.index'
                      },

                      'ticket.showTicket'
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {path: '/*', redirect: '/panel/error/404'},
  ],
  scrollBehavior (to, from, savedPosition) {
    return {x: 0, y: 0};
  },
});