import Vue from 'vue';
Vue.mixin({
    methods: {
        clearNumber: function(number) {
            if (/,/g.test(number)) {
                return number.replace(/,/g, "");
            }
            return number;
        },
    }
});