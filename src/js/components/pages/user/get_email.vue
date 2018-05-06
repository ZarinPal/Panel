<template lang="pug">
    modal.request-personal-link(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('user.setEmailTitle') }}
        div.get-email-from-user(slot="content")
            div.row(v-if="user.user_progress.email.check")
                div.col-xs.ta-right
                    span.label {{ $i18n.t('common.email') }}
                div.col-xs.ta-left
                    span.value {{ user.email }}

            form(v-else autocomplete="on" onsubmit="event.preventDefault();")
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
                email: this.$store.state.auth.user.email,
                loading: false,
            }
        },
        computed: {
            user() {
                return this.$store.state.auth.user;
            },
        },
        methods: {
            closeModal() {
                this.$emit('closeModal');
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
                        this.$store.state.auth.user.user_progress.email.check = false;
                        this.$store.state.auth.user.user_progress.points = parseInt(
                                this.$store.state.auth.user.user_progress.points) - 15;

                        this.$store.commit('flashMessage', {
                            text: 'UserEmailSetSuccessCheckYourEmailLocal',
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