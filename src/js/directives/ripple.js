export default {
    bind(el, binding, vnode, oldVnode) {
        el.addEventListener('mousedown', function (e) {
            let currentElement = el;
            currentElement.style.position ="relative";
            currentElement.style.overflow ="hidden";

            let elementRipple = document.createElement("div");
            elementRipple.classList.add('ripple-effect');

            let elementSize;
            if(currentElement.offsetWidth >= currentElement.offsetHeight) {
                elementSize = currentElement.offsetWidth;
            } else {
                elementSize = currentElement.offsetHeight;
            }

            let currentElementPosition = currentElement.getBoundingClientRect();

            let x = e.pageX - (currentElementPosition.left  + (elementSize/2));
            let y =  e.pageY - (currentElementPosition.top + (elementSize/2));

            elementRipple.style.width = elementSize +'px';
            elementRipple.style.height = elementSize +'px';
            elementRipple.style.top = y + "px";
            elementRipple.style.left = x + "px";

            currentElement.appendChild(elementRipple);

            elementRipple.addEventListener("animationend", function(){
                currentElement.removeChild(elementRipple);
            });

        });
    }
};