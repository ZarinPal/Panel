<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title ٖ{{ $i18n.t('easypay.editEasyPay') }}
                p.page-description ٖ{{ $i18n.t('easypay.editEasyPayDescription') }}

        div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section.create-easypay
            div.box
                <!--1-->
                div.body(v-bind:class="{'inactive-step' : step !== 1}")
                    div.row
                        div.col-lg-7.col-md-7.col-sm-12.col-xs-12

                            div.row
                                div.col-lg-1.col-md-1.col-sm-1.col-xs-1
                                    div.step-number(v-ripple=""  v-bind:class="{'active-step-number' : step == 1}") ۱
                                    div.step-line(v-bind:class="{'active-step-line' : step == 1}")

                                div.col-lg-11.col-md-11.sm-11.col-xs-11
                                    p.form-title.ta-right {{$i18n.t('easypay.firstInfo')}}
                                    p.form-message.ta-right {{$i18n.t('easypay.firstInfoMessage')}}

                                    input(type="text" v-model="title" placeholder= "عنوان محصول یا خدمات")
                                    span.input-icon.home-icon
                                    input(type="text" v-model="price" placeholder= "مبلغ")
                                    span.input-icon.amount-icon
                                    textarea.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-model="description" placeholder= "توضیحات وب‌سایت")
                                    selectbox.selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectedPurse" v-bind:data="pursesSelection" placeholder="کیف پول متصل")
                                    span.input-icon.purse-icon
                                    div.cb
                                    div.row.nav-buttons
                                        button.btn.success.pull-right(v-ripple=""  @click="stepTwo") {{$i18n.t('easypay.createEasypay')}}
                        div.col-lg-5.col-md-5.col-sm-12.col-xs-12
                            <!--div.row-->
                                <!--div.col-lg-12.col-md-12.col-sm-12.col-xs-12-->
                                    <!--div.nav-picker-->
                                        <!--span.picker.pull-right {{$i18n.t('webservice.uploadLogo')}}-->

                                <!--div.col-lg-12.col-md-12.col-sm-12.col-xs-12-->
                                    <!--img.webservice-logo(src="")-->


                                <!--div.col-lg-12.col-md-12.col-sm-12.col-xs-12-->
                                    <!--div.file-zone(@dragenter="fileHover = true" @dragleave="fileHover = false" v-bind:class="{'file-zone-hover': fileHover}")-->
                                        <!--div.row-->
                                            <!--div.col-lg-2.col-md-2.col-sm-12.col-xs-12.ta-center-->
                                                <!--span.upload-icon-->

                                            <!--div.col-lg-10.col-md-10.col-sm-12.col-xs-12.nav-texts-->
                                                <!--p فایل لوگو را اینجا رها کنید-->
                                                <!--div.nav-file-input-->
                                                    <!--span یا از کامپیوتر-->
                                                    <!--input#attach-input(type="file")-->
                                                    <!--label(for="#attach-input") انتخاب کنید-->


                div.body
                    <!--2-->
                    div.row(v-bind:class="{'inactive-step' : step !== 2}")
                        div.col-lg-7.col-md-7.col-sm-12.col-xs-12
                            div.row
                                div.col-lg-1.col-md-1.col-sm-1.col-xs-1
                                    div.step-number(v-ripple=""  v-bind:class="{'active-step-number' : step == 2}") ۲
                                    div.step-line(v-bind:class="{'active-step-line' : step == 2}")

                                div.col-lg-11.col-md-11.col-sm-11.col-xs-11
                                    p.form-title.ta-right {{$i18n.t('easypay.orderForm')}}
                                    p.form-message.ta-right {{$i18n.t('easypay.orderFormMessage')}}
                                    <!--2-1-->
                                    div.row.f-row
                                        div.col-lg-5.col-md-5.col-sm-5.col-xs-12.nav-required-fields
                                            div.ta-right
                                                input(name="email-optional" v-model="requiredFields.email" type="checkbox" id="chkEmail")
                                                label(for="chkEmail")
                                                    span
                                                    |{{ $i18n.t('common.email')}}

                                        div.nav-optional-radios.col-lg-7.col-md-7.col-sm-7.col-xs-12(v-show="requiredFields.email")
                                            div.row
                                                div.col-xs.ta-right
                                                    input(name="email-optional" v-model="requiredFields.email" value="0" type="radio" id="rdoEmailOptional")
                                                    label(for="rdoEmailOptional")
                                                        span
                                                        |{{ $i18n.t('easypay.optional')}}

                                                div.col-xs.ta-right
                                                    input(name="email-optional" v-model="requiredFields.email" value="1" type="radio" id="rdoEmailMandatory")
                                                    label(for="rdoEmailMandatory")
                                                        span
                                                        |{{ $i18n.t('easypay.mandatory')}}

                                    <!--2-2-->
                                    div.row.f-row(v-bind:disabled="step > 3 ? true : false" v-bind:class="{'inactive-step' : step > 3}")
                                        div.col-lg-5.col-md-5.col-sm-5.col-xs-12.nav-required-fields
                                            div.ta-right
                                                input(name="usernameOptional" v-model="requiredFields.name" type="checkbox" id="chkUserName")
                                                label(for="chkUserName")
                                                    span
                                                    |{{ $i18n.t('easypay.username')}}

                                        div.nav-optional-radios.col-lg-7.col-md-7.col-sm-7.col-xs-12(v-show="requiredFields.name")
                                            div.row
                                                div.col-xs.ta-right
                                                    input(name="usernameOptional" v-model="requiredFields.name" value="0" type="radio" id="rdoUsernameOptional")
                                                    label(for="rdoUsernameOptional")
                                                        span
                                                        |{{ $i18n.t('easypay.optional')}}

                                                div.col-xs.ta-right
                                                    input(name="usernameOptional" v-model="requiredFields.name" value="1" type="radio" id="rdoUsernameMandatory")
                                                    label(for="rdoUsernameMandatory")
                                                        span
                                                        |{{ $i18n.t('easypay.mandatory')}}

                                    <!--2-3-->
                                    div.row.f-row
                                        div.col-lg-5.col-md-5.col-sm-5.col-xs-12.nav-required-fields
                                            div.ta-right
                                                input(name="mobileOptional" v-model="requiredFields.mobile"  type="checkbox"  id="chkMobile")
                                                label(for="chkMobile")
                                                    span
                                                    |{{ $i18n.t('easypay.mobile') }}

                                        div.nav-optional-radios.col-lg-7.col-md-7.col-sm-7.col-xs-12(v-show="requiredFields.mobile")
                                            div.row
                                                div.col-xs.ta-right
                                                    input(name="mobileOptional" v-model="requiredFields.mobile" value="0" type="radio" id="rdoMobileOptional")
                                                    label(for="rdoMobileOptional")
                                                        span
                                                        |{{ $i18n.t('easypay.optional')}}

                                                div.col-xs.ta-right
                                                    input(name="mobileOptional" v-model="requiredFields.mobile" value="1" type="radio" id="rdoMobileMandatory")
                                                    label(for="rdoMobileMandatory")
                                                        span
                                                        |{{ $i18n.t('easypay.mandatory')}}


                                    div.row
                                        div.col-xs.nav-buttons
                                            button.btn.success.pull-right(v-ripple=""  @click="stepThree") {{$i18n.t('common.save')}}


                div.body
                    <!--3-->
                    div.row(v-bind:class="{'inactive-step' : step !== 3}")
                        div.col-lg-7.col-md-7.col-sm-12.col-xs-12
                            div.row
                                div.col-lg-1.col-md-1.col-sm-1.col-xs-1
                                    div.step-number(v-bind:class="{'active-step-number' : step == 3}") ۳
                                    div.step-line(v-bind:class="{'active-step-line' : step == 3}")

                                div.col-lg-11.col-md-11.col-sm-11.col-xs-11
                                    p.form-title.ta-right {{$i18n.t('easypay.limits')}}
                                    p.form-message.ta-right {{$i18n.t('easypay.limitsMessage')}}

                                    div.row
                                        div.col-lg-7.col-md-7.col-sm-12.col-xs-12.nav-limit-checkbox
                                            div.ta-right
                                                input(name="optional"  v-model="visibleLimit" value='true' type="checkbox" id="chkLimitNumber")
                                                label(for="chkLimitNumber")
                                                    span
                                                    |{{ $i18n.t('easypay.limitInNumber')}}

                                            div.ta-right
                                                input(name="optional" v-model="showReceipt" type="checkbox" id="chkEasypayReceipt")
                                                label(for="chkEasypayReceipt")
                                                    span
                                                    |{{ $i18n.t('easypay.showEasypayReceipt')}}



                                        div.no-margin.nav-optional-radios.col-lg-5.col-md-5.col-sm-12.col-xs-12
                                            input(v-show="visibleLimit" type="number" v-model="limit" placeholder="تعداد")


                                        div.col-lg-12.col-md-12.col-xs-12
                                            input(v-model="successfulRedirectUrl" type="text" placeholder="لینک بازگشت پرداخت موفق")
                                            span.input-icon.home-icon
                                            input(v-model="failedRedirectUrl" type="text" placeholder="لینک بازگشت پرداخت ناموفق")
                                            span.input-icon.home-icon

                                    div.row
                                        div.col-xs.nav-buttons
                                            button.btn.success.pull-right.button(v-ripple=""  @click="createEasypay") {{$i18n.t('common.save')}}

</template>


<script>
    import selectbox from '../../partials/selectbox.vue';

    export default {
        name: 'pages-easypay-partials-edit',
        data() {
            return {
                step: 1,
                fileHover: '',
                visibleEmail: '',   //  visible email options
                messages: {},
                title: '',
                description: '',
                price: '',
                purse: null,
                requiredFields: {
                    email: false,
                    name: false,
                    mobile: false
                },
                type: '0',
                showReceipt: '',
                successfulRedirectUrl: '',
                failedRedirectUrl: '',
                limited: '',
                limit: '',
            }
        },
        created() {
            this.title = this.easypay.title;
            this.price = this.easypay.price;
            this.description = this.easypay.description;
            this.purse = this.easypay.purse;

            this.limited = this.easypay.limit;

            this.successfulRedirectUrl = this.easypay.successful_redirect_url;
            this.failedRedirectUrl = this.easypay.failed_redirect_url;
        },
        computed:{
            easypay() {
                return _.find(this.$store.state.auth.user.easypays, {'entity_id': this.$route.params.public_id});
            },
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
            stepTwo() {
                if(this.title && this.price && this.description && this.purse) {
                    this.step ++;
                } else {
                    store.commit('flashMessage',{
                        text: 'please fill all fields',
                        important: false,
                        type: 'danger'
                    });
                }
            },
            stepThree() {
                this.step ++;
            },
            createEasypay() {
                this.handleOrderOptions();
                this.handleShowReceipt();

                let easyPayData = {
                    isLoading: false,
                    title: this.title,
                    description: this.description,
                    price: this.price,
                    purse: this.purse,
                    required_fields: {
                        email: this.requiredFields.email,
                        name: this.requiredFields.name,
                        mobile: this.requiredFields.mobile
                    },
                    type: this.type,
                    show_receipt: this.showReceipt,
                    successful_redirect_url: this.successfulRedirectUrl,
                    failed_redirect_url: this.failedRedirectUrl,
                    limited: this.limited,
                    limit: this.limit,
                };

                this.$store.state.http.requests['easypay.getList'].save(easyPayData).then(
                    ()=> {
                        this.isLoading = false;
                        this.$router.push({name: 'easypay.index'})
                    },
                    (response) => {
                        store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            important: false,
                            type: 'danger'
                        });
                    }
                );
            },
            handleOrderOptions() {
                if(this.requiredFields.email === false) {
                    this.requiredFields.email = '-1';
                }

                if(this.requiredFields.name === false) {
                    this.requiredFields.name = '-1';
                }

                if(this.requiredFields.mobile === false) {
                    this.requiredFields.mobile = '-1';
                }
            },
            handleShowReceipt() {
                if (this.showReceipt === false) {
                    this.showReceipt = '0';
                } else {
                    this.showReceipt = '1';
                }
            }
        },
        components: {
            selectbox
        }
    }

</script>
