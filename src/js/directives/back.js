export default {
    bind(el, binding, vnode) {
        el.addEventListener('click', function (event) {
            window.history.back();
        });
    }
};