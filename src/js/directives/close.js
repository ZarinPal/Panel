export default {
    bind(el, binding, vnode) {
        document.addEventListener('click', function(event) {
            let classes = vnode.elm.className;
            if(vnode.elm.childElementCount === 1 && classes.includes('selectbox')){
                console.log(vnode);
            }

            return;
            let isClickInside = el.contains(event.target);
            if (!isClickInside) {
               console.log('click outside');
            }
       });
    }
};