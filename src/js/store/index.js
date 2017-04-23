window.store = new Vuex.Store({
    modules: {
        alert: require('./modules/alert').default,
        http: require('./modules/http').default,
        auth: require('./modules/auth').default,
        app: require('./modules/app').default,
        paginator: require('./modules/paginator').default,
    }
});
