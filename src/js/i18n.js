export default function (vm,callback) {
    vm.$store.state.http.requests['app.getTranslation'].get().then(
        (request) => {
            Vue.config.lang = 'fa';
            Vue.config.fallbackLang = 'en';

            i18n.setLocaleMessage('fa', require('./lang/fa.json'));
            i18n.setLocaleMessage('en', require('./lang/en.json'));

            callback(vm);
        }
    );
}

