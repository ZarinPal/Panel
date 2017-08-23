<template lang="pug">
    div.container-404
        <!--Bottom-->
        div.container-404-top
            div.row.top
                div.col-lg-5.col-md-6.col-xs-12
                    div.logo-section
                        span.zarin-logo
                        span.zarin-type زرین‌پال

                    div.description
                        h2.iransans-light.text-404 ۴۰۴
                        h3 صفحه مورد‌نظر یافت نشد !
                        div.text متاسفیم، صفحه‌ای که می‌خواستید پیدا نشد. به نظر آدرس را اشتباه وارد کرده‌اید. آدرس صفحه را بررسی و مجددا تلاش کنید.

                        div.buttons
                            router-link.btn.gold(type="button" v-bind:to="{ name: 'home.index'}") بازگشت به پیشخوان
                            router-link.btn(type="button" v-bind:to="{ name: 'home.index'}") صفحه اصلی

                div.col-lg-7.col-md-6.col-xs-12.left-box
                    div.img-404

        <!--Bottom-->
        div.container-404-bottom
            div.row.bottom
                div.col-lg-3.col-md-3.col-sm-12.col-xs-12
                    span.copy-right ©۱۳۹۶
                    span.copy-right-type زرین‌پال
                div.links.col-lg-9.col-md-9.col-sm-12.col-xs-12
                    ul
                        router-link(type="li" v-bind:to="{ name: 'home.index'}") اپلیکیشن
                        router-link(type="li" v-bind:to="{ name: 'home.index'}") تماس با ما
                        router-link(type="li" v-bind:to="{ name: 'home.index'}") آزمایشگاه
                        router-link(type="li" v-bind:to="{ name: 'home.index'}") سوالات متداول
                        router-link(type="li" v-bind:to="{ name: 'home.index'}") درباره ما
</template>

<script>
    export default {
        name: 'error404',
    }
</script>