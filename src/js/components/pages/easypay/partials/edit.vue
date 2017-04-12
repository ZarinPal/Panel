<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title ٖ{{ $t('easypay.editEasyPay') }}
                p.page-description ٖ{{ $t('easypay.editEasyPayDescription') }}

        div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section.create-webservice
            div.box
                <!--1-->
                div.body
                    div.row
                        div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                            p.form-title.ta-right {{$t('easypay.firstInfo')}}
                            p.form-message.ta-right {{$t('easypay.firstInfoMessage')}}


                            input(type="text" v-model="site_name" placeholder= "نام وب‌سایت")
                            input(type="text" v-model="domain" placeholder= "آدرس وب‌سایت: domain.ir")
                            input(type="text" v-model="tel" placeholder= "تلفن پشتیبانی وب‌سایت")
                            textarea.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-model="site_content" placeholder= "توضیحات وب‌سایت")
                            selectbox.selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectedPurse" v-bind:data="pursesSelection" placeholder="کیف پول متصل")


                        div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                            div.row
                                div.col-lg-12.col-md-12.col-sm-12.col-xs-12
                                    div.nav-picker
                                        span.picker.pull-right {{$t('webservice.uploadLogo')}}

                                div.col-lg-12.col-md-12.col-sm-12.col-xs-12
                                    img.webservice-logo(src="")



                                div.col-lg-12.col-md-12.col-sm-12.col-xs-12
                                    div.file-zone(@dragenter="fileHover = true" @dragleave="fileHover = false" v-bind:class="{'file-zone-hover': fileHover}")
                                        div.row
                                            div.col-lg-2.col-md-2.col-sm-12.col-xs-12.ta-center
                                                span.upload-icon

                                            div.col-lg-10.col-md-10.col-sm-12.col-xs-12.nav-texts
                                                p فایل لوگو را اینجا رها کنید
                                                div.nav-file-input
                                                    span یا از کامپیوتر
                                                    input#attach-input(type="file")
                                                    label(for="#attach-input") انتخاب کنید

                div.row
                    div.col-xs.nav-buttons
                        button.btn.success.pull-right(@click="createEasypay") {{$t('easypay.createEasypay')}}


                div.body
                    <!--2-->
                    div.row
                        div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                            p.form-title.ta-right {{$t('easypay.orderForm')}}
                            p.form-message.ta-right {{$t('easypay.orderFormMessage')}}

                            div.row
                                div.col-lg-5.col-md-5.col-sm-12.col-xs-12.nav-required-fields
                                    div.ta-right
                                        input(name="optional" type="checkbox" id="chkEmail")
                                        label(for="chkEmail")
                                            span
                                            |{{ $t('common.email')}}

                                    div.ta-right
                                        input(name="optional" type="checkbox" id="chkUserName")
                                        label(for="chkUserName")
                                            span
                                            |{{ $t('easypay.username')}}

                                    div.ta-right
                                        input(name="optional" type="checkbox" id="chkMobile")
                                        label(for="chkMobile")
                                            span
                                            |{{ $t('easypay.mobile')}}



                                div.nav-optional-radios.col-lg-7.col-md-7.col-sm-12.col-xs-12
                                    div.row
                                        div.col-xs.ta-right
                                            input(name="optional" type="radio" id="rdoOptional")
                                            label(for="rdoOptional")
                                                span
                                                |{{ $t('easypay.optional')}}

                                        div.col-xs.ta-right
                                            input(name="optional" type="radio" id="rdoMandatory")
                                            label(for="rdoMandatory")
                                                span
                                                |{{ $t('easypay.mandatory')}}


                                div.row
                                    div.col-xs.nav-buttons
                                        button.btn.success.pull-right(@click="") {{$t('common.save')}}

                    <!--3-->
                    div.row
                        div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                            p.form-title.ta-right {{$t('easypay.limits')}}
                            p.form-message.ta-right {{$t('easypay.limitsMessage')}}

                            div.row
                                div.col-lg-7.col-md-7.col-sm-12.col-xs-12.nav-required-fields
                                    div.ta-right
                                        input(name="optional" type="checkbox" id="chkLimitNumber")
                                        label(for="chkLimitNumber")
                                            span
                                            |{{ $t('easypay.limitInNumber')}}

                                    div.ta-right
                                        input(name="optional" type="checkbox" id="chkEasypayReceipt")
                                        label(for="chkEasypayReceipt")
                                            span
                                            |{{ $t('easypay.showEasypayReceipt')}}



                                div.nav-optional-radios.col-lg-5.col-md-5.col-sm-12.col-xs-12
                                    div.row
                                        div.col-xs.ta-right
                                            input(type="number" id="rdoOptional" placeholder="تعداد")


                                div.box-border-space
                                    input(type="text" placeholder="لینک بازگشت پرداخت موفق")
                                    input(type="text" placeholder="لینک بازگشت پرداخت ناموفق")

                            div.row
                                div.col-xs.nav-buttons
                                    button.btn.success.pull-right(@click="") {{$t('common.save')}}

</template>


<script>
    import selectbox from '../../partials/selectbox.vue';

    export default {
        name: 'pages-easypay-partials-edit',
        data() {
            return {
                fileHover: false,
                messages: {},
                purse: null
            }
        },
        computed:{
            pursesSelection() {
                if(this.$store.state.auth.user.purses) {
                    return this.$store.state.auth.user.purses.map(function (purse) {
                        return {
                            'title': purse.name,
                            'value': purse.purse
                        }
                    });
                }
            },
        },
        methods: {
            selectedPurse(purseId) {
                this.purse = purseId;
            },
            createEasypay() {

            }
        },
        components: {
            selectbox
        }
    }

</script>
