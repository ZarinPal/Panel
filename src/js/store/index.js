window.store = new Vuex.Store({
    modules: {
        flashMessage: require('./modules/flash-message').default,
        http: require('./modules/http').default,
        auth: require('./modules/auth').default,
        app: require('./modules/app').default,
        paginator: require('./modules/paginator').default,
    }
});
