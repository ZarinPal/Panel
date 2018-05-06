import Vue from "vue";
Vue.mixin({
    methods: {
        clearNumber: function (number) {
            let exportableNumber = number;
            if (/,/g.test(number)) {
                exportableNumber = number.replace(/,/g, "");
            }

            return exportableNumber;

            // return exportableNumber.replace(/[\u0660-\u0669]/g, function (c) {
            //     return c.charCodeAt(0) - 0x0660;
            // }).replace(/[\u06f0-\u06f9]/g, function (c) {
            //     return c.charCodeAt(0) - 0x06f0;
            // });
        },
    }
});