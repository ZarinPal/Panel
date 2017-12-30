export default {
    bind(el, binding, vnode) {
        /** ---------------
         *      Keyup
         ----------------**/
        el.addEventListener('keyup', function (event) {
            /** ---------------
                    Money
             ----------------**/
            Vue.nextTick(function() {
                if (binding.value.money && el.value) {
                    let input = el.value.replace(/,/g, "");
                    if (/^[0-9]*$/.test(input)) {
                        let number = parseInt(el.value.replace(/\D/g,''),10);
                        el.value = number.toLocaleString();
                    }
                }
            });
        }) ;
    }
};