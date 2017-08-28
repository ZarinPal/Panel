export default function (vm,callback) {
    vm.$store.state.http.requests['app.getTranslation'].get().then(
        (request) => {
            Vue.config.lang = 'fa';
            Vue.config.fallbackLang = 'en';

            let lags = Object.keys(request.data.data);
            for(let i=0;i<lags.length;i++){
                i18n.setLocaleMessage(lags[i], request.data.data[lags[i]])
            }

            callback(vm);
        }
    );
}

