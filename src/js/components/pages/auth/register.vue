<template lang="pug">
    div.row.center-xs.no-margin(v-if="$store.state.app.isLoaded")
        div.col-xs-11.col-sm-11.col-md-5.col-lg-4.section.auth-box
            div.box
                <!--Header-->
                div.row.top-xs
                    div.logo
                <!--Body-->

                form(action="#" method="post" onsubmit="event.preventDefault();")
                    div.row.middle-xs
                        div.col-xs-12.no-margin.body-messages
                            div.col-lg-12.ta-right
                                p {{ $i18n.t('user.register') }}

                    div.row.row-margin
                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.no-right-margin
                            input.half-input(v-focus="" v-validate="'required'" :class="{'input-danger': errors.has('first_name')}"  v-bind:data-vv-as="$i18n.t('user.firstName')" type="text" name="first_name" v-model="first_name" id="first_name" :placeholder= "$i18n.t('user.firstName')"  autofocus tabindex="1" )
                            div.ta-right(v-if="validation('first_name')")
                                span.text-danger {{ errors.first('first_name') }}

                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.no-right-margin
                            input.half-input(v-validate="'required'" :class="{'input-danger': errors.has('last_name')}" v-bind:data-vv-as="$i18n.t('user.lastName')" type="text" v-model="last_name" id="last_name" name="last_name" :placeholder= "$i18n.t('user.lastName')" tabindex="2" )
                            div.ta-right(v-if="validation('last_name')")
                                span.text-danger {{ errors.first('last_name') }}

                        div.row.row-margin.col-lg-12.col-md-12.col-sm-12.col-xs-12.no-right-margin
                            input.half-input(v-validate="{rules: {required: true, regex: /^09[0-9]{9}$/} }" :class="{'input-danger': errors.has('mobile')}"  v-bind:data-vv-as="$i18n.t('user.mobile')" type="text" v-model="mobile" id="mobile" name="mobile" :placeholder= "$i18n.t('user.mobile')" tabindex="3" )
                            div.ta-right(v-if="validation('mobile')")
                                span.text-danger {{ errors.first('mobile') }}

                    div.row.bottom-xs
                        div.col-xs.no-margin.ta-right
                            span عضو زرین‌پال هستید ؟
                            router-link.link(v-bind:to="{ name: 'auth.login',params:{referrerId:this.$route.params.referrerId}}") {{ $i18n.t('user.enter') }}
                        div.col-xs.no-margin
                            div#recaptcha.g-recaptcha(data-sitekey="6LcDpDcUAAAAAMiXOz1gA3By9oEJ4-PYqct1Ihn5", data-size="invisible")
                            button.gold.pull-left(id="register" @click="validateForm"  tabindex="4") {{$i18n.t('user.register')}}
                                svg.material-spinner(v-if="requesting" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                    circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")


            <!--Privacy Policy-->
            div.row.auth-privacy-footer
                div.col-xs.ta-right
                    a.link(href="http://zarinpal.com") {{$i18n.t('user.backToHomePage')}}
                div.col-xs.ta-left
                    a.link(href="https://www.zarinpal.com/terms.html" target="blank") {{$i18n.t('user.rulesAndRegulations')}}
</template>
<script>
    export default {
        name: 'auth-register',
        data () {
            return {
                first_name: "",
                last_name: "",
                mobile: "",
                g_recaptcha: "1",
                requesting: false,
            }
        },
        computed: {
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
        },
        created() {
            if (this.$route.params.mobile) {
                this.mobile = this.$route.params.mobile;
            }

            if (this.$store.state.auth.check) {
                this.$router.push({name: 'home.index'});
            }
            if (this.$route.query.referrer) {
                localStorage.setItem('zp_referrer',
                    JSON.stringify({
                        referrer: this.$route.query.referrer,
                        expire_in: moment().add(3, 'day').unix()
                    }));
            }
        },
        mounted(){
            let vm = this;
            //Load google map script tag
            let tag = document.createElement("script");
            tag.src = "https://www.google.com/recaptcha/api.js";
            document.getElementsByTagName("head")[0].appendChild(tag);
        },
        methods: {
            validateForm() {
                grecaptcha.execute();
                this.g_recaptcha = grecaptcha.getResponse();
                this.$validator.validateAll({
                    first_name: this.first_name,
                    last_name: this.last_name,
                    mobile: this.mobile
                }).then((result) => {
                    if (result) {
                        this.register();
                    }
                });
            },
            register(){
                this.requesting = true;
                let auth2Data = {
                    first_name: this.first_name,
                    last_name: this.last_name,
                    mobile: this.mobile,
                    g_recaptcha: this.g_recaptcha,
                };
                if (this.$route.query.referrer) {
                    auth2Data.referrer = atob(this.$route.query.referrer);
                    localStorage.setItem('zp_referrer', {
                        referrer: auth2Data.referrer,
                        expire_in: moment().add(3, 'day').unix()
                    });
                } else {
                    let referrerObj = JSON.parse(localStorage.getItem('zp_referrer'));
                    if (referrerObj && referrerObj.expire_in > moment().unix()) {
                        auth2Data.referrer = atob(referrerObj.referrer);
                    }
                }

                this.$store.state.http.requests['oauth.PostRegisterUser'].save(auth2Data).then(
                    response => {
                        store.commit('flashMessage', {
                            text: 'OauthSuccessRegisterLocal',
                            type: 'success',//optional
                        });
                        this.$router.push({
                            name: 'auth.login',
                            query: {
                                mobile: this.mobile
                            }
                        });
                        this.requesting = false;
                    }, (response) => {
                        this.requesting = false;
                        store.commit('setValidationErrors', response.data.validation_errors);
                        store.commit('flashMessage', {
                            text: response.data.meta.error_type,
                            type: 'danger',
                        });
                    }
                );
            }
        },
    }
</script>
