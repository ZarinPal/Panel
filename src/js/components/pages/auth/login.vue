<template lang="pug">
    div.row.center-xs.no-margin
        div.col-xs-12.col-sm-5.col-md-5.col-lg-4.section.auth-box
            div.box
                <!--Header-->
                span.hand.change-login-type(@click="loginByMobileApplication()" v-if="step == 1 && !loginByMobileApp" :title="$i18n.t('user.loginByMobile')")
                span.hand.change-login-type-keybord(@click="loginByMobileApp = !loginByMobileApp"  v-if="loginByMobileApp")
                div.row.top-xs
                    div.logo

                <!--Body-->
                <!--First step enter mobile-->
                form(method="post" @submit.prevent="sendOtp('ussd')" v-if="step == 1 && !loginByMobileApp" action="#" onsubmit="event.preventDefault();" autocomplete)
                    div.row.middle-xs
                        div.col-xs-12.no-margin.body-messages
                            div.col-lg-12.ta-right
                                p {{ $i18n.t('user.loginToUserAccount') }}
                                span {{ $i18n.t('user.forUseHaveToLogin') }}
                        div.col-xs-12.no-margin
                            input.ta-left.dir-ltr(v-focus="" :class="{'input-danger': errors.has('username')}" v-bind:data-vv-as="$i18n.t('user.mobMail')" type="text"  v-model="username" name="username" id="username" :placeholder= "$i18n.t('user.mobMail')" autofocus autocomplete="username" tabindex="1")
                            div.ta-right(v-if="validation('username')")
                                span.text-danger {{ errors.first('username') }}
                            div.ta-right(v-if="lockout_time_min || lockout_time_sec")
                                span.text-danger(v-if="lockout_time_min || lockout_time_sec‌")
                                    span {{ $i18n.t('user.loginLockErrorPart1') }}
                                    span(v-if="lockout_time_min > 0") {{lockout_time_min }} {{ $i18n.t('user.loginLockErrorPart2') }}
                                    span {{lockout_time_sec }} {{ $i18n.t('user.loginLockErrorPart3') }}

                        div.row.nav-user-not-registered(v-if="userNotRegister")
                            router-link.col-xs( tag="div" v-bind:to="{ name: 'auth.register', params:{mobile: username}}") {{ $i18n.t('flash.you-are-not-register-yet') }}
                            span.close(@click="userNotRegister = false")

                    div.row.bottom-xs
                        div.col-xs.no-margin.ta-right
                            span {{ $i18n.t('user.notRegistered') }}
                            router-link.link(v-bind:to="{ name: 'auth.register',params:{refererId:this.$route.params.refererId}}") {{ $i18n.t('user.register') }}
                        div.col-xs.no-margin
                            button.gold.pull-left(id="btnSubmitEnter" :class="{'inactive-step' : lockLogin}") {{$i18n.t('user.enter')}}
                                svg.material-spinner(v-if="getOtpLoading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                    circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

                    div.row.no-margin.ta-right
                <!--Login by mobile app-->
                div.login-by-mobile-app.row.middle-xs(v-if="loginByMobileApp")
                    div.col-xs-12
                        div.col-lg-12.ta-right
                            p {{ $i18n.t('user.loginToUserAccountMobile') }}
                            span {{ $i18n.t('user.loginByMobileApp') }}
                    div.ta-center.no-margin.col-xs
                        img.qr-image(v-if="mobile_socket_uri" :src="'https://chart.apis.google.com/chart?cht=qr&chs=150x150&chld=L&choe=UTF-8&chl=' + mobile_socket_uri")
                        loading(v-else)
                        a.btn-gradient-radius(href="http://www.zarinpal.mobi" target="blank")
                            span.btn-label {{$i18n.t('user.downloadMobileApp')}}

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
                                    span.inline-block(v-if="channel == 'ussd'")
                                        | {{ $i18n.t('user.putUssd') }}
                                        span.mobile-number.persian-num {{ username }}
                                        | {{ $i18n.t('user.call') }}
                                        span.change-mobile(@click="step--") ({{ $i18n.t('user.changeMobile') }})
                                    span(v-else-if="channel == 'email'")
                                        span {{ $i18n.t('user.enterOtpEmail') }}
                                        span.change-mobile(@click="step--") ({{ $i18n.t('user.changeEmail') }})

                                    span(v-else-if="channel == 'sms'")
                                        span {{ $i18n.t('user.enterOtpSms') }}


                            <!--Ussd Box-->
                            div.row.ussd-box.no-margin(v-if="channel == 'ussd'")
                                div
                                    span.icon-qr(v-if="ussdType =='Code'" @click="changeUssdType()")
                                    span.icon-ussd-text(v-if="ussdType =='Qr'" @click="changeUssdType()")
                                        span *
                                        span.laugh :)
                                        span #

                                div.col-xs
                                    div.ussd-text.vazir(v-if="ussdType =='Code'" @click="clipboardMessage(ussdCode)" v-clipboard="" v-bind:data-clipboard-text="ussdCode") {{ussdCode | persianNumbers}}
                                    img.qr-image(v-if="ussdType =='Qr'" v-bind:src="qrCodeSrc")
                            span.hidden-lg.hidden-md(v-if="ussdType =='Qr'") {{ $i18n.t('user.copyUssd') }}

                        div.col-xs-12.no-margin.dir-ltr
                            div.otp-container
                                div.input-cover
                                    input(@input="otpMaxLength" @keypress="preventMaxSize" type="number" min="0" v-model="otp" id="txtOtp")
                                div.dashed-line

                    div.row.bottom-xs
                        div.col-xs.no-margin.ta-right
                            span.link(v-if="!visibleOtpTimer && visibleSendSms && channel !== 'email'" v-on:click.prevent="sendOtp('sms')") {{ $i18n.t('user.sendCodeBySms') }}
                            timer(v-if="visibleOtpTimer" v-bind:seconds="$store.state.auth.otpTime" v-on:onFinished="finishTimer")

                        div.col-xs.no-margin
                            button.gold.pull-left(id="btnSubmitLogin" :class="{'disable': loginLoading}") {{$i18n.t('user.enter')}}
                                svg.material-spinner(v-if="loginLoading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                    circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

            <!--Privacy Policy-->
            div.row.auth-privacy-footer
                div.col-xs.ta-right
                    a.link(href="https://www.zarinpal.com/terms.html" target="blank") {{$i18n.t('user.rulesAndRegulations')}}
</template>

<script>
  import timer from '../../pages/partials/timer.vue';
  import loading from '../../pages/partials/loading.vue';

  export default {
    name: 'auth-login',
    data () {
      return {
        getOtpLoading: false,
        loginLoading: false,
        ussdType: 'Code',
        username: "",
        otp: "",
        otpObject: {},
        step: 1,
        avatar: null,
        channel: null,
        ussdCode: null,
        qrCodeSrc: null,
        userNotRegister: false,
        visibleOtpTimer: false,
        visibleSendSms: true,

        /**
         * login failed date
         */
        lockLogin: false,
        lockout_time_min: null,
        lockout_time_sec: null,

        /**
         * Mobile Login
         */
        loginByMobileApp: false,
        nchanSubscriber: null,
        mobile_expire_in: null,
        mobile_socket_uri: null,
      }
    },
    computed: {
      validationErrors() {
        return this.$store.state.alert.validationErrors;
      }
    },
    mounted(){
      let txtUsername = document.getElementById('username');
      if (txtUsername) {
        txtUsername.focus();
      }
      if (this.$route.query.mobile) {
        this.username = this.$route.query.mobile;
      }
    },
    created() {
      let vm = this;

      /**
       * Automatic login
       */
      this.username = this.$route.params.email;
      this.otp = this.$route.params.otp;

      let oauthCheckParams = {};
      if (this.$route.params.otp && this.$route.params.email) {
        oauthCheckParams = {
          token: this.$route.params.otp,
          email: this.$route.params.email
        };
      }

      this.$store.state.http.requests['oauth.check'].get(oauthCheckParams).then(() => {
        vm.$router.push({name: 'home.index'});
      }).catch(() => {
        vm.$store.commit('app/ready');

        if (this.username && this.otp) {
          this.login();
        }
      });
    },
    methods: {
      sendOtp(channel){
        if (!this.username) {
          store.commit('flashMessage', {
            text: 'MobileOrEmailNull',
            important: false,
            type: 'danger'
          });
          return false;
        }
        let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //if username is email
        if (emailRegex.test(this.username)) {
          channel = 'email';
        }

        this.getOtpLoading = true;
        let postData = {
          username: this.username,
        };
        if (channel && channel === 'sms') {
          postData.channel = channel;
          this.visibleOtpTimer = true;
          this.otpObject = {};
        }

        this.$store.state.http.requests['oauth.postInitializeLogin'].save(postData).then((response) => {
          this.getOtpLoading = false;
          this.step = 2;
          this.avatar = 'https:' + response.data.data.avatar;
          this.channel = response.data.data.channel;
          if (response.data.data.ussd_code) {
            this.ussdCode = response.data.data.ussd_code;
          }

          if (channel && channel === 'sms') {
            store.commit('flashMessage', {
              text: 'OauthOtpSentSmsLocal',
              type: 'success',
              timeout: 10000,
            });
          } else if (channel === 'email') {
            store.commit('flashMessage', {
              text: 'OauthOtpSentEmailLocal',
              type: 'success',
              timeout: 10000,
            });
          }
        }).catch((response) => {
          this.loginLoading = false;
          this.getOtpLoading = false;

          /**
           * lockout_tiem
           */

          if (response.data.meta.error_type === 'UserOtpRateLimit') {
            this.lockLogin = true;
            let duration = response.data.data.lockout_time;
            let minutes, seconds, vm = this;

            let timer = setInterval(function() {
              minutes = parseInt(duration / 60, 10);
              seconds = parseInt(duration % 60, 10);

              vm.lockout_time_min = minutes < 10 ? "0" + minutes : minutes;
              vm.lockout_time_sec = seconds < 10 ? "0" + seconds : seconds;

              if (--duration < 0) {
                clearInterval(timer);
                vm.onFinishedLockTime();
              }
            }, 1000);

          } else {
            store.commit('setValidationErrors', response.data.validation_errors);
            if (!this.validationErrors.username) {
              this.userNotRegister = true;
            }
          }
        });
      },
      login(){

        this.loginLoading = true;
        if (!this.otp || (this.otp && this.otp.length < 6)) {
          store.commit('flashMessage', {
            text: 'InvalidOtp',
            important: false,
            type: 'danger'
          });
          this.loginLoading = false;
          return false;
        }
        let vm = this;
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
              vm.loginLoading = true;
              vm.$router.push({name: 'home.index'});

              if (vm.nchanSubscriber) {
                vm.nchanSubscriber.stop();
              }
            }, (response) => {
              this.loginLoading = false;
              // store.commit('setValidationErrors',response.data.validation_errors);
              store.commit('flashMessage', {
                text: response.data.meta.error_type,
                important: false,
                type: 'danger'
              });
            }
        );

      },
      changeUssdType() {
        if (this.ussdType === 'Code') {
          this.ussdType = 'Qr';
          let ussdCode = this.ussdCode.substring(0, this.ussdCode.length - 1);
          this.qrCodeSrc = 'https://chart.apis.google.com/chart?cht=qr&chs=150x150&chld=L&choe=UTF-8&chl=tel:' +
              ussdCode + '%2523';
        } else {
          this.ussdType = 'Code';
        }
      },
      finishTimer() {
        this.visibleOtpTimer = false;
        this.visibleSendSms = false;
        this.channel = 'ussd';
      },
      otpMaxLength() {
        setTimeout(function() {
          if (document.getElementById('txtOtp')) {
            let txtOtp = document.getElementById('txtOtp');
            if (txtOtp.value.length > 0 && txtOtp.value.length === 6) {
              document.getElementById("btnSubmitLogin").click();
              document.getElementById("btnSubmitLogin").focus();

            }

            if (txtOtp.value.length === 6) {
              txtOtp.classList.remove("remove-otp-curse");
              txtOtp.className += " remove-otp-curse";
            } else {
              txtOtp.classList.remove("remove-otp-curse");
            }
          }
        }, 20);
      },
      preventMaxSize(event) {
        document.getElementById('txtOtp');
        let txtOtp = document.getElementById('txtOtp');
        if (txtOtp.value.length > 5) {
          event.preventDefault();
          return false;
        }
      },
      onFinishedLockTime() {
        this.lockout_time_min = null;
        this.lockout_time_sec = null;
        this.lockLogin = false;
      },
      clipboardMessage(event) {

        store.commit('flashMessage', {
          text: 'Copied',
          type: 'success',
          timeout: '1500'
        });
      },
      getOtpAuthorization(callback) {
        this.$store.state.http.requests['oauth.otpAuthorization'].get({client_id: "panel-client"}).then((response) => {
              this.mobile_expire_in = response.data.data.expire_in;
              this.mobile_socket_uri = response.data.data.uri;
              let sessionId = this.mobile_socket_uri.match('session_id=([^&#]+)')[1];

              callback(sessionId);
            }, (response) => {

            }
        );
      },
      loginByMobileApplication() {
        if (!this.mobile_socket_uri) {
          this.getOtpAuthorization((sessionId) => {
            this.startWebPushSocket(sessionId);
          });

        }
        this.loginByMobileApp = !this.loginByMobileApp;
      },
      startWebPushSocket(sessionId) {
        let vm = this;
        let NchanSubscriber = require("nchan");
        this.nchanSubscriber = new NchanSubscriber(
            'https://pubsub.zarinpal.com/otp?session_id=' + sessionId,
            {
              subscriber: 'websocket',
              reconnect: 'persist',
              shared: true
            }
        );
        this.nchanSubscriber.on('message', function(message) {
          message = JSON.parse(message);
          vm.username = message.mobile;
          vm.otp = message.otp;
          vm.login();
        });

        this.nchanSubscriber.start();
      },
    },
    components: {
      timer,
      loading
    }
  }

</script>