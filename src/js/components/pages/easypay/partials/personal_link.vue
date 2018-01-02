<template lang="pug">
    modal.request-personal-link(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('user.requestPersonalLinkTitle') }}
        div(slot="content")
            <!--if not set username-->
            form(v-if="!user.username" autocomplete="off" onsubmit="event.preventDefault();")

                div.row.no-margin.end-xs
                    div.col-xs-12.col-md-6.col-lg-6.col-sm-12.no-margin.ta-right(v-if="checking")
                        span.dis-ib.checking-loading
                            loading(v-bind:width="15" v-bind:height="15")
                        span.checking-text {{$i18n.t('user.checkingUsername')}}
                    div.col-xs-12.no-margin.ta-right(v-if="!checking")
                        span.free-username(v-if="usable") {{$i18n.t('user.youCanUserThisUsername')}}
                    div.col-xs-12.col-md-6.col-lg-6.col-sm-12.no-margin
                        div.row.input-group.no-margin.full-width(:class="{'input-danger': errors.has('username')}")
                            div.col-xs.no-margin
                                input.input.ltr-input(@keyup="validateForm" v-validate="{ rules: {required: true, min: 5, max: 20, alpha_num: true}}"  v-bind:data-vv-as="$i18n.t('user.username')"   type="text" v-model="username"  name="username"  :placeholder="$i18n.t('user.username')")
                            div.no-margin.first-label
                                span {{preLink}}
                        span.text-danger {{ errors.first('username') }}
                        div.col-xs-12.no-margin.ta-right(v-if="!checking")


                        div.col-xs-12.no-margin.ta-right(v-if="error_message")
                            span.text-danger {{$i18n.t('flash.' + error_message)}}


                div.row.no-margin
                    div.col-xs.nav-buttons
                        button.btn.success.pull-left(v-ripple="" @click="validateForm('Save')" tabindex="3") {{$i18n.t('common.request')}}
                            svg.material-spinner(v-if="requesting" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

            <!--if username set-->
            div(v-else)
                div.col-xs-12.no-margin
                    span لینک شخصی  :
                    a(:href="preLink + user.username") {{ preLink + user.username}}

</template>


<script>
    import modal from '../../partials/modal.vue';
    import loading from '../../partials/loading.vue';

    export default {
        name: 'personal-link',
        data() {
            return {
                preLink: 'https://Zarinp.al/@',
                requesting: false,
                checking: false,
                usable: false,
                username: null,
                error_message: null,
            }
        },
        computed: {
            user() {
                return this.$store.state.auth.user;
            }
        },
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
            validateForm(request) {
                this.$validator.validateAll({
                    username: this.username,
                }).then((result) => {
                    if (result) {
                        this.checkUsername(request);
                    }
                });
            },
            closeModal() {
                this.$emit('closeModal');
            },
            checkUsername(request) {
                if (this.username.length >= 5 && this.errors.items.length == 0) {
                    this.checking = true;
                    let usernameData = {
                        username: this.username,
                        check: true
                    };
                    if (this.usable && request && request === 'Save') {
                        usernameData.check = false;
                    }

                    this.requestUsername(usernameData);
                } else {
                    this.usable = false;
                    store.commit('clearValidationErrors');
                }
            },
            requestUsername(usernameData) {
                this.$store.state.http.requests['user.postUsername'].save(usernameData).then(
                    () => {
                        this.usable = true;
                        this.checking = false;
                        if (!usernameData.check) {
                            this.requesting = true;

                            //update user store
                            this.$store.state.auth.user.username = this.username;
                            this.$store.commit('flashMessage', {
                                text: 'username created',
                                type: 'success'
                            });
                        }
                    },
                    (response) => {
                        this.usable = false;
                        this.checking = false;
                        store.commit('setValidationErrors', response.data.validation_errors);
                        if (response.data.meta.error_type == 'UserUserNameFixLate') {
                            this.error_message = _.kebabCase(response.data.meta.error_message)
                        }
                    }
                );
            }
        },
        components: {
            modal,
            loading
        }
    };
</script>