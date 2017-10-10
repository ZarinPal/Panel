export default {
    bind(el, binding, vnode) {

        let tokens = {
            date: '-',
        };


        el.addEventListener('keydown', function (event) {
            /** ---------------
             *      Date
             ----------------**/
            let dateRegex = new RegExp('^\\d{4}\\'+tokens.date+'\\d{2}$');

            if (binding.value.type == 'date') {
                if(event.keyCode !== 8) {
                    let value = el.value;
                    if (value.match(/^\d{4}$/) !== null) {
                        el.value = value + tokens.date;
                    } else if (value.match(dateRegex) !== null) {
                        el.value = value + tokens.date;
                    }
                }
            }

        });
    }
};