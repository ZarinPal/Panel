export default {
    bind(el, binding, vnode) {
        //Type: number, mobile,
        //Size

        //Input size limit
        if (binding.value.size) {
            el.addEventListener('keydown', function (event) {
                if (el.value.length < binding.value.size) {
                    //do something if input value smaller than limit
                } else {
                    //Check if button not ENTER
                    if (event.keyCode !== 13) {
                        event.preventDefault();
                    }
                }
            });
        }

        //Input Type: number
        if (binding.value.type) {
            if(binding.value.type === 'number') {
                el.addEventListener('keydown', function(event) {
                    if (event.which !== 8  && event.which !== 0 && (event.which < 48 || event.which > 57) && event.keyCode !== 13) {
                        event.preventDefault();
                    }
                });
            }
        }

        //Input mobile,
        if (binding.value.type) {
            if(binding.value.mobile) {
                el.value = '09';
            }
        }
    }
};