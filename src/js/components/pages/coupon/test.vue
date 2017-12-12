<template lang="pug">
    div.inner-content
        div.row
            <!--Web Service-->
            div.col-xs-12.col-sm-12.col-md-6.col-lg-6.section
                div.box
                    div.top-xs.header
                        div.row
                            div.col-xs.right-box
                                p
                                    span.green-small-circle
                                    span.header-title زرین‌پال

                            div.ta-left-box
                                router-link.header-link(tag="span" v-bind:to="{ name: 'auth.register'}") http://www.zarinpal.com


                    div.middle-xs.body

                        div.row.box-row
                            div.col-xs.ta-right
                                span.label کد درگاه

                            div.col-xs.ta-ta-left
                                div.label-group.pull-left
                                    span.text 11e6-847b-005056a20...
                                    span.icon

                        div.row.box-row
                            div.col-xs.ta-right
                                span.label آی پی

                            div.col-xs.ta-left
                                span.text-value 127.0.0.1


                        div.row.box-row
                            div.right
                                span.label سرویس‌ها

                            div.col-xs.ta-left
                                span.tag.tag-active.pull-left USSD
                                span.tag.tag-inactive.pull-left وب گیت
                                span.tag.tag-inactive.pull-left س

                    div.bottom-xs.box-footer
                        div.row
                            div.col-xs
                                router-link.transaction(tag="span" v-bind:to="{ name: 'auth.register'}") تراکنش‌ها
                            div.col-xs
                                router-link.edit(tag="span" v-bind:to="{ name: 'auth.register'}") سشن‌های پرداخت
                            div
                                span.more



            <!--Easy pay-->
            div.col-xs-12.col-sm-12.col-md-6.col-lg-6.section
                div.box
                    div.top-xs.header
                        div.row
                            div.col-xs.right-box
                                p
                                    span.green-small-circle
                                    span.header-title حق عضویت یکساله در وبسایت

                            div.ta-left-box
                                router-link.header-link(tag="span" v-bind:to="{ name: 'auth.register'}") http://www.zarinpal.com


                    div.middle-xs.body

                        div.row.box-row
                            div.col-xs.ta-right
                                span.label مبلغ

                            div.col-xs.ta-left
                                span.text-value ۵,۰۰۰ تومان


                        div.row.box-row
                            div.col-xs.ta-right
                                span.label واریز به

                            div.col-xs.ta-left
                                span.tag-deposit-to.pull-left
                                    img(src="assets/img/zarin-logo.png")
                                    span اصلی زرین‌پال


                        div.row.box-row
                            div.right
                                span.label محدودیت

                            div.col-xs.ta-left
                                span.text-value بدون محدودیت

                        br
                    div.bottom-xs.box-footer
                        div.row
                            div.col-xs
                                router-link.transaction(tag="span" v-bind:to="{ name: 'auth.register'}") تراکنش‌ها
                            div.col-xs
                                router-link.edit(tag="span" v-bind:to="{ name: 'auth.register'}") ویرایش
                            div.col-xs
                                router-link.delete(tag="span" v-bind:to="{ name: 'auth.register'}") حذف



            <!--Coupons-->
            div.col-xs-12.col-sm-12.col-md-6.col-lg-6.section
                div.box
                    div.middle-xs.body

                        div.row.box-row
                            div.col-xs.ta-right
                                span.label کد تخفیف

                            div.col-xs.ta-ta-left
                                div.label-group.pull-left
                                    span.text ZarinTalaei-96
                                    span.icon


                        div.row.box-row
                            div.right
                                span.label محدودیت

                            div.col-xs.ta-left
                                span.text-value بدون محدودیت


                        div.row.box-row
                            div.right
                                span.label وب‌سرویس

                            div.col-xs.ta-left
                                span.text-value رد ریسلر



                        div.row.box-row
                            div.right
                                span.label تاریخ انقضا

                            div.col-xs.ta-left
                                span.text-value ۱۳۹۵/۰۹/۱۴

                    div.bottom-xs.box-footer
                        div.row
                            div.col-xs
                                router-link.edit(tag="span" v-bind:to="{ name: 'auth.register'}") ویرایش
                            div.col-xs
                                router-link.details(tag="span" v-bind:to="{ name: 'auth.register'}") نمایش جرییات

            <!--Cards-->
            div.col-xs-12.col-sm-12.col-md-6.col-lg-6.section
                div.box.card
                    div.middle-xs.body.bank-card.zarin-card
                        div.row
                            div.col-xs.ta-right
                                img(src="assets/img/zarin-logo.png")
                            div.ta-left
                                span.accepted-card
                                    span تایید‌شده

                        div.row
                            span.card-number
                                span 6263-14**-****-6720

                        div.row.box-row
                            div.ta-right
                                span.label  شماره حساب :
                                span  ۳۴۵۶۷۸۹۰۱۲۳۴۵۶۹۸


                            div.col-xs.ta-left
                                span انقضا :
                                span.text-value ۱۳۹۵/۰۹/۱۴

                    div.bottom-xs.box-footer
                        div.row
                            div.col-xs
                                router-link.edit-bank-account(tag="span" v-bind:to="{ name: 'auth.register'}") ویرایش حساب‌بانکی


            <!--File uploader-->
            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                div.file-zone.col-xs
                    div.row
                        div.nav-icon.col-lg-1.col-md-2.col-sm-12.col-xs-12
                            span.icon-cloud
                        div.nav-texts.col-lg-11.col-md-10.col-sm-12.col-xs-12
                            div فایل لوگو را اینجا رها کنید
                            div
                                span یا از کامپیوتر
                                span.file-input
                                    input(type="file")
                                    span.file-text انتخاب کنید




            <!--Tickets-->
            div.col-xs-12.col-sm-12.col-md-6.col-lg-6.section
                div.box.ticket
                    div.top-xs.header
                        div.row
                            span.user-image
                                img(src="assets/img/zarin-logo.png")

                            span.nav-ticket-status
                                p.username علی امیری
                                p.ticket-date ۳ هفته پیش


                    div.middle-xs.body.ta-right
                        p تغییر اطلاعات کاربر شماره تلفن همراه (سابق) (جدید)09213724752 ش



            <!--Support Tickets-->
            div.col-xs-12.col-sm-12.col-md-6.col-lg-6.section
                div.box.ticket
                    div.top-xs.header
                        div.row
                            span.user-image
                                img(src="assets/img/profile.png")
                                img.zarinpal-sign(src="assets/img/zarin-logo.png")

                            span.nav-ticket-status
                                p.username امین نظری
                                p.ticket-date ۳ هفته پیش

                    div.middle-xs.body.ta-right
                        p تغییر اطلاعات کاربر شماره تلفن همراه (سابق) (جدید)09213724752 ش


            <!--Picker-->
            div.col-xs-12.col-sm-12.col-md-6.col-lg-6.section
                span.picker.picker-active عادی
                span.picker.picker-inactive مهم


</template>


<script>
    export default {
        name: 'coupon',

    }

</script>