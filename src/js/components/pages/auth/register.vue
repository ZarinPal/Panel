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
                            input.half-input(v-validate="'required'" :class="{'input-danger': errors.has('first_name')}"  v-bind:data-vv-as="$i18n.t('user.firstName')" type="text" name="first_name" v-model="first_name" id="first_name" :placeholder= "$i18n.t('user.firstName')"  autofocus tabindex="1" )
                            div.ta-right(v-if="validation('first_name')")
                                span.text-danger {{ errors.first('first_name') }}

                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.no-left-margin
                            input.half-input(v-validate="'required'" :class="{'input-danger': errors.has('last_name')}" v-bind:data-vv-as="$i18n.t('user.lastName')" type="text" v-model="last_name" id="last_name" name="last_name" :placeholder= "$i18n.t('user.lastName')" tabindex="2" )
                            div.ta-right(v-if="validation('last_name')")
                                span.text-danger {{ errors.first('last_name') }}

                    div.row.row-margin
                        input.half-input(v-validate="{rules: {required: true, regex: /^09[0-9]{9}$/} }" :class="{'input-danger': errors.has('mobile')}"  v-bind:data-vv-as="$i18n.t('user.mobile')" type="text" v-model="mobile" id="mobile" name="mobile" :placeholder= "$i18n.t('user.mobile')" tabindex="3" )
                        div.ta-right(v-if="validation('mobile')")
                            span.text-danger {{ errors.first('mobile') }}

                    div.row.bottom-xs
                        div.col-xs.no-margin.ta-right
                            span عضو زرین‌پال هستید ؟
                            router-link.link(v-bind:to="{ name: 'auth.login',params:{refererId:this.$route.params.refererId}}") {{ $i18n.t('user.enter') }}
                        div.col-xs.no-margin
                            div#recaptcha.g-recaptcha(data-sitekey="6LcDpDcUAAAAAMiXOz1gA3By9oEJ4-PYqct1Ihn5", data-size="invisible")
                            button.gold.pull-left(id="register" @click="validateForm"  tabindex="4") {{$i18n.t('user.register')}}


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
                first_name: "",
                last_name: "",
                mobile: "",
                g_recaptcha: "1",
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
        },
        mounted(){
            document.getElementById('first_name').focus();

            let vm = this;
            //Load google map script tag
            let tag = document.createElement("script");
            tag.src = "https://www.google.com/recaptcha/api.js";
            document.getElementsByTagName("head")[0].appendChild(tag);
            tag.onload = () => {
                setTimeout(()=>{grecaptcha.execute();},1000);
            };

        },
        methods: {
            validation(name) {
                if (this.$store.state.alert.validationErrors[name]) {
                    this.errors.clear();
                    this.errors.add(name, this.$store.state.alert.validationErrors[name], 'api');
                    this.$store.state.alert.validationErrors[name] = false;
                }
                return this.errors.has(name);
            },
            validateForm() {

                this.g_recaptcha = grecaptcha.getResponse();
                console.log(grecaptcha.getResponse());
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
            register(event){
//                event.preventDefault();
                let auth2Data = {
                    first_name: this.first_name,
                    last_name: this.last_name,
                    mobile: this.mobile,
                    g_recaptcha: this.g_recaptcha,


                };

                if (this.$route.params.refererId) {
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
                        store.commit('setValidationErrors', response.data.validation_errors);
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
