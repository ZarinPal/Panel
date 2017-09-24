<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                p.page-title {{ $i18n.t('easypay.editEasyPay') }}
                p.page-description {{ $i18n.t('easypay.editEasyPayDescription') }}

        loading(v-if="!isLoadedEasypay")

        div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section.create-easypay(:class="{'inactive-step': !isLoadedEasypay}" )
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
                                            input.ltr-input(v-validate="{type: 'number', money: true}" maxlength="15" :class="{'input-danger': validationErrors.price}"  type="text" v-model="price" placeholder= "مبلغ")
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
                                                    input(type="checkbox" name="email-optional" v-model="requiredFields.email.checkbox" id="chkEmail")
                                                    label(for="chkEmail")
                                                        span
                                                        |{{ $i18n.t('common.email')}}

                                            div.nav-optional-radios.col-lg-7.col-md-7.col-sm-7.col-xs-12(v-show="requiredFields.email.checkbox")
                                                div.row
                                                    div.col-xs.ta-right
                                                        input(name="email-optional" v-model="requiredFields.email.radio" value="0" type="radio" id="rdoEmailOptional")
                                                        label(for="rdoEmailOptional")
                                                            span
                                                            |{{ $i18n.t('easypay.optional')}}

                                                    div.col-xs.ta-right
                                                        input(name="email-optional" v-model="requiredFields.email.radio" value="1" type="radio" id="rdoEmailMandatory")
                                                        label(for="rdoEmailMandatory")
                                                            span
                                                            |{{ $i18n.t('easypay.mandatory')}}

                                        <!--2-2-->
                                        div.row.f-row
                                            div.col-lg-5.col-md-5.col-sm-5.col-xs-12.nav-required-fields
                                                div.ta-right
                                                    input(name="usernameOptional" v-model="requiredFields.name.checkbox" type="checkbox" id="chkUserName")
                                                    label(for="chkUserName")
                                                        span
                                                        |{{ $i18n.t('easypay.username')}}

                                            div.nav-optional-radios.col-lg-7.col-md-7.col-sm-7.col-xs-12(v-show="requiredFields.name.checkbox")
                                                div.row
                                                    div.col-xs.ta-right
                                                        input(name="usernameOptional" v-model="requiredFields.name.radio" value="0" type="radio" id="rdoUsernameOptional")
                                                        label(for="rdoUsernameOptional")
                                                            span
                                                            |{{ $i18n.t('easypay.optional')}}

                                                    div.col-xs.ta-right
                                                        input(name="usernameOptional" v-model="requiredFields.name.radio" value="1" type="radio" id="rdoUsernameMandatory")
                                                        label(for="rdoUsernameMandatory")
                                                            span
                                                            |{{ $i18n.t('easypay.mandatory')}}

                                        <!--2-3-->
                                        div.row.f-row
                                            div.col-lg-5.col-md-5.col-sm-5.col-xs-12.nav-required-fields
                                                div.ta-right
                                                    input(name="mobileOptional" v-model="requiredFields.mobile.checkbox"  type="checkbox"  id="chkMobile")
                                                    label(for="chkMobile")
                                                        span
                                                        |{{ $i18n.t('easypay.mobile') }}

                                            div.nav-optional-radios.col-lg-7.col-md-7.col-sm-7.col-xs-12(v-show="requiredFields.mobile.checkbox")
                                                div.row
                                                    div.col-xs.ta-right
                                                        input(name="mobileOptional" v-model="requiredFields.mobile.radio" value="0" type="radio" id="rdoMobileOptional")
                                                        label(for="rdoMobileOptional")
                                                            span
                                                            |{{ $i18n.t('easypay.optional')}}

                                                    div.col-xs.ta-right
                                                        input(name="mobileOptional" v-model="requiredFields.mobile.radio" value="1" type="radio" id="rdoMobileMandatory")
                                                        label(for="rdoMobileMandatory")
                                                            span
                                                            |{{ $i18n.t('easypay.mandatory')}}


                                        div.row
                                            div.col-xs.nav-buttons


                    div.body
                        <!--3-->
                        div.row
                            div.col-lg-7.col-md-7.col-sm-12.col-xs-12
                                div.nav-switch
                                    label.switch-label(for="chkType") {{ $i18n.t('easypay.advance')}}
                                    label.switch
                                        input(type="checkbox" id="chkType" v-model="type")
                                        span.slider.round

                                transition(name="fade"
                                enter-active-class="fade-in"
                                leave-active-class="fade-out")

                                    div.row(v-if="type == 1")
                                        div.col-lg-12.col-md-12.col-sm-12.col-xs-12
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
                                                            input(:class="{'input-danger': validationErrors.limit}" v-validate="{type: 'number'}" v-show="limited" type="number" v-model="limit" placeholder="تعداد")
                                                            div.ta-right(v-if="validationErrors.limit")
                                                                span.text-danger {{ $i18n.t(validationErrors.limit) }}


                                                        div.col-lg-12.col-md-12.col-xs-12.nav-urls
                                                            <!--Success redirect url-->
                                                            div.row.input-group.no-margin.full-width(:class="{'input-danger': validationErrors.successful_redirect_url}")
                                                                div.col-xs.no-margin
                                                                    input.input.ltr-input(type="text" v-model="successfulRedirectUrl"  placeholder= "لینک بازگشت پرداخت موفق")
                                                                div.no-margin.first-label
                                                                    span http://www.
                                                            div.ta-right(v-if="validationErrors.successful_redirect_url")
                                                                span.text-danger {{ $i18n.t(validationErrors.successful_redirect_url) }}

                                                            <!--Failed redirect url-->
                                                            div.row.input-group.no-margin.full-width(:class="{'input-danger': validationErrors.failed_redirect_url}")
                                                                div.col-xs.no-margin
                                                                    input.input.ltr-input(type="text" v-model="failedRedirectUrl"  placeholder= "لینک بازگشت پرداخت ناموفق")
                                                                div.no-margin.first-label
                                                                    span http://www.
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
    import loading from '../../partials/loading.vue';

    export default {
        name: 'pages-easypay-partials-edit',
        data() {
            return {
                loading: false,
                isLoadedEasypay: false,
                easypay: {},
                fileHover: '',
                visibleEmail: '',   //  visible email options
                messages: {},
                title: '',
                description: '',
                price: '',
                purse: null,
                requiredFields: {
                    email: {
                        checkbox:false,
                        radio:0,
                    },
                    name: {
                        checkbox:false,
                        radio:0,
                    },
                    mobile: {
                        checkbox:false,
                        radio:0,
                    }
                },
                type: 0,
                showReceipt: '',
                successfulRedirectUrl: '',
                failedRedirectUrl: '',
                limited: 0,
                limit: '',
            }
        },
        computed: {
//            easypay() {
//                return _.find(this.$store.state.paginator.paginator.EasypayList.data, {'entity_id': this.$route.params.public_id});
//            },
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
        created() {
            this.getEasypay();
        },
        methods: {
            selectedPurse(purseId) {
                this.purse = purseId;
            },
            getEasypay() {
                this.$store.state.http.requests['easypay.getShow'].get({'easypay_id' : this.$route.params.public_id}).then(
                    (response) => {
                        this.easypay = response.data.data;

                        this.title = response.data.data.title;
                        this.price = response.data.data.price;
                        this.description = response.data.data.description;
                        this.purse = response.data.data.purse;

                        if (
                            response.data.data.show_receipt ||
                            response.data.data.successful_redirect_url ||
                            response.data.data.failed_redirect_url ||
                            response.data.data.limit
                        ) {
                            this.type = 1;
                        } else {
                            this.type = 0
                        }

                        let successUrl = response.data.data.successful_redirect_url;
                        let failedUrl = response.data.data.failed_redirect_url;
                        if(successUrl || failedUrl) {
                            successUrl = successUrl.substring(11);
                            failedUrl = failedUrl.substring(11);
                        }

                        this.successfulRedirectUrl = successUrl;
                        this.failedRedirectUrl = failedUrl;
                        this.limit = response.data.data.limit;

                        this.handleOrderOptions('email');
                        this.handleOrderOptions('mobile');
                        this.handleOrderOptions('name');
                        this.handleShowReceipt();
                        this.isLoadedEasypay = true;
                    },() => {
                        this.isLoadedEasypay = true;
                    }
                );
            },
            editEasypay() {
                this.loading = true;
                this.handleShowReceiptSave();

                let price = this.price;
                if(/,/g.test(price)) {
                    price = price.replace(/,/g, "");
                }

                //if easypay not advance
                if(this.type === 0) {
                    this.limit = 0;
                    this.successfulRedirectUrl = '';
                    this.failedRedirectUrl = '';
                    this.limited = 0;
                }

                let successUrl = null, failedUrl = null;
                if(this.type === 1 && this.successfulRedirectUrl && this.failedRedirectUrl) {
                    successUrl = 'http://www.' + this.successfulRedirectUrl;
                    failedUrl = 'http://www.' + this.failedRedirectUrl;
                }
                let easyPayData = {
                    title: this.title,
                    description: this.description,
                    price: price,
                    purse: this.purse,
                    required_fields: {
                        email: this.handleOrderOptionsSave('email'),
                        name: this.handleOrderOptionsSave('name'),
                        mobile: this.handleOrderOptionsSave('mobile')
                    },
                    type: this.type,
                    show_receipt: this.showReceipt,
                    successful_redirect_url: successUrl,
                    failed_redirect_url: failedUrl,
                    limited: this.limited,
                    limit: this.limit,
                };

                this.$store.state.http.requests['easypay.getShow'].update({easypay_id: this.$route.params.public_id}, easyPayData).then(
                    ()=> {
                        this.loading = false;
                        this.changeEasypayState();
                        store.commit('clearValidationErrors');
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
                let orderStates = {
                    hidden:{
                        checkbox:false,
                        radio:0,
                    },
                    optional:{
                        checkbox:true,
                        radio:0,
                    },
                    required:{
                        checkbox:true,
                        radio:1,
                    },
                };
                return this.requiredFields[requireFieldName] =
                    orderStates[this.easypay.required_fields[requireFieldName]];
            },
            handleOrderOptionsSave(requireFieldName) {
                if(this.requiredFields[requireFieldName].checkbox){
                    return parseInt(this.requiredFields[requireFieldName].radio)
                }
                return -1;

            },
            handleShowReceipt() {
                if (this.easypay.show_receipt === 1 || this.easypay.show_receipt === true) {
                    this.showReceipt = true;
                } else {
                    this.showReceipt = false;
                }

                if (this.easypay.limit) {
                    this.limited = true;
                } else {
                    this.limited = false;
                    this.limit = null;
                }
            },
            handleShowReceiptSave() {
                if (this.showReceipt === false || this.showReceipt === 0) {
                    this.showReceipt = 0;
                } else {
                    this.showReceipt =  1;
                }

                //set is easypay has advance or not and set it to 0 OR 1
                if (this.type === true || this.type === 1) {
                    this.type = 1;
                } else {
                    this.type = 0;
                }

                if (this.limited === false || this.limited === 0) {
                    this.limited = 0;
                    this.limit = null;
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
            purse,
            loading
        }
    }

</script>
