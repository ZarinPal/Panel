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
                    let number = parseInt(el.value.replace(/\D/g,''),10);
                    el.value = number.toLocaleString();
                }
            });
        }) ;
    }
};