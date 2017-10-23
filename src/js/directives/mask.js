export default {
    bind(el, binding, vnode) {

        let tokens = {
            date: '-',
            ip: '.'
        };


        el.addEventListener('keydown', function (event) {
            /** ---------------
             *      Date
             ----------------**/
            if (binding.value.type == 'date') {
                let dateRegex = new RegExp('^\\d{4}\\' + tokens.date + '\\d{2}$');
                if (event.keyCode !== 8) {
                    let value = el.value;
                    if (value.match(/^\d{4}$/) !== null) {
                        el.value = value + tokens.date;
                    } else if (value.match(dateRegex) !== null) {
                        el.value = value + tokens.date;
                    }
                }
            }

        });


        /** ---------------
         *      Keyup
         ----------------**/
        el.addEventListener('keyup', function (event) {
            /** ---------------
                    Money
             ----------------**/
            if (binding.value.money) {
                let key = window.event ? event.keyCode : event.which;
                if (
                    event.keyCode == 8 ||
                    event.keyCode == 17 ||
                    event.keyCode == 18 ||
                    event.keyCode == 46 ||
                    event.keyCode == 37 ||
                    event.keyCode == 39 ||
                    event.keyCode == 91 ||
                    event.keyCode == 93
                ) {
                    let text = el.value.replace(/[^\d]/g, "");
                    let number = text;
                    if (number) {
                        number = parseInt(text.replace(/\D/g, ''), 10);
                    }
                    el.value = number.toLocaleString();

                    return true;
                }
                else if (key < 48 || key > 57) {
                    //Letters
                    event.preventDefault();
                    return false;
                } else {
                    //Its mean key is valid number
                    let text = el.value.replace(/[^\d]/g, "");
                    let number = text;
                    if (number) {
                        number = parseInt(text.replace(/\D/g, ''), 10);
                    }
                    el.value = number.toLocaleString();
                    return true;
                }
            }
        });
    }
};