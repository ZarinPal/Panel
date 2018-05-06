export default {
  bind(el, binding, vnode) {

    // el.addEventListener('keypress', function (event) {
    //     if (event.key < 48 || event.key > 57) {
    //     } else {
    //         console.log('not valid number');
    //         event.preventDefault();
    //     }
    // });
    /** ---------------
     *      Keyup
     ----------------**/
    el.addEventListener('keyup', function(event) {
      /** ---------------
       Money
       ----------------**/
      Vue.nextTick(function() {
        if (binding.value.money && el.value) {
          let input = el.value.replace(/,/g, '');
          if (/^[0-9]*$/.test(input)) {
            let number = parseInt(el.value.replace(/\D/g, ''), 10);
            el.value = number.toLocaleString();
          }
        }
      });
    });
  },
};