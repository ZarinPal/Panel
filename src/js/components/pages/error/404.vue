<template lang="pug">
    div.container-404
        <!--Bottom-->
        div.container-404-top
            div.row.top
                div.col-lg-5.col-md-6.col-xs-12
                    div.logo-section
                        span.zarin-logo
                        span.zarin-type {{$i18n.t('common.zarinPal')}}

                    div.description
                        h2.iransans-light.text-404 {{$i18n.t('error.404')}}
                        h3 {{$i18n.t('error.notFound')}}
                        div.text {{$i18n.t('error.notFoundDetail')}}

                        div.buttons
                            router-link.btn.gold(type="button" v-bind:to="{ name: 'home.index'}") {{$i18n.t('common.returnToDashboard')}}
                            router-link.btn(type="button" v-bind:to="{ name: 'home.index'}") {{$i18n.t('user.backToHomePage')}

                div.col-lg-7.col-md-6.col-xs-12.left-box
                    div.img-404

        <!--Bottom-->
        div.container-404-bottom
            div.row.bottom
                div.col-lg-3.col-md-3.col-sm-12.col-xs-12
                    span.copy-right {{$i18n.t('common.copyRightYear')}}
                    span.copy-right-type {{$i18n.t('common.zarinPal')}}
                div.links.col-lg-9.col-md-9.col-sm-12.col-xs-12
                    ul
                        a(href="https://www.zarinpal.com/app.html") {{$i18n.t('common.application')}}
                        a(href="https://www.zarinpal.com/contact.html") {{$i18n.t('common.contactUs')}}
                        a(href="https://www.zarinpal.com/lab/") {{$i18n.t('common.lab')}}
                        a(href="https://www.zarinpal.com/faq.html") {{$i18n.t('common.faq')}}
                        a(href="https://www.zarinpal.com/about.html") {{$i18n.t('common.aboutUs')}}
</template>

<script>
    export default {
        name: 'error404',
    }
</script>