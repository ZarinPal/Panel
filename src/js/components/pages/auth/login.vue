// app.vue
<style>
    input[type="text"],input[type="password"]{
        width:100% !important;
    }
</style>

<template lang="pug">
div.row.auth-container
    div.col-lg-4.col-md-4.col-sm-5.col-xs-12(v-if="step == 1")
        div.logo
            img(src="assets/img/ZarinPal-Logo.svg")
            p زرین‌پال

        form(method="post" @submit.prevent="sendOtp('ussd')")
            div
                label
                input.gold(type="text" v-model="username" placeholder="شماره موبایل")
            //- div.row
                div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                    input#checkbox(type="checkbox")
                    label(for="checkbox")
                        span
                        | مرا به خاطر بسپار
                div.col-lg-6.col-md-6.col-sm-6.col-xs-6.forgot
                    a بازیابی رمز عبور
            div
                button.gold.full(id="login") ورود به حساب
            div.center(v-if="!this.$route.query.mobile")
                span عضو نیستید؟
                router-link.register(tag="a" v-bind:to="{ name: 'auth.register'}") ثبت نام کنید
    div.col-lg-4.col-md-4.col-sm-5.col-xs-12(v-if="step == 2")

        div.row.nav-logo
            div.col-xs.logo.nav-right.ta-left
                img(src="assets/img/ZarinPal-Logo.svg")
                p زرین‌پال
            div.col-xs.nav-left
                img.user-avatar(v-bind:src="avatar")

        span
            p.ussd-code(v-if="channel == 'ussd'") لطفا کد دستوری زیر را توسط موبایل خود شماره گیری نمایید.
            p.ussd-code(v-if="channel == 'ussd'" dir="ltr") {{ussdCode}}
        form(method="post" @submit.prevent="login")
            div
                label
                input.gold(type="text" dir="ltr" v-model="otp" placeholder="کد یک بار مصرف")
            div
                button.gold.full(id="login") ورود به حساب
            div
                p.center یا
            div
                button.gold.full(v-on:click.prevent="sendOtp('sms')") ارسال کد به صورت پبامک
            div.center(v-if="!this.$route.query.mobile")
                span عضو نیستید؟
                router-link.register(tag="a" v-bind:to="{ name: 'auth.register'}") ثبت نام کنید
</template>

<script>
    import selectbox from '../partials/selectbox.vue';
    export default {
        name: 'auth-login',
        data () {
            return {
                username: "",
                otp: "",
                step: 1,
                avatar: null,
                channel: null,
                ussdCode: null,
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
                            this.$store.dispatch('auth/fetch');
                            this.$router.push({name: 'home.index'});
                        },
                        (response) => {
                            store.commit('flashMessage',{
                                text: response.data.meta.error_message,
                                important: false,
                                type: 'danger'
                            });
                        }
                );
            }
        },
        components: {
            selectbox
        }
    }
</script>