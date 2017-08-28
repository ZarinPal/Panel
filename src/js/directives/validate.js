export default {
    bind(el, binding, vnode) {
        /**=========================================
         * type: number, mobile,
         * money => format: 1,000 //true, false
         =========================================*/

        /**=================
         *
         *      keypress
         *
         ==================*/
        el.addEventListener('keypress', function (event) {
            /** ---------------
             Valid is Number
             ----------------**/
            if (binding.value.type == 'number') {
                let key = window.event ? event.keyCode : event.which;
                if (
                    event.keyCode == 8  ||
                    event.keyCode == 17 ||
                    event.keyCode == 18 ||
                    event.keyCode == 46 ||
                    event.keyCode == 37 ||
                    event.keyCode == 39 ||
                    event.keyCode == 91 ||
                    event.keyCode == 93 ||

                    //left command
                    (event.keyCode == 91 && event.keyCode == 65) ||
                    (event.keyCode == 91 && event.keyCode == 67) ||
                    (event.keyCode == 91 && event.keyCode == 86) ||
                    (event.keyCode == 91 && event.keyCode == 88) ||

                    //right command
                    (event.keyCode == 93 && event.keyCode == 65) ||
                    (event.keyCode == 93 && event.keyCode == 67) ||
                    (event.keyCode == 93 && event.keyCode == 86) ||
                    (event.keyCode == 93 && event.keyCode == 88) ||

                    //ctrl
                    (event.keyCode == 17 && event.keyCode == 65) ||
                    (event.keyCode == 17 && event.keyCode == 67) ||
                    (event.keyCode == 17 && event.keyCode == 86) ||
                    (event.keyCode == 17 && event.keyCode == 88)
                ) {
                    return true;
                }
                else if ( key < 48 || key > 57 ) {
                    //Letters
                    event.preventDefault();
                    store.commit('flashMessage',{
                        text: 'invalid keyboard type',
                        type: 'danger'
                    });
                    return false;
                } else {
                    return true;
                }
            }

        });


        el.addEventListener('keyup', function (event) {
            /** ---------------
             Money
             ----------------**/
            if(binding.value.money) {

                let key = window.event ? event.keyCode : event.which;
                if (
                    event.keyCode == 8  ||
                    event.keyCode == 17 ||
                    event.keyCode == 18 ||
                    event.keyCode == 46 ||
                    event.keyCode == 37 ||
                    event.keyCode == 39 ||
                    event.keyCode == 91 ||
                    event.keyCode == 93
                ) {
                    return true;
                }
                else if ( key < 48 || key > 57 ) {
                    //Letters
                    event.preventDefault();
                    return false;
                } else {
                    //Its mean key is valid number
                    let number = parseInt(el.value.replace(/\D/g, ''), 10);
                    el.value = number.toLocaleString();
                    return true;
                }

            }
        });


        el.addEventListener('paste', function (event) {
            if(binding.value.money) {
                let clipboardData, pastedData;

                event.stopPropagation();
                event.preventDefault();

                clipboardData = event.clipboardData || window.clipboardData;
                pastedData = clipboardData.getData('Text');

                let onlyDigitRegex = /^\d+$/;
                if(onlyDigitRegex.test(pastedData)) {
                    clipboardData.setData('Text', null);
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

    }
};