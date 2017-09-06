<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('easypay.createEasypay') }}
                p.page-description {{ $i18n.t('easypay.createEasypayDescription') }}

        div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section.create-easypay
            form(autocomplete="on" onsubmit="event.preventDefault();")
                div.box
                    <!--1-->
                    div.body(v-bind:class="{'inactive-step' : step !== 1}")
                        div.row
                            div.col-lg-7.col-md-7.col-sm-12.col-xs-12
                                div.row
                                    div.col-lg-1.col-md-1.col-sm-1.col-xs-1
                                        div.step-number(v-ripple="" v-bind:class="{'active-step-number' : step == 1}") ۱
                                        div.step-line(v-bind:class="{'active-step-line' : step == 1}")

                                    div.col-lg-11.col-md-11.sm-11.col-xs-11
                                        p.form-title.ta-right {{$i18n.t('easypay.firstInfo')}}
                                        p.form-message.ta-right {{$i18n.t('easypay.firstInfoMessage')}}

                                        div.row.no-margin
                                            span.input-icon.home-icon
                                            input(:class="{'input-danger': validationErrors.title}" type="text" v-model="title" placeholder= "عنوان محصول یا خدمات" tabindex="1")
                                            div.ta-right(v-if="validationErrors.title")
                                                span.text-danger {{ $i18n.t(validationErrors.title) }}

                                        div.row.no-margin
                                            span.input-icon.amount-icon
                                            input(v-validate="{type: 'number', money: true}" maxlength="15" :class="{'input-danger': validationErrors.price}"  type="text" v-model="price" placeholder= "مبلغ" tabindex="2")
                                            div.ta-right(v-if="validationErrors.price")
                                                span.text-danger {{ $i18n.t(validationErrors.price) }}

                                        div.row.no-margin
                                            textarea.col-lg-12.col-md-12.col-sm-12.col-xs-12(:class="{'input-danger': validationErrors.description}" v-model="description" placeholder= "توضیحات وب‌سایت" tabindex="3")
                                            div.ta-right(v-if="validationErrors.description")
                                                span.text-danger {{ $i18n.t(validationErrors.description) }}

                                        div.row.no-margin
                                            purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(:class="{'input-danger': validationErrors.purse}" v-on:select="selectedPurse" placeholder="انتخاب کیف پول" tabindex="4")
                                            div.ta-right(v-if="validationErrors.purse")
                                                span.text-danger {{ $i18n.t(validationErrors.purse) }}

                                        div.cb
                                        div.row.nav-buttons
                                            button.btn.success.pull-right(v-ripple=""  @click="stepTwo" tabindex="5") {{$i18n.t('easypay.createEasypay')}}
                                                svg.material-spinner(v-if="isLoading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                                    circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")



                            div.col-lg-5.col-md-5.col-sm-12.col-xs-12

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
                                        div.row.f-row(v-bind:class="{'inactive-step' : step > 3}")
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
                                                button.btn.success.pull-right(v-ripple=""  @click="stepThree") {{$i18n.t('purse.nextStep')}}


                    div.body
                        <!--3-->
                        div.row
                            div.col-lg-7.col-md-7.col-sm-12.col-xs-12
                                div.nav-switch(v-bind:class="{'inactive-step' : step !== 3}")
                                    label.switch-label(for="chkType") {{ $i18n.t('easypay.advance')}}
                                    label.switch
                                        input(type="checkbox" id="chkType" v-model="type")
                                        span.slider.round

                                transition(name="fade"
                                enter-active-class="fade-in"
                                leave-active-class="fade-out")

                                    div.row(v-if="type == 1" v-bind:class="{'inactive-step' : step !== 3}")
                                        div.col-lg-1.col-md-1.col-sm-1.col-xs-1
                                            div.step-number(v-bind:class="{'active-step-number' : step == 3}") ۳
                                            div.step-line(v-bind:class="{'active-step-line' : step == 3}")

                                        div.col-lg-11.col-md-11.col-sm-11.col-xs-11
                                            p.form-title.ta-right {{$i18n.t('easypay.limits')}}
                                            p.form-message.ta-right {{$i18n.t('easypay.limitsMessage')}}

                                            div.row
                                                div.col-lg-7.col-md-7.col-sm-12.col-xs-12.nav-limit-checkbox
                                                    div.ta-right
                                                        input(name="optional"  v-model="limited" value='true' type="checkbox" id="chkLimitNumber")
                                                        label(for="chkLimitNumber")
                                                            span
                                                            |{{ $i18n.t('easypay.limitInNumber')}}

                                                    div.ta-right
                                                        input(name="optional" v-model="showReceipt" type="checkbox" id="chkEasypayReceipt")
                                                        label(for="chkEasypayReceipt")
                                                            span
                                                            |{{ $i18n.t('easypay.showEasypayReceipt')}}



                                                div.no-margin.nav-optional-radios.col-lg-5.col-md-5.col-sm-12.col-xs-12
                                                    input(v-validate="{type: 'number'}" v-show="limited" type="text" v-model="limit" placeholder="تعداد")


                                                div.col-lg-12.col-md-12.col-xs-12
                                                    div.row.no-margin
                                                        span.input-icon.globe-icon
                                                        input(:class="{'input-danger': validationErrors.successful_redirect_url}" v-model="successfulRedirectUrl" type="text" placeholder="لینک بازگشت پرداخت موفق")
                                                        div.ta-right(v-if="validationErrors.successful_redirect_url")
                                                            span.text-danger {{ $i18n.t(validationErrors.successful_redirect_url) }}

                                                    div.row.no-margin
                                                        span.input-icon.globe-icon
                                                        input(:class="{'input-danger': validationErrors.failed_redirect_url}" v-model="failedRedirectUrl" type="text" placeholder="لینک بازگشت پرداخت ناموفق")
                                                        div.ta-right(v-if="validationErrors.failed_redirect_url")
                                                            span.text-danger {{ $i18n.t(validationErrors.failed_redirect_url) }}

                        div.row(v-bind:class="{'inactive-step' : step == 1}")
                            div.col-xs.nav-buttons
                                button.btn.success.pull-right.button(v-ripple="" @click="editAfterCreate") {{$i18n.t('common.save')}}
                                    svg.material-spinner(v-if="editLoading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                        circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

</template>


<script>
    import selectbox from '../../partials/selectbox.vue';
    import purse from '../../partials/purses.vue';

    export default {
        name: 'pages-easypay-partials-create',
        data() {
            return {
                isLoading: false,
                editLoading: false,
                easypayEntityId: null, // value fill after create
                step: 1,
                fileHover: '',
                visibleEmail: '',   //  visible email options
                visibleName: '',    //  "   name    "
                visiblePhone: '',   //  "   phone   "
                messages: {},
                title: '',
                description: '',
                price: '',
                purse: null,
                purse_name: null,
                requiredFields: {
                    email: false,
                    name: false,
                    mobile: false
                },
                type: 0,
                showReceipt: false,
                successfulRedirectUrl: null,
                failedRedirectUrl: null,
                limited: false,
                limit: null,
            }
        },
        computed: {
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
                this.purse_name = this.getPurseName(purseId);
            },
            stepTwo() {
                if(this.title && this.price && this.description && this.purse) {
                    //create easypay here
                    this.createEasypay();
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
                this.isLoading = true;
                let price = this.price.replace(/,/g, "");

                let easyPayData = {
                    title: this.title,
                    description: this.description,
                    price: price,
                    purse: this.purse,
                    purse_name: this.purse_name.name,
                    required_fields: {
                        email: '-1',
                        name: '-1',
                        mobile: '-1'
                    },
                    type: 0,
                };

                this.$store.state.http.requests['easypay.getList'].save(easyPayData).then(
                    (response) => {
                        this.easypayEntityId = response.data.data.entity_id;
                        this.addEasypayToState(response.data.data);
                        this.step ++;
                        this.isLoading = false;
                    },
                    (response) => {
                        this.isLoading = false;
                        store.commit('setValidationErrors',response.data.validation_errors);
                        store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            important: false,
                            type: 'danger'
                        });
                    }
                );
            },
            editAfterCreate() {
                this.editLoading = true;

                this.handleOrderOptions();
                this.handleShowReceipt();
                if(this.limited === true) {
                    this.limited = 1;
                } else {
                    this.limited = 0;
                    this.limit = '';
                }
                let price = this.price.replace(/,/g, "");

                let easyPayData = {
                    isLoading: false,
                    title: this.title,
                    description: this.description,
                    price: price,
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

                this.$store.state.http.requests['easypay.getShow'].update({easypay_id: this.easypayEntityId}, easyPayData).then(
                    ()=> {
                        this.changeEasypayStateAfterEdit();
                        this.editLoading = false;
                        this.$router.push({name: 'easypay.index'});
                    },
                    (response) => {
                        this.editLoading = false;
                        store.commit('setValidationErrors',response.data.validation_errors);
                        store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            important: false,
                            type: 'danger'
                        });
                    }
                );

            },
            addEasypayToState(easypayData) {
                let price = this.price.replace(/,/g, "");
                let easyPayData = {
                    created_at: easypayData.created_at,
                    description: this.description,
                    entity_id: easypayData.entity_id,
                    failed_redirect_url: null,
                    limit: null,
                    price: price,
                    public_id: easypayData.public_id,
                    purse: this.purse,
                    purse_name: this.purse_name.name,
                    required_fields: {
                        email: 'hidden',
                        name: 'hidden',
                        mobile: 'hidden'
                    },
                    show_receipt:false,
                    status: false,
                    successful_redirect_url: null,
                    title: this.title,
                    updated_at: easypayData.updated_at,
                    webservice_id:null,
                };

                this.$store.state.auth.user.easypays.unshift(easyPayData);
            },
            changeEasypayStateAfterEdit(){
                let vm = this;
                let easypayIndex = _.findIndex(this.$store.state.auth.user.easypays, function(easypay) {
                    return easypay.entity_id === vm.easypayEntityId;
                });
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
                if(this.type === false) {
                    this.type = 0;
                } else {
                    this.type = 1;
                }

                if (this.showReceipt === false) {
                    this.showReceipt = 0;
                } else {
                    this.showReceipt = 1;
                }
            },
            getPurseName(purseId) {
                return _.find(this.$store.state.auth.user.purses, function(purse) {
                    return purse.purse === purseId;
                });
            }
        },
        components: {
            selectbox,
            purse
        }
    }

</script>
