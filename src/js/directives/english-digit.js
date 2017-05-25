export default{
    bind(el, binding, vnode, oldVnodeو ) {
        el.addEventListener('keydown', function (e) {

            // let pressedKey;
            //
            // if(window.event) {
            //     pressedKey = e.keyCode;
            // } else if(e.which){
            //     pressedKey = e.which;
            // }
            let str = el.value;
            // String.fromCharCode(pressedKey);

            const regex = /[۰-۹]/g;
            let result = str.replace(regex, function (w) {
                    return String.fromCharCode(w.charCodeAt(0) - 1728)
                }
            );
            el.value = result;
            console.log(el.value);
        });
    }
};