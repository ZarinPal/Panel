import Vue from "vue";
Vue.mixin({
    methods: {
        validation(name) {
            if (this.$store.state.alert.validationErrors[name]) {
                let element = _.find(this.$validator.fields.items, function (field) {
                    return field.name == name;
                });
                this.errors.add(
                    name,
                    this.$validator.dictionary.container.fa.messages[this.$store.state.alert.validationErrors[name].rule](
                        element.el.dataset.vvAs,
                        this.$store.state.alert.validationErrors[name].params
                    ),
                    'api'
                );
                this.$store.state.alert.validationErrors[name] = false;
            }
            return this.errors.has(name);
        },
        removeErrors(field) {
            !!this[field] && this.errors.remove(field);
        },
    }
});