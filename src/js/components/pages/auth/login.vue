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
                form(@submit.prevent="sendOtp('ussd')" v-if="step == 1" action="#" onsubmit="event.preventDefault();")
                    div.row.middle-xs
                        div.col-xs-12.no-margin.body-messages
                            div.col-lg-12.ta-right
                                p {{ $i18n.t('user.loginToUserAccount') }}
                                span {{ $i18n.t('user.forUseHaveToLogin') }}
                        div.col-xs-12.no-margin
                            input.ta-left.dir-ltr(:class="{'input-danger': validationErrors.username}" type="text" v-model="username" placeholder="شماره موبایل" autofocus)
                            div.ta-right(v-if="validationErrors.username")
                                span.text-danger {{ $i18n.t(validationErrors.username) }}

                        div.row.nav-user-not-registered(v-if="userNotRegister")
                            router-link.col-xs( tag="div" v-bind:to="{ name: 'auth.register', params:{mobile: username}}") {{ $i18n.t('flash.you-are-not-register-yet') }}
                            span.close(@click="userNotRegister = false")

                    div.row.bottom-xs
                        div.col-xs.no-margin.ta-right
                            span {{ $i18n.t('user.notRegistered') }}
                            router-link.link(v-bind:to="{ name: 'auth.register',params:{refererId:this.$route.params.refererId}}") {{ $i18n.t('user.register') }}
                        div.col-xs.no-margin
                            button.gold.pull-left(id="btnSubmitEnter") {{$i18n.t('user.enter')}}
                                svg.material-spinner(v-if="getOtpLoading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                    circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")


                <!--Second step call ussd code-->
                form(method="post" @submit.prevent="login" v-if="step == 2" onsubmit="event.preventDefault();")
                    div.row.middle-xs
                        div.col-xs-12.no-margin.body-messages
                            <!--Ussd Call header-->
                            div.row.ta-right
                                div
                                    img.user-avatar(v-bind:src="avatar")
                                div.col-xs
                                    p {{ $i18n.t('user.yourWelcome') }}
                                    span(v-if="channel == 'ussd'")
                                        span کد دستوری زیر را توسط شماره موبایل
                                        span.mobile-number {{ username | persianNumbers}}
                                        span شماره گیری کنید.
                                        span.change-mobile(@click="step--") (تغیر شماره تلفن)
                            <!--Ussd Box-->
                            div.row.ussd-box.no-margin(v-if="channel == 'ussd'")
                                div
                                    span.icon-qr(v-if="ussdType =='Code'" @click="changeUssdType()")
                                    span.icon-ussd-text(v-if="ussdType =='Qr'" @click="changeUssdType()")
                                        span *
                                        span.laugh :)
                                        span #

                                div.col-xs
                                    div.ussd-text.persian-num(v-if="ussdType =='Code'") {{ussdCode}}
                                    img.qr-image(v-if="ussdType =='Qr'" v-bind:src="qrCodeSrc")


                        div.col-xs-12.no-margin.dir-ltr
                            input.input-cell(v-validate="{size: 1, type: 'number'}" :class="{'input-danger': validationErrors.otp}" type="text"  v-model="otpObject[0]"  size="1" @keyup="changeFocus(this)" id="otp1" maxlength="1" autofocus)
                            input.input-cell(v-validate="{size: 1, type: 'number'}" :class="{'input-danger': validationErrors.otp}" type="text"  v-model="otpObject[1]"  size="1" @keyup="changeFocus(this)" id="otp2" maxlength="1")
                            input.input-cell(v-validate="{size: 1, type: 'number'}" :class="{'input-danger': validationErrors.otp}" type="text"  v-model="otpObject[2]"  size="1" @keyup="changeFocus(this)" id="otp3" maxlength="1")
                            input.input-cell(v-validate="{size: 1, type: 'number'}" :class="{'input-danger': validationErrors.otp}" type="text"  v-model="otpObject[3]"  size="1" @keyup="changeFocus(this)" id="otp4" maxlength="1")
                            input.input-cell(v-validate="{size: 1, type: 'number'}" :class="{'input-danger': validationErrors.otp}" type="text"  v-model="otpObject[4]"  size="1" @keyup="changeFocus(this)" id="otp5" maxlength="1")
                            input.input-cell(v-validate="{size: 1, type: 'number'}" :class="{'input-danger': validationErrors.otp}" type="text"  v-model="otpObject[5]"  size="1" @keyup="changeFocus(this)" id="otp6" maxlength="1")
                        div.ta-right(v-if="validationErrors.otp")
                            span.text-danger {{ $i18n.t(validationErrors.otp) }}

                    div.row.bottom-xs
                        div.col-xs.no-margin.ta-right
                            span.link(v-if="!visibleOtpTimer && visibleSendSms" v-on:click.prevent="sendOtp('sms')") {{ $i18n.t('user.sendCodeBySms') }}
                            timer(v-if="visibleOtpTimer" v-bind:seconds="$store.state.auth.otpTime" v-on:onFinished="finishTimer")

                        div.col-xs.no-margin
                            button.gold.pull-left(id="btnSubmitLogin") {{$i18n.t('user.enter')}}
                                svg.material-spinner(v-if="loginLoading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                    circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

            <!--Privacy Policy-->
            div.row.auth-privacy-footer
                div.col-xs.ta-right
                    span.icon-prev
                    router-link.link(v-bind:to="{ name: 'auth.register',params:{refererId:this.$route.params.refererId}}") {{$i18n.t('user.register')}}
                div.col-xs.ta-left
                    a.link(href="https://www.zarinpal.com/terms.html" target="blank") {{$i18n.t('user.rulesAndRegulations')}}
                    span.gap
                    a.link(href="https://www.zarinpal.com/policy.html" target="blank") {{$i18n.t('user.privacy')}}


    div(v-else)
        div.loading.ta-center
            div.spinner


</template>

<script>
    import timer from '../../pages/partials/timer.vue';

    export default {
        name: 'auth-login',
        data () {
            return {
                getOtpLoading: false,
                loginLoading: false,
                ussdType: 'Code',
                username: "",
                otpObject: {},
                step: 1,
                avatar: null,
                channel: null,
                ussdCode: null,
                qrCodeSrc: null,
                userNotRegister: false,
                visibleOtpTimer: false,
                visibleSendSms: true
            }
        },
        computed:{
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
            otp() {
                if(this.otpObject) {
                    return this.otpObject[0] +
                        this.otpObject[1] +
                        this.otpObject[2] +
                        this.otpObject[3] +
                        this.otpObject[4] +
                        this.otpObject[5];
                }
            }
        },
        mounted(){
            if(this.$route.query.mobile){
                thisg.username = this.$route.query.mobile;
            }
        },
        created() {
            if(this.$store.state.auth.check) {
                this.$router.push({name: 'home.index'});
            }
        },
        methods: {
            sendOtp(channel){
                this.getOtpLoading = true;
                let postData = {
                    username: this.username,
                };
                if(channel && channel === 'sms'){
                    postData.channel = channel;
                    this.visibleOtpTimer = true;
                    this.otpObject = {};
                }

                this.$store.state.http.requests['oauth.postInitializeLogin']
                    .save(postData)
                    .then((response)=>{
                        this.getOtpLoading = false;
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
                        this.getOtpLoading = false;
                        store.commit('setValidationErrors',response.data.validation_errors);

                        if(!this.validationErrors.username) {
                            this.userNotRegister = true;
                        }
                    });
            },
            login(event){
                if(!this.otp) {
                    store.commit('flashMessage',{
                        text: 'otp not valid',
                        important: false,
                        type: 'danger'
                    });
                    return;
                }

                this.loginLoading = true;
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
                        this.loginLoading = false;
                        this.$store.commit('app/loading');
                        let vm = this;
                        this.$store.dispatch('auth/fetch',
                            () => {
                                vm.$store.commit('app/ready');

                                if(vm.$route.params.refererId) {
                                    if(vm.$route.params.refererId === 'telegram-payment') {
                                        TelegramGameProxy.paymentFormSubmit({
                                            credentials: {type: "card", token: vm.$store.state.auth.user.public_id},
                                            title: 'zp.' + vm.$store.state.auth.user.public_id
                                        });
                                    } else {
                                        vm.$store.commit('app/setRefererId', vm.$route.params.refererId);
                                        vm.$router.push({name: 'telegram.referer'});
                                    }

                                } else {
                                    vm.$router.push({name: 'home.index'});
                                }
                            }
                        );
                    },
                    (response) => {
                        this.loginLoading = false;
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
            },
            finishTimer() {
                this.visibleOtpTimer = false;
                this.visibleSendSms = false;
                this.channel = 'ussd';
            },
            changeFocus(){
                let target = event.srcElement;
                let myLength = target.value.length;
                let currentId = target.id;
                currentId = currentId.substr(currentId.length - 1);
                if(currentId <= 5) {
                    let nextElement = target.nextSibling.id;
                    if (myLength >= 1) {
                        document.getElementById(nextElement).focus();
                    }
                }

                /*** submit form in last digit insert ***/
                if(currentId == 6) {
                    document.getElementById("btnSubmitLogin").click();
                }
            }
        },
        components:{
            timer
        }
    }

</script>