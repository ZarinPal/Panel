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
                form(method="post" @submit.prevent="sendOtp('ussd')" v-if="step == 1" action="#" onsubmit="event.preventDefault();" autocomplete)
                    div.row.middle-xs
                        div.col-xs-12.no-margin.body-messages
                            div.col-lg-12.ta-right
                                p {{ $i18n.t('user.loginToUserAccount') }}
                                span {{ $i18n.t('user.forUseHaveToLogin') }}
                        div.col-xs-12.no-margin
                            input.ta-left.dir-ltr(:class="{'input-danger': validationErrors.username}" type="text" v-model="username" placeholder="موبایل یا ایمیل" autofocus autocomplete)
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
                                    span(v-else-if="channel == 'email'")
                                        span رمز یکبار مصرف ارسال شده به ایمیل خود را وارد کنید
                                    span(v-else-if="channel == 'sms'")
                                        span رمز یکبار مصرف ارسال شده به  خود را وارد کنید

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
                            input.input-cell(v-validate="{type: 'number', size: '1'}" type="number"  v-model="otpObject[0]"  size="1" @keyup="changeFocus($event)" id="otp1" onfocus="this.select();")
                            input.input-cell(v-validate="{type: 'number', size: '1'}" type="number"  v-model="otpObject[1]"  size="1" @keyup="changeFocus($event)" id="otp2" onfocus="this.select();")
                            input.input-cell(v-validate="{type: 'number', size: '1'}" type="number"  v-model="otpObject[2]"  size="1" @keyup="changeFocus($event)" id="otp3" onfocus="this.select();")
                            input.input-cell(v-validate="{type: 'number', size: '1'}" type="number"  v-model="otpObject[3]"  size="1" @keyup="changeFocus($event)" id="otp4" onfocus="this.select();")
                            input.input-cell(v-validate="{type: 'number', size: '1'}" type="number"  v-model="otpObject[4]"  size="1" @keyup="changeFocus($event)" id="otp5" onfocus="this.select();")
                            input.input-cell(v-validate="{type: 'number', size: '1'}" type="number"  v-model="otpObject[5]"  size="1" @keyup="changeFocus($event)" id="otp6" onfocus="this.select();")
                        div.ta-right(v-if="validationErrors.otp")
                            span.text-danger {{ $i18n.t(validationErrors.otp) }}

                    div.row.bottom-xs
                        div.col-xs.no-margin.ta-right
                            span.link(v-if="!visibleOtpTimer && visibleSendSms && channel !== 'email'" v-on:click.prevent="sendOtp('sms')") {{ $i18n.t('user.sendCodeBySms') }}
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
        },
        mounted(){
            if(this.$route.query.mobile){
                this.username = this.$route.query.mobile;
            }
        },
        created() {
            if(this.$store.state.auth.check) {
                this.$router.push({name: 'home.index'});
            }
        },
        methods: {
            sendOtp(channel){
                let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                //if username is email
                if(emailRegex.test(this.username)) {
                    channel = 'email';
                }

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

                        if(channel && channel === 'sms'){
                            store.commit('flashMessage', {
                                text: 'otp-sent-by-sms',
                                type: 'success',
                                timeout: 10000,
                            });
                        }else if(channel === 'email') {
                            store.commit('flashMessage', {
                                text: 'otp-send-to-you-by-email',
                                type: 'success',
                                timeout: 10000,
                            });
                        }

                        setTimeout(function () {
                            document.getElementById("otp1").focus();
                        }, 10);
                    }).catch((response)=>{
                        this.loginLoading = false;
                        this.getOtpLoading = false;
                        store.commit('setValidationErrors',response.data.validation_errors);
                        if(!this.validationErrors.username) {
                            this.userNotRegister = true;
                        }
                        this.emptyOtp();
                });
            },
            login(){
                this.loginLoading = true;

                let otp = this.otpObject[0] +
                    this.otpObject[1] +
                    this.otpObject[2] +
                    this.otpObject[3] +
                    this.otpObject[4] +
                    this.otpObject[5];

                let auth2Data = {
                    grant_type: "password",
                    client_id: "panel-client",
                    client_secret: "55619f94-75d6-4078-9478-16e9654c2105",
                    scope: "full-access",
                    username: this.username,
                    otp: otp,
                    is_web_app: true
                };

                this.$store.state.http.requests['oauth.postIssueAccessToken'].save(auth2Data).then(
                    () => {
                        this.loginLoading = false;
                        this.$store.commit('app/loading');
                        let vm = this;
                        this.$store.dispatch('auth/fetch',
                            () => {
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
                    }, (response) => {
                        this.emptyOtp();
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
            changeFocus(event){
                let myLength = event.target.value.length;
                let currentId = event.target.id;
                currentId = currentId.substr(currentId.length - 1);

                //back to prev input on backspace
                if(event.keyCode === 8) {
                    if(currentId >= 1) {
                        document.getElementById(event.target.id).value = null;
                        if(currentId >1) {
                            let prevElement = event.target.previousSibling.id;
                            if(currentId <= 5) {
                                this.otpObject[currentId-2] = null;
                            }
                            document.getElementById(prevElement).focus();
                        }
                    }
                }

                if(currentId <= 5) {
                    let nextElement = event.target.nextSibling.id;
                    if (myLength >= 1) {
                        document.getElementById(nextElement).focus();
                    }
                }

                /*** submit form in last digit insert ***/
                if(currentId == 6 && event.keyCode !== 8) {
                    document.getElementById("btnSubmitLogin").click();
                }
            },
            emptyOtp() {
                for(let i = 0; i <= 5; i++) {
                    this.otpObject[i] = null;
                }

                if(document.getElementById('otp1')) {
                    document.getElementById('otp1').focus();
                }
            },
        },
        components:{
            timer
        }
    }

</script>