// app.vue
<style>
</style>

<template lang="pug">
div.row.auth-container
    div.col-lg-4.col-md-4.col-sm-5.col-xs-12
        div.logo
            img(src="assets/img/ZarinPal-Logo.svg")
            p زرین‌پال
        form(action="#" method="post" novalidate)
            div.row
                div.col-lg-6.col-md-6.col-sm-6.col-xs-12
                    label
                    input.gold(type="text" v-model="firstName" id="firstname" placeholder="نام")
                div.col-lg-6.col-md-6.col-sm-6.col-xs-12
                    label
                    input.gold(type="text" v-model="lastName" id="lastname" placeholder="نام خانوادگی")
            div
                label
                input.gold(type="text" v-model="mobile" id="mobile" placeholder="موبایل")
            div
                button.gold.full(id="register" @click="register") ثبت نام
            div.center
                span عضو زرین‌پال هستید؟
                router-link.register(tag="a" v-bind:to="{ name: 'auth.login'}") وارد شوید
    <!--footer-->
        <!--ul.center-content-->
            <!--li-->
                <!--a(href="https://www.zarinpal.com" title="صفحه اصلی زرین پال" target="_blank" rel="follow index") صفحه اصلی-->
            <!--li-->
                <!--a(href="https://www.zarinpal.com/terms.html" title="قوانین و مقررات زرین پال" target="_blank" rel="nofollow index") قوانین و مقررات-->
            <!--li-->
                <!--a(href="https://www.zarinpal.com/policy.html" title="صفحه حریم خصوصی زرین پال" target="_blank" rel="nofollow index") حریم خصوصی-->
            <!--li-->
                <!--a(href="https://www.zarinpal.com/contact.html" title="تماس با ما زرین پال" target="_blank" rel="nofollow index") تماس با ما-->
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
        methods: {
            register(event){
                event.preventDefault();
                let auth2Data = {
                    first_name: this.firstName,
                    last_name: this.lastName,
                    mobile: this.mobile,
                };
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
