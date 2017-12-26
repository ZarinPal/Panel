<template lang="pug">
    modal.request-personal-link(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('user.setEmailTitle') }}
        div.get-email-from-user(slot="content")
            div.row
                div.col-xs
                    input(v-focus="" v-validate="{ rules: {required: true, email: true}}" v-bind:data-vv-as="$i18n.t('user.email')" :class="{'input-danger': errors.has('email')}" type="text" v-model="email" name="email" id="email" autofocus tabindex="1" :placeholder="$i18n.t('user.email')")
                    div.ta-right(v-if="validation('email')")
                        span.text-danger {{ errors.first('email') }}

            div.row.buttons
                div.col-xs.no-margin
                    button.btn.success.pull-left(v-ripple="" @click="validateForm") {{$i18n.t('user.setEmailTitle')}}
                        svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                            circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")


</template>


<script>
    import modal from "../partials/modal";
    import loading from "../partials/loading";

    export default {
        name: 'user-get-email',
        data() {
            return {
                email: null,
                loading: false,
            }
        },
        methods: {
            closeModal() {
                this.$emit('closeModal');
            },
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
            validateForm() {
                this.$validator.validateAll({
                    email: this.email,
                }).then((result) => {
                    if (result) {
                        this.postChangeEmail();
                    }
                });
            },
            postChangeEmail() {
                this.loading = true;
                this.$store.state.http.requests['user.changeEmail'].save({email: this.email}).then(
                    () => {
                        this.$store.commit('flashMessage', {
                            text: 'email set success check your email',
                            important: false,
                            type: 'success'
                        });
                        this.closeModal();
                    },
                    (response) => {
                        this.loading = false;
                        store.commit('setValidationErrors', response.data.validation_errors);
                    }
                )
            }
        },
        components: {
            modal,
            loading
        }
    }
</script>