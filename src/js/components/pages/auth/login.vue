<template lang="pug">
    div.row.center-xs.no-margin(v-if="$store.state.app.isLoaded")
        div.col-xs-11.col-sm-11.col-md-5.col-lg-4.section.auth-box
            div.box
                <!--Header-->
                div.row.top-xs
                    span.zp-icon
                    span.zp-title {{ $i18n.t('common.zarinPal') }}

                <!--Body-->
                <!--First step enter mobile-->
                form(method="post" @submit.prevent="sendOtp('ussd')" v-if="step == 1")
                    div.row.middle-xs
                        div.col-xs-12.no-margin.body-messages
                            div.col-lg-12.ta-right
                                p {{ $i18n.t('user.loginToUserAccount') }}
                                span {{ $i18n.t('user.forUseHaveToLogin') }}
                        div.col-xs-12.no-margin
                            input(:class="{'input-danger': validationErrors.username}" type="text" v-model="username" placeholder="شماره موبایل")
                            div.ta-right(v-if="validationErrors.username")
                                span.text-danger {{ $i18n.t(validationErrors.username) }}


                    div.row.bottom-xs
                        div.col-xs.no-margin.ta-right
                            span {{ $i18n.t('user.notRegistered') }}
                            router-link.link(tag="span" v-bind:to="{ name: 'auth.register'}") {{ $i18n.t('user.register') }}
                        div.col-xs.no-margin
                            button.gold.pull-left {{$i18n.t('user.enter')}}

                <!--Second step call ussd code-->
                form(method="post" @submit.prevent="login"  v-if="step == 2")
                    div.row.middle-xs
                        div.col-xs-12.no-margin.body-messages
                            <!--Ussd Call header-->
                            div.row.ta-right
                                div
                                    img.user-avatar(v-bind:src="avatar")
                                div.col-xs
                                    p {{ $i18n.t('user.yourWelcome') }}
                                    span(v-if="channel == 'ussd'") {{ $i18n.t('user.callBelowUssdCode') }}

                            <!--Ussd Box-->
                            div.row.ussd-box(v-if="channel == 'ussd'")
                                div
                                    span.icon-qr(v-if="ussdType =='Code'" @click="changeUssdType()")
                                    span.icon-ussd-text(v-if="ussdType =='Qr'" @click="changeUssdType()")
                                        span *
                                        span.laugh :)
                                        span #

                                div.col-xs
                                    div.ussd-text.persian-num(v-if="ussdType =='Code'") {{ussdCode}}
                                    img.qr-image(v-if="ussdType =='Qr'" v-bind:src="qrCodeSrc")


                        div.col-xs-12.no-margin
                            input(:class="{'input-danger': validationErrors.otp}" type="text"  v-model="otp" placeholder="رمز یکبار مصرف")
                            div.ta-right(v-if="validationErrors.otp")
                                span.text-danger {{ $i18n.t(validationErrors.otp) }}

                    div.row.bottom-xs
                        div.col-xs.no-margin.ta-right
                            span.link(v-on:click.prevent="sendOtp('sms')") {{ $i18n.t('user.sendCodeBySms') }}
                        div.col-xs.no-margin
                            button.gold.pull-left {{$i18n.t('user.enter')}}


            <!--Privacy Policy-->
            div.row.auth-privacy-footer
                div.col-xs.ta-right
                    span.icon-prev
                    router-link.link(tag="span" v-bind:to="{ name: 'auth.register'}") {{$i18n.t('user.register')}}
                div.col-xs.ta-left
                    a.link(href="https://www.zarinpal.com/terms.html" target="blank") {{$i18n.t('user.rulesAndRegulations')}}
                    span.gap
                    a.link(href="#" target="blank") {{$i18n.t('user.privacy')}}


</template>

<script>
    export default {
        name: 'auth-login',
        data () {
            return {
                ussdType: 'Code',
                username: "",
                otp: "",
                step: 1,
                avatar: null,
                channel: null,
                ussdCode: null,
                qrCodeSrc: null,
            }
        },
        computed:{
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            }
        },
        mounted(){
            if(this.$route.query.mobile){
                this.username = this.$route.query.mobile;
            }
        },
        methods: {
            sendOtp(channel){

                let postData = {
                    username: this.username,
                };
                if(channel && channel === 'sms'){
                    postData.channel = channel;
                }

                this.$store.state.http.requests['oauth.postInitializeLogin']
                    .save(postData)
                    .then((response)=>{
                        this.step = 2;
                        this.avatar = 'https:'+response.data.data.avatar;
                        this.channel = response.data.data.channel;
                        if(response.data.data.ussd_code) {
                            this.ussdCode = response.data.data.ussd_code;
                        }

                        if(channel && channel !== 'ussd'){
                            store.commit('flashMessage', {
                                text: 'otp-sent',
                                type: 'success'
                            });
                        }
                    }).catch((response)=>{
                    store.commit('setValidationErrors',response.data.validation_errors);
                    store.commit('flashMessage', {
                        text: response.data.meta.error_message,
                        type: 'danger'
                    });
                });

            },
            login(event){
                let auth2Data = {
                    grant_type: "password",
                    client_id: "panel-client",
                    client_secret: "55619f94-75d6-4078-9478-16e9654c2105",
                    scope: "full-access",
                    username: this.username,
                    otp: this.otp,
                    is_web_app: true
                };
                this.$store.state.http.requests['oauth.postIssueAccessToken'].save(auth2Data).then(
                    () => {
                        this.$store.commit('app/loading');
                        let vm = this;
                        this.$store.dispatch('auth/fetch',
                            () => {
                                vm.$store.commit('app/ready');
                                vm.$router.push({name: 'home.index'});
                            }
                        );
                    },
                    (response) => {
                        store.commit('setValidationErrors',response.data.validation_errors);
                        store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            important: false,
                            type: 'danger'
                        });
                    }
                );
            },
            changeUssdType() {
                if(this.ussdType === 'Code') {
                   this.ussdType = 'Qr';
                    let ussdCode = this.ussdCode.substring(0, this.ussdCode.length - 1);
                    this.qrCodeSrc = 'https://chart.apis.google.com/chart?cht=qr&chs=150x150&chld=L&choe=UTF-8&chl=tel:' + ussdCode + '%2523';
                } else {
                    this.ussdType = 'Code';
                }
            }
        },
    }

</script>