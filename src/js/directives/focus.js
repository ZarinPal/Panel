export default {
    bind: function (el) {
        Vue.nextTick(function() {
            el.focus();
        });
    }
};