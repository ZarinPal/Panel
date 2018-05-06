<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                p.page-title {{ $i18n.t('easypay.editEasyPay') }}
                p.page-description {{ $i18n.t('easypay.editEasyPayDescription') }}

        loading(v-if="!isLoadedEasypay")

        div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section.create-easypay(v-else :class="{'inactive-step': !isLoadedEasypay}" )
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
                                            input(v-validate="'required|min:3'" :class="{'input-danger': errors.has('title')}"  v-bind:data-vv-as="$i18n.t('easypay.title')" type="text" v-model="title" name="title" id="title" :placeholder= "$i18n.t('easypay.title')" tabindex="1")
                                            div.ta-right(v-if="validation('title')")
                                                span.text-danger {{ errors.first('title') }}

                                        div.row.no-margin
                                            span.input-icon.amount-icon
                                            vue-numeric.ltr-input(v-validate="{ rules: {required: true}}" v-bind:data-vv-as="$i18n.t('transaction.amount')" :class="{'input-danger': errors.has('price')}" :currency="$i18n.t('webservice.toman')" separator="," v-model="price" v-bind:value="price" name="price" :placeholder="$i18n.t('card.transferAmountTitle')")
                                            div.ta-right(v-if="validation('price')")
                                                span.text-danger {{ errors.first('price') }}

                                        div.row.no-margin
                                            textarea.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-validate="'max:128'" :class="{'input-danger': errors.has('description')}" v-bind:data-vv-as="$i18n.t('common.description')" v-model="description" id="description" name="description" :placeholder= "$i18n.t('common.description')" tabindex="3")
                                            div.ta-right(v-if="validation('description')")
                                                span.text-danger {{ errors.first('description') }}

                                        <!--Easypay selectbox-->
                                        div.row.no-margin.nav-pay-to
                                            div.col-lg-4.col-md-4.col-sm-12.col-xs-12.no-margin
                                                input(@change="changePayTo" name="easypay-type" v-model="payTo" value="purse" type="radio" id="rdoPurseٌ")
                                                label(for="rdoPurseٌ")
                                                    span
                                                    | {{ $i18n.t('user.purse') }}

                                            div.col-lg-8.col-md-8.col-sm-12.col-xs-12.no-margin
                                                purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(@click.native="removeErrors('purse')" :class="{'disable' : payTo == 'webservice', 'input-danger': errors.has('purse')}" v-on:select="selectedPurse" v-bind:selected="purse" :placeholder="$i18n.t('easypay.selectPurse')" tabindex="4")
                                                div.ta-right(v-if="validation('purse')")
                                                    span.text-danger {{ errors.first('purse') }}

                                        <!--Webservice selectbox-->
                                        div.row.nav-pay-to
                                            div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                                                input(@change="changePayTo" name="easypay-type" v-model="payTo" value="webservice" type="radio" id="rdoWebserviceٌ")
                                                label(for="rdoWebserviceٌ")
                                                    span
                                                    | {{ $i18n.t('coupon.webservice') }}

                                            div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                                                selectbox.selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(@click.native="removeErrors('purse')" v-on:select="selectedWebservice" v-bind:selected="webserviceId" v-bind:data="webserviceSelection" :class="{'disable' : payTo == 'purse', 'input-danger': errors.has('webservice_id')}" :placeholder="$i18n.t('webservice.selectWebservice')")
                                                div.ta-right(v-if="validation('webservice_id')")
                                                    span.text-danger {{ errors.first('webservice_id') }}

                                        div.row.no-margin
                                            input(name= "activeCoupon" type="checkbox"  value='true' id= "activeCoupon" v-model="is_coupon_active" )
                                            label(for="activeCoupon")
                                                span
                                                | {{ $i18n.t('webservice.activeCouponInPg') }}

                                        div.cb
                                        div.row.nav-buttons
                            div.col-lg-5.col-md-5.col-sm-12.col-xs-12

                    div.body
                        <!--2-->
                        div.row
                            div.col-lg-12.col-md-12.col-sm-12.col-xs-12
                                div.row
                                    div.col-lg-1.col-md-1.col-sm-1.col-xs-1
                                        div.step-number ۲
                                        div.step-line

                                    div.col-lg-11.col-md-11.col-sm-11.col-xs-11
                                        p.form-title.ta-right {{$i18n.t('easypay.orderForm')}}
                                        p.form-message.ta-right {{$i18n.t('easypay.orderFormMessage')}}
                                        <!--2-1-->
                                        div.row.f-row
                                            div.col-lg-3.col-md-3.col-sm-3.col-xs-12.nav-required-fields.m-t-15
                                                div.ta-right
                                                    input(type="checkbox" name="email-optional" v-model="requiredFields.email.checkbox" id="chkEmail")
                                                    label(for="chkEmail")
                                                        span
                                                        | {{ $i18n.t('common.email')}}

                                            div.nav-optional-radios.col-lg-9.col-md-9.col-sm-9.col-xs-12(v-show="requiredFields.email.checkbox")
                                                div.row
                                                    div.col-lg-4.col-md-4.col-sm-6.col-xs-6.ta-right.m-t-15
                                                        input(name="email-optional" v-model="requiredFields.email.status" value="optional" type="radio" id="rdoEmailOptional")
                                                        label(for="rdoEmailOptional")
                                                            span
                                                            | {{ $i18n.t('easypay.optional')}}

                                                    div.col-lg-4.col-md-4.col-sm-6.col-xs-6.ta-right.m-t-15
                                                        input(name="email-optional" v-model="requiredFields.email.status" value="required" type="radio" id="rdoEmailMandatory")
                                                        label(for="rdoEmailMandatory")
                                                            span
                                                            | {{ $i18n.t('easypay.mandatory')}}

                                                    div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                                                        input(name="email-placeholder" v-model="requiredFields.email.placeholder" type="text" :placeholder="$i18n.t('easypay.descriptionInHere')" )
                                        <!--2-2-->
                                        div.row.f-row
                                            div.col-lg-3.col-md-3.col-sm-3.col-xs-12.nav-required-fields.m-t-15
                                                div.ta-right
                                                    input(name="usernameOptional" v-model="requiredFields.name.checkbox" type="checkbox" id="chkUserName")
                                                    label(for="chkUserName")
                                                        span
                                                        | {{ $i18n.t('easypay.username')}}

                                            div.nav-optional-radios.col-lg-9.col-md-9.col-sm-9.col-xs-12(v-show="requiredFields.name.checkbox")
                                                div.row
                                                    div.col-lg-4.col-md-4.col-sm-6.col-xs-6.ta-right.m-t-15
                                                        input(name="usernameOptional" v-model="requiredFields.name.status" value="optional" type="radio" id="rdoUsernameOptional")
                                                        label(for="rdoUsernameOptional")
                                                            span
                                                            | {{ $i18n.t('easypay.optional')}}

                                                    div.col-lg-4.col-md-4.col-sm-6.col-xs-6.ta-right.m-t-15
                                                        input(name="usernameOptional" v-model="requiredFields.name.status" value="required" type="radio" id="rdoUsernameMandatory")
                                                        label(for="rdoUsernameMandatory")
                                                            span
                                                            | {{ $i18n.t('easypay.mandatory')}}

                                                    div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                                                        input(name="name-placeholder" v-model="requiredFields.name.placeholder" type="text" :placeholder="$i18n.t('easypay.descriptionInHere')" )

                                        <!--2-3-->
                                        div.row.f-row
                                            div.col-lg-3.col-md-3.col-sm-3.col-xs-12.nav-required-fields.m-t-15
                                                div.ta-right
                                                    input(name="mobileOptional" v-model="requiredFields.mobile.checkbox"  type="checkbox"  id="chkMobile")
                                                    label(for="chkMobile")
                                                        span
                                                        | {{ $i18n.t('easypay.mobile') }}

                                            div.nav-optional-radios.col-lg-9.col-md-9.col-sm-9.col-xs-12(v-show="requiredFields.mobile.checkbox")
                                                div.row
                                                    div.col-lg-4.col-md-4.col-sm-6.col-xs-6.ta-right.m-t-15
                                                        input(name="mobileOptional" v-model="requiredFields.mobile.status" value="optional" type="radio" id="rdoMobileOptional")
                                                        label(for="rdoMobileOptional")
                                                            span
                                                            | {{ $i18n.t('easypay.optional')}}

                                                    div.col-lg-4.col-md-4.col-sm-6.col-xs-6.ta-right.m-t-15
                                                        input(name="mobileOptional" v-model="requiredFields.mobile.status" value="required" type="radio" id="rdoMobileMandatory")
                                                        label(for="rdoMobileMandatory")
                                                            span
                                                            | {{ $i18n.t('easypay.mandatory')}}

                                                    div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                                                        input(name="mobile-placeholder" v-model="requiredFields.mobile.placeholder" type="text" :placeholder="$i18n.t('easypay.descriptionInHere')" )

                                        <!--2-4-->
                                        div.row.f-row
                                            div.col-lg-3.col-md-3.col-sm-3.col-xs-12.nav-required-fields.m-t-15
                                                div.ta-right
                                                    input(name="mobileOptional" v-model="requiredFields.description.checkbox" type="checkbox" id="chkDescription")
                                                    label(for="chkDescription")
                                                        span
                                                        | {{ $i18n.t('easypay.description') }}

                                            div.nav-optional-radios.col-lg-9.col-md-9.col-sm-9.col-xs-12(v-show="requiredFields.description.checkbox")
                                                div.row
                                                    div.col-lg-4.col-md-4.col-sm-6.col-xs-6.ta-right.m-t-15
                                                        input(name="descriptionOptional" v-model="requiredFields.description.status" value="optional" type="radio" id="rdoDescriptionOptional")
                                                        label(for="rdoDescriptionOptional")
                                                            span
                                                            | {{ $i18n.t('easypay.optional')}}

                                                    div.col-lg-4.col-md-4.col-sm-6.col-xs-6.ta-right.m-t-15
                                                        input(name="descriptionOptional" v-model="requiredFields.description.status" value="required" type="radio" id="rdoDescriptionMandatory")
                                                        label(for="rdoDescriptionMandatory")
                                                            span
                                                            | {{ $i18n.t('easypay.mandatory')}}

                                                    div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                                                        input(name="description-placeholder" v-model="requiredFields.description.placeholder" type="text" :placeholder="$i18n.t('easypay.descriptionInHere')" )

                                        div.row
                                            div.col-xs.nav-buttons

                    div.body
                        <!--3-->
                        div.row
                            div.col-lg-7.col-md-7.col-sm-12.col-xs-12
                                transition(name="fade"
                                enter-active-class="fade-in"
                                leave-active-class="fade-out")
                                    div.row
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
                                                                    | {{ $i18n.t('easypay.limitInNumber')}}

                                                            div.ta-right
                                                                input(name="optional" v-model="showReceipt" type="checkbox" id="chkEasypayReceipt")
                                                                label(for="chkEasypayReceipt")
                                                                    span
                                                                    | {{ $i18n.t('easypay.showEasypayReceipt')}}

                                                        div.nav-optional-radios.col-lg-5.col-md-5.col-sm-12.col-xs-12
                                                            input(:class="{'input-danger': errors.has('limit')}" v-validate="'numeric'" v-show="limited" type="number" v-model="limit" :placeholder="$i18n.t('common.count')")
                                                            div.ta-right(v-if="validation('limit')")
                                                                span.text-danger {{  errors.first('limit') }}


                                                        div.col-lg-12.col-md-12.col-xs-12.nav-urls
                                                            <!--Success redirect url-->
                                                            div.row.no-margin
                                                                input.input.ltr-input(v-validate="'url'"  :class="{'input-danger': errors.has('successfulRedirectUrl')}"   v-bind:data-vv-as="$i18n.t('easypay.successfulRedirectUrl')" type="text" v-model="successfulRedirectUrl"  name="successfulRedirectUrl" id="successfulRedirectUrl"  :placeholder= "$i18n.t('easypay.successfulRedirectUrl')" )
                                                                div.ta-right(v-if="validation('successfulRedirectUrl')")
                                                                    span.text-danger {{ errors.first('successfulRedirectUrl') }}

                                                            <!--Failed redirect url-->
                                                            div.row.no-margin
                                                                input.input.ltr-input( v-validate="'url'"  :class="{'input-danger': errors.has('failedRedirectUrl')}"   v-bind:data-vv-as="$i18n.t('easypay.failedRedirectUrl')" type="text" v-model="failedRedirectUrl" id="failedRedirectUrl" name="failedRedirectUrl"  :placeholder= "$i18n.t('easypay.failedRedirectUrl')" )
                                                                div.ta-right(v-if="validation('failedRedirectUrl')")
                                                                    span.text-danger {{ errors.first('failedRedirectUrl') }}

                        div.row
                            div.col-xs.nav-buttons
                                button.btn.success.pull-right.button(v-ripple=""  @click="validateForm") {{$i18n.t('common.edit')}}
                                    svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                        circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

</template>


<script>
    import selectbox from '../../partials/selectbox.vue';
    import purse from '../../partials/purses.vue';
    import loading from '../../partials/loading.vue';
    import VueNumeric from 'vue-numeric';

    export default {
        name: 'pages-easypay-partials-edit',
        data() {
            return {
                loading: false,
                isLoadedEasypay: false,
                is_coupon_active: false,
                easypay: {},
                fileHover: '',
                visibleEmail: '',   //  visible email options
                messages: {},
                title: null,
                description: null,
                price: '',
                payTo: null,
                webservice_id: null,
                purse: null,
                requiredFields: {
                    email: {
                        checkbox: false,
                        status: 'hidden',
                        placeholder: null
                    },
                    name: {
                        checkbox: false,
                        status: 'hidden',
                        placeholder: null
                    },
                    mobile: {
                        checkbox: false,
                        status: 'hidden',
                        placeholder: null
                    },
                    description: {
                        checkbox: false,
                        status: 'hidden',
                        placeholder: null
                    },
                },
                showReceipt: '',
                successfulRedirectUrl: '',
                failedRedirectUrl: '',
                limited: false,
                limit: 0,
            }
        },
        computed: {
            webserviceSelection() {
                if (this.$store.state.auth.user.webservices) {
                    return this.$store.state.auth.user.webservices.filter(function (webservice) {
                        return webservice.status;
                    }).map(function (webservice) {
                        return {
                            'title': webservice.name,
                            'value': webservice.entity_id
                        }
                    });
                }
            },
            pursesSelection() {
                if (this.$store.state.auth.user.purses) {
                    return this.$store.state.auth.user.purses.map(function (purse) {
                        return {
                            'title': '<span class="wallet-color color-' + purse.purse + '"></span>' + purse.name,
                            'value': purse.purse
                        }
                    });
                }
            },
            purseId() {
                return this.purse;
            },
            webserviceId() {
                return this.webservice_id;
            },
        },
        created() {
            this.getEasypay();
        },
        methods: {
            validateForm() {
                this.$validator.validateAll({
                    title: this.title,
                    price: this.price
                }).then((result) => {
                    if (result) {
                        this.editEasypay();
                    }
                });
            },
            removeErrors (field) {
                !!this[field] && this.errors.remove(field);
            },
            selectedPurse(purseId) {
                this.purse = purseId;
                this.webservice_id = null;
            },
            selectedWebservice(entityId) {
                this.webservice_id = entityId;
                this.purse = null;
            },
            changePayTo() {
                if (this.payTo === 'webservice') {
                    this.purse = null;
                    this.purse_name = null;
                } else if (this.payTo === 'purse') {
                    this.webservice_id = null;
                }
            },
            getEasypay() {
                this.$store.state.http.requests['easypay.getShow'].get({'easypay_id': this.$route.params.public_id}).then(
                    (response) => {
                        this.easypay = response.data.data;
                        this.title = response.data.data.title;
                        this.price = response.data.data.price;
                        this.description = response.data.data.description;
                        this.is_coupon_active = response.data.data.is_coupon_active;

                        if (response.data.data.purse && !response.data.data.webservice_id) {
                            this.payTo = 'purse';
                            this.purse = response.data.data.purse;
                        } else {
                            this.payTo = 'webservice';
                            this.webservice_id = response.data.data.webservice_id;
                        }
                        this.limit = response.data.data.limit;

                        this.handleOrderOptions('email');
                        this.handleOrderOptions('mobile');
                        this.handleOrderOptions('name');
                        this.handleOrderOptions('description');
                        this.handleShowReceipt();

                        this.failedRedirectUrl = response.data.data.failed_redirect_url;
                        this.successfulRedirectUrl = response.data.data.successful_redirect_url;
                        this.isLoadedEasypay = true;
                    }, () => {
                        this.isLoadedEasypay = true;
                    }
                );
            },
            editEasypay() {
                if ((this.payTo === 'purse' && !this.purse) || (this.payTo === 'webservice' && !this.webservice_id)) {
                    this.errors.add(
                        'purse',
                        this.$i18n.t('easypay.selectPurseOrWebserviceId'),
                        'api'
                    );
                    return;
                }

                this.loading = true;
                this.handleShowReceiptSave();

                let easyPayData = {
                    title: this.title,
                    description: this.description,
                    is_coupon_active: this.is_coupon_active,
                    price: this.clearNumber(this.price),
                    purse: this.purse,
                    webservice_id: this.webservice_id,
                    required_fields: {
                        email: this.handleOrderOptionsSave('email'),
                        name: this.handleOrderOptionsSave('name'),
                        mobile: this.handleOrderOptionsSave('mobile'),
                        description: this.handleOrderOptionsSave('description')
                    },
                    show_receipt: this.showReceipt,
                    successful_redirect_url: this.successfulRedirectUrl,
                    failed_redirect_url: this.failedRedirectUrl,
                    limited: this.limited,
                    limit: this.limit,
                };

                this.$store.state.http.requests['easypay.getShow'].update({easypay_id: this.$route.params.public_id}, easyPayData).then(
                    () => {
                        this.loading = false;
                        this.changeEasypayState();
                        store.commit('clearValidationErrors');
                        this.$router.push({name: 'easypay.index'});
                    },
                    (response) => {
                        this.loading = false;
                        store.commit('setValidationErrors', response.data.validation_errors);
                        store.commit('flashMessage', {
                            text: response.data.meta.error_type,
                            important: false,
                            type: 'danger'
                        });
                    }
                );
            },
            handleOrderOptions(requireFieldName) {
                let orderStates = {
                    hidden: {
                        checkbox: false,
                        status: 'hidden',
                        placeholder: this.easypay.required_fields[requireFieldName].placeholder
                    },
                    optional: {
                        checkbox: true,
                        status: 'optional',
                        placeholder: this.easypay.required_fields[requireFieldName].placeholder
                    },
                    required: {
                        checkbox: true,
                        status: 'required',
                        placeholder: this.easypay.required_fields[requireFieldName].placeholder
                    },
                };

                return this.requiredFields[requireFieldName] =
                    orderStates[this.easypay.required_fields[requireFieldName].status];
            },
            handleOrderOptionsSave(requireFieldName) {
                if (this.requiredFields[requireFieldName].checkbox) {
                    return {
                        status: this.requiredFields[requireFieldName].status,
                        placeholder: this.requiredFields[requireFieldName].placeholder,
                    }
                }

                return {
                    status: 'hidden',
                    placeholder: null,
                };
            },
            handleShowReceipt() {
                if (this.easypay.show_receipt === 1 || this.easypay.show_receipt === true) {
                    this.showReceipt = true;
                } else {
                    this.showReceipt = false;
                }

                if (this.easypay.limit && this.easypay.limit > 0) {
                    this.limited = true;
                } else {
                    this.limited = false;
                    this.limit = 0;
                }
            },
            handleShowReceiptSave() {
                if (this.showReceipt === false || this.showReceipt === 0) {
                    this.showReceipt = 0;
                } else {
                    this.showReceipt = 1;
                }

                if (!this.limited) {
                    this.limit = 0;
                }
            },
            changeEasypayState(){
                let vm = this;
                let easypayIndex = _.findIndex(this.$store.state.auth.user.easypays, function (easypay) {
                    return easypay.entity_id === vm.$route.params.public_id;
                });

                if (this.title) {
                    this.$store.state.auth.user.easypays[easypayIndex].title = this.title;
                }

                this.$store.state.auth.user.easypays[easypayIndex].description = this.description;
                this.$store.state.auth.user.easypays[easypayIndex].price = this.price;
                this.$store.state.auth.user.easypays[easypayIndex].is_coupon_active = this.is_coupon_active;
                this.$store.state.auth.user.easypays[easypayIndex].purse = this.purse;
                this.$store.state.auth.user.easypays[easypayIndex].required_fields.email = this.requiredFields.email;
                this.$store.state.auth.user.easypays[easypayIndex].required_fields.name = this.requiredFields.name;
                this.$store.state.auth.user.easypays[easypayIndex].required_fields.mobile = this.requiredFields.mobile;
                this.$store.state.auth.user.easypays[easypayIndex].required_fields.description = this.requiredFields.description;
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
            loading,
            VueNumeric
        }
    }

</script>
