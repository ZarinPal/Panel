export default function (vm,callback) {
    vm.$store.state.http.requests['app.getTranslation'].get().then(
        (request) => {
            // Vue.config.lang = 'fa';
            // Vue.config.fallbackLang = 'en';
            //
            // Object.keys(request.data.data).forEach(function (lang) {
            //     Vue.locale(lang, request.data.data[lang])
            // });

            callback(vm);
        }
    );
}

