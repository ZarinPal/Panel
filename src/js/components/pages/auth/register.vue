<template lang="pug">
    div.row.center-xs.no-margin(v-if="$store.state.app.isLoaded")
        div.col-xs-11.col-sm-11.col-md-5.col-lg-4.section.auth-box
            div.box
                <!--Header-->
                div.row.top-xs
                    span.zp-icon
                    span.zp-title {{ $i18n.t('common.zarinPal') }}

                <!--Body-->
                form(action="#" method="post" onsubmit="event.preventDefault();")
                    div.row.middle-xs
                        div.col-xs-12.no-margin.body-messages
                            div.col-lg-12.ta-right
                                p {{ $i18n.t('user.register') }}

                    div.row.row-margin
                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.no-right-margin
                            input.half-input(:class="{'input-danger': validationErrors.first_name}" type="text" name="firstName" v-model="firstName" id="firstname" placeholder="نام" autofocus)
                            div.ta-right(v-if="validationErrors.first_name")
                                span.text-danger {{ $i18n.t(validationErrors.first_name) }}

                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.no-left-margin
                            input.half-input(:class="{'input-danger': validationErrors.last_name}" type="text" v-model="lastName" id="lastname" placeholder="نام خانوادگی")
                            div.ta-right(v-if="validationErrors.last_name")
                                span.text-danger {{ $i18n.t(validationErrors.last_name) }}

                    div.row.row-margin
                        input(:class="{'input-danger': validationErrors.mobile}" type="text" v-model="mobile" id="mobile" placeholder="موبایل")
                        div.ta-right(v-if="validationErrors.mobile")
                            span.text-danger {{ $i18n.t(validationErrors.mobile) }}


                    div.row.bottom-xs
                        div.col-xs.no-margin.ta-right
                            span عضو زرین‌پال هستید ؟
                            router-link.link(v-bind:to="{ name: 'auth.login',params:{refererId:this.$route.params.refererId}}") {{ $i18n.t('user.enter') }}
                        div.col-xs.no-margin
                            button.gold.pull-left(id="register" @click="register") {{$i18n.t('user.register')}}


            <!--Privacy Policy-->
            div.row.auth-privacy-footer
                div.col-xs.ta-right
                    a.link(href="http://zarinpal.com") {{$i18n.t('user.backToHomePage')}}
                div.col-xs.ta-left
                    a.link(href="https://www.zarinpal.com/terms.html" target="blank") {{$i18n.t('user.rulesAndRegulations')}}
                    span.gap
                    a.link(href="https://www.zarinpal.com/policy.html" target="blank") {{$i18n.t('user.privacy')}}
</template>
<script>
    export default {
        name: 'auth-register',
        data () {
            return {
                firstName: "",
                lastName: "",
                mobile: "",
            }
        },
        computed:{
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
        },
        created() {
            if(this.$route.params.mobile) {
                this.mobile = this.$route.params.mobile;
            }

            if(this.$store.state.auth.check) {
                this.$router.push({name: 'home.index'});
            }
        },
        methods: {
            register(event){
                event.preventDefault();
                let auth2Data = {
                    first_name: this.firstName,
                    last_name: this.lastName,
                    mobile: this.mobile,
                };

                if(this.$route.params.refererId) {
                    auth2Data.referer = this.$route.params.refererId;
                }

                this.$store.state.http.requests['oauth.PostRegisterUser'].save(auth2Data).then(
                    response => {
                        store.commit('flashMessage', {
                            text: response.data.meta.message,
                            type: 'success',//optional
                        });
                        this.$router.push({
                            name: 'auth.login',
                            query: {
                                mobile: this.mobile
                            }
                        });
                    },
                    (response) => {
                        store.commit('setValidationErrors',response.data.validation_errors);
                        store.commit('flashMessage', {
                            text: response.data.meta.error_message,
                            type: 'danger',
                        });
                    }
                );
            }
        },
        components: {}
    }
</script>
