<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('easypay.editEasyPay') }}
                p.page-description {{ $i18n.t('easypay.editEasyPayDescription') }}

        div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section.create-easypay
            form(autocomplete="on" onsubmit="event.preventDefault();")
                div.box
                    <!--1-->
                    div.body
                        div.row
                            div.col-lg-7.col-md-7.col-sm-12.col-xs-12

                                div.row
                                    div.col-lg-1.col-md-1.col-sm-1.col-xs-1
                                        div.step-number ۱
                                        div.step-line

                                    div.col-lg-11.col-md-11.sm-11.col-xs-11
                                        p.form-title.ta-right {{$i18n.t('easypay.firstInfo')}}
                                        p.form-message.ta-right {{$i18n.t('easypay.firstInfoMessage')}}

                                        div.row.no-margin
                                            span.input-icon.home-icon
                                            input(:class="{'input-danger': validationErrors.title}" type="text" v-model="title" placeholder= "عنوان محصول یا خدمات")
                                            div.ta-right(v-if="validationErrors.title")
                                                span.text-danger {{ $i18n.t(validationErrors.title) }}

                                        div.row.no-margin
                                            span.input-icon.amount-icon
                                            input(v-validate="{type: 'number'}" :class="{'input-danger': validationErrors.price}"  type="text" v-model="price" placeholder= "مبلغ")
                                            div.ta-right(v-if="validationErrors.price")
                                                span.text-danger {{ $i18n.t(validationErrors.price) }}

                                        div.row.no-margin
                                            textarea.col-lg-12.col-md-12.col-sm-12.col-xs-12(:class="{'input-danger': validationErrors.description}" v-model="description" placeholder= "توضیحات وب‌سایت")
                                            div.ta-right(v-if="validationErrors.description")
                                                span.text-danger {{ $i18n.t(validationErrors.description) }}

                                        div.row.no-margin
                                            purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(:class="{'input-danger': validationErrors.purse}" v-on:select="selectedPurse" v-bind:selected="purse" placeholder="انتخاب کیف پول")
                                            div.ta-right(v-if="validationErrors.purse")
                                                span.text-danger {{ $i18n.t(validationErrors.purse) }}

                                        div.cb
                                        div.row.nav-buttons
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
                        div.row
                            div.col-lg-7.col-md-7.col-sm-12.col-xs-12
                                div.row
                                    div.col-lg-1.col-md-1.col-sm-1.col-xs-1
                                        div.step-number ۲
                                        div.step-line

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
                                        div.row.f-row
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


                    div.body
                        <!--3-->
                        div.row
                            div.col-lg-7.col-md-7.col-sm-12.col-xs-12
                                div.row
                                    div.col-lg-1.col-md-1.col-sm-1.col-xs-1
                                        div.step-number ۳
                                        div.step-line

                                    div.col-lg-11.col-md-11.col-sm-11.col-xs-11
                                        p.form-title.ta-right {{$i18n.t('easypay.limits')}}
                                        p.form-message.ta-right {{$i18n.t('easypay.limitsMessage')}}

                                        div.row
                                            div.col-lg-7.col-md-7.col-sm-12.col-xs-12.nav-limit-checkbox
                                                div.ta-right
                                                    input(name="optional" v-model="limited" value='true' type="checkbox" id="chkLimitNumber")
                                                    label(for="chkLimitNumber")
                                                        span
                                                        |{{ $i18n.t('easypay.limitInNumber')}}

                                                div.ta-right
                                                    input(name="optional" v-model="showReceipt" type="checkbox" id="chkEasypayReceipt")
                                                    label(for="chkEasypayReceipt")
                                                        span
                                                        |{{ $i18n.t('easypay.showEasypayReceipt')}}



                                            div.nav-optional-radios.col-lg-5.col-md-5.col-sm-12.col-xs-12
                                                input(v-validate="{type: 'number'}" v-show="limited" type="number" v-model="limit" placeholder="تعداد")


                                            div.col-lg-12.col-md-12.col-xs-12
                                                div.row.no-margin
                                                    span.input-icon.globe-icon
                                                    input(:class="{'input-danger': validationErrors.successful_redirect_url}"  v-model="successfulRedirectUrl" type="text" placeholder="لینک بازگشت پرداخت موفق")
                                                    div.ta-right(v-if="validationErrors.successful_redirect_url")
                                                        span.text-danger {{ $i18n.t(validationErrors.successful_redirect_url) }}



                                                div.row.no-margin
                                                    span.input-icon.globe-icon
                                                    input(:class="{'input-danger': validationErrors.failed_redirect_url}" v-model="failedRedirectUrl" type="text" placeholder="لینک بازگشت پرداخت ناموفق")
                                                    div.ta-right(v-if="validationErrors.failed_redirect_url")
                                                        span.text-danger {{ $i18n.t(validationErrors.failed_redirect_url) }}


                                        div.row
                                            div.col-xs.nav-buttons
                                                button.btn.success.pull-right.button(v-ripple=""  @click="editEasypay") {{$i18n.t('common.edit')}}
                                                    svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                                        circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

</template>


<script>
    import selectbox from '../../partials/selectbox.vue';
    import purse from '../../partials/purses.vue';

    export default {
        name: 'pages-easypay-partials-edit',
        data() {
            return {
                loading: false,
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
                type: '1',
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

            this.requiredFields.email = this.easypay.required_fields.email;
            this.requiredFields.mobile = this.easypay.required_fields.mobile;
            this.requiredFields.name = this.easypay.required_fields.name;

            this.successfulRedirectUrl = this.easypay.successful_redirect_url;
            this.failedRedirectUrl = this.easypay.failed_redirect_url;
            this.limit = this.easypay.limit;

            this.handleOrderOptions('email');
            this.handleOrderOptions('mobile');
            this.handleOrderOptions('name');
            this.handleShowReceipt();
        },
        computed: {
            easypay() {
                return _.find(this.$store.state.auth.user.easypays, {'entity_id': this.$route.params.public_id});
            },
            pursesSelection() {
                if(this.$store.state.auth.user.purses) {
                    return this.$store.state.auth.user.purses.map(function (purse) {
                        return {
                            'title': '<span class="wallet-color color-' + purse.purse + '"></span>' + purse.name,
                            'value': purse.purse
                        }
                    });
                }
            },
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
        },
        methods: {
            selectedPurse(purseId) {
                this.purse = purseId;
            },
            editEasypay() {
                this.loading = true;

                this.handleOrderOptionsSave('email');
                this.handleOrderOptionsSave('mobile');
                this.handleOrderOptionsSave('name');
                this.handleShowReceiptSave();

                let easyPayData = {
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

                this.$store.state.http.requests['easypay.getShow'].update({easypay_id: this.$route.params.public_id}, easyPayData).then(
                    ()=> {
                        this.loading = false;
                        this.changeEasypayState();
                        this.$router.push({name: 'easypay.index'});
                    },
                    (response) => {
                        this.loading = false;
                        store.commit('setValidationErrors',response.data.validation_errors);
                        store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            important: false,
                            type: 'danger'
                        });
                    }
                );
            },
            handleOrderOptions(requireFieldName) {
                switch(this.requiredFields[requireFieldName])
                {
                    case '-1':
                    case 'hidden':
                        this.requiredFields[requireFieldName] = false;
                        break;

                    case 'optional':
                        this.requiredFields[requireFieldName] = '0';
                        break;

                    case 'required':
                        this.requiredFields[requireFieldName] = '1';
                        break;
                }
            },
            handleOrderOptionsSave(requireFieldName) {
                switch(this.requiredFields[requireFieldName])
                {
                    case false:
                    case 'hidden':
                        this.requiredFields[requireFieldName] = '-1';
                        break;

                    case 'optional':
                        this.requiredFields[requireFieldName] = '0';
                        break;

                    case 'required':
                        this.requiredFields[requireFieldName] = '1';
                        break;
                }
            },
            handleShowReceipt() {
                if (this.easypay.show_receipt === 1) {
                    this.showReceipt = true;
                } else {
                    this.showReceipt = false;
                }

                if (this.limit) {
                    this.limited = true;
                } else {
                    this.limited = false;
                    this.limit = '';
                }
            },
            handleShowReceiptSave() {
                if (this.showReceipt === false) {
                    this.showReceipt = 0;
                } else {
                    this.showReceipt =  1;
                }

                if (this.limited === false) {
                    this.limited = 0;
                    this.limit = '';
                } else {
                    this.limited = 1;
                }
            },
            changeEasypayState(){
                let vm = this;
                let easypayIndex = _.findIndex(this.$store.state.auth.user.easypays, function(easypay) {
                    return easypay.entity_id === vm.$route.params.public_id;
                });
                this.$store.state.auth.user.easypays[easypayIndex].title = this.title;
                this.$store.state.auth.user.easypays[easypayIndex].description = this.description;
                this.$store.state.auth.user.easypays[easypayIndex].price = this.price;
                this.$store.state.auth.user.easypays[easypayIndex].purse = this.purse;
                this.$store.state.auth.user.easypays[easypayIndex].required_fields.email = this.requiredFields.email;
                this.$store.state.auth.user.easypays[easypayIndex].required_fields.name = this.requiredFields.name;
                this.$store.state.auth.user.easypays[easypayIndex].required_fields.mobile = this.requiredFields.mobile;
                this.$store.state.auth.user.easypays[easypayIndex].show_receipt = this.showReceipt;
                this.$store.state.auth.user.easypays[easypayIndex].successful_redirect_url = this.successfulRedirectUrl;
                this.$store.state.auth.user.easypays[easypayIndex].failed_redirect_url = this.failedRedirectUrl;
                this.$store.state.auth.user.easypays[easypayIndex].failed_redirect_url = this.failedRedirectUrl;
                this.$store.state.auth.user.easypays[easypayIndex].limited = this.limited;
                this.$store.state.auth.user.easypays[easypayIndex].limit = this.limit;
            },
        },
        components: {
            selectbox,
            purse
        }
    }

</script>
