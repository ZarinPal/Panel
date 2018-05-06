const Clipboard = require('clipboard');

module.exports = {
    bind(el, binding, vnode, oldVnode) {
        new Clipboard(el);
    }
};
