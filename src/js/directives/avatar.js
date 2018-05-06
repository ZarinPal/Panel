export default {
    bind(el, binding, vnode) {
        el.onerror = function () {
            el.src = 'https://gravatar.com/avatar/5ce2a4c02dd7b1d90aafad08e67390ba?r=g&d=mm';
        };
    }
};