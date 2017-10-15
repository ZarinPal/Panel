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
                let dateRegex = new RegExp('^\\d{4}\\'+tokens.date+'\\d{2}$');
                if(event.keyCode !== 8) {
                    let value = el.value;
                    if (value.match(/^\d{4}$/) !== null) {
                        el.value = value + tokens.date;
                    } else if (value.match(dateRegex) !== null) {
                        el.value = value + tokens.date;
                    }
                }
            }

            /** ---------------
             *      IP
             ----------------**/
            if (binding.value.type == 'ip') {
                let ipRegex = new RegExp('^([12]?\\d{1,2}\\' +tokens.ip+ '){3}[12]?\\d{1,2}$');

                if(event.keyCode !== 8) {
                    let value = el.value;
                    if (value.match(/^[12]?\d{1,2}\./) !== null) {
                        el.value = value + tokens.ip;
                    } else if (value.match(ipRegex) !== null) {
                        el.value = value + tokens.ip;
                    }
                }
            }

        });
    }
};