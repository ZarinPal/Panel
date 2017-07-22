export default {
    bind(el, binding, vnode) {
        /**=========================================
         * type: number, mobile,
         * size: 10
         * money => format: 1,000 //true, false
         =========================================*/


        /**=================
         *
         *      keydown
         *
         ==================*/
        el.addEventListener('keydown', function (event) {
            /**------------------------
             Input LIMIT size
             -------------------------**/
            if (binding.value.size) {
                if (el.value.length < binding.value.size) {
                    //do something if input value smaller than limit
                } else {
                    //Check if button not ENTER
                    if (
                        event.keyCode !== 8  &&
                        event.keyCode !== 9  &&
                        event.keyCode !== 13 &&
                        event.keyCode !== 37 &&
                        event.keyCode !== 39)
                    {
                        event.preventDefault();
                    }
                }
            }


            /** ---------------
             Valid is Number
             ----------------**/
            if (binding.value.type) {
                if(binding.value.type === 'number') {
                    if(/[^\d]/g.test(event.key) && //its mean event IS NOT number in english format
                        event.keyCode !== 8     &&
                        event.keyCode !== 9     &&
                        event.keyCode !== 13    &&
                        event.keyCode !== 37    &&
                        event.keyCode !== 39
                    ) {
                        event.preventDefault();
                        store.commit('flashMessage',{
                            text: 'invalid keyboard type',
                            type: 'danger'
                        });
                    }
                }
            }
        });


        /**---------------
          Init input to MOBILE
         ----------------**/
        if (binding.value.type) {
            if(binding.value.mobile) {
                el.value = '09';
            }
        }


        /**=================
         *
         *      Keyup
         *
         ==================*/
        el.addEventListener('keyup', function() {
            /**------------------------
                    Money format
             -------------------------**/
            if(binding.value.money) {
                let farsiValue = el.value.replace(/,/g, "");
                let sep = ',';
                el.value = farsiValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
            }

        });


    }
};