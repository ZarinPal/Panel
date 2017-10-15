export default {

    handle(attributes) {
        // let validationClass = this;
        // _.forEach(attributes, function(parameters, methodName) {
        //     validationClass[methodName](parameters);
        // });

        return this.isEmpty(attributes);
    },

    /**
     * @param input
     * @returns {boolean}
     */
    required() {
        if (!attributes.input) {
            console.log('not input');
            return;
        }
        console.log('input is valid');
        return false;
    },


    // minLength(attributes) {
    //     if (!attributes.input) {
    //         return 'min length is' + attributes.length;
    //     }
    //
    //     let inputLength = attributes.input.length;
    //     if (inputLength >  attributes.length) {
    //         return 'min length is' +  attributes.length;
    //     }
    //     return true;
    // },
    //
    //
    // maxLength(attributes) {
    //     if (!attributes.input) {
    //         return 'max length is' + attributes.length;
    //     }
    //
    //     let inputLength = attributes.input.length;
    //     if (inputLength >  attributes.length) {
    //         return 'max length is' +  attributes.length;
    //     }
    //     return true;
    // }
}