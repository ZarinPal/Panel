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
                                            input.ltr-input(v-mask="{money: true}"  v-validate="'required'" maxlength="15" :class="{'input-danger': errors.has('price')}" v-bind:data-vv-as="$i18n.t('easypay.price')"  type="text" v-model="price" id="price" name="price" :placeholder= "$i18n.t('easypay.priceToman')" tabindex="2")
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
                                                purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(@click.native="removeErrors('purse')" :class="{'disable' : payTo == 'webservice', 'input-danger': errors.has('purse')}" v-on:select="selectedPurse" v-bind:selected="purse" placeholder="انتخاب کیف‌پول" tabindex="4")
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
                                                selectbox.selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(@click.native="removeErrors('purse')" v-on:select="selectedWebservice" v-bind:selected="webserviceId" v-bind:data="webserviceSelection" :class="{'disable' : payTo == 'purse', 'input-danger': errors.has('webservice_id')}" placeholder="انتخاب وب‌سرویس")
                                                div.ta-right(v-if="validation('webservice_id')")
                                                    span.text-danger {{ errors.first('webservice_id') }}

                                        div.cb
                                        div.row.nav-buttons
                            div.col-lg-5.col-md-5.col-sm-12.col-xs-12

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
                                                        | {{ $i18n.t('common.email')}}

                                            div.nav-optional-radios.col-lg-7.col-md-7.col-sm-7.col-xs-12(v-show="requiredFields.email.checkbox")
                                                div.row
                                                    div.col-xs.ta-right
                                                        input(name="email-optional" v-model="requiredFields.email.radio" value="0" type="radio" id="rdoEmailOptional")
                                                        label(for="rdoEmailOptional")
                                                            span
                                                            | {{ $i18n.t('easypay.optional')}}

                                                    div.col-xs.ta-right
                                                        input(name="email-optional" v-model="requiredFields.email.radio" value="1" type="radio" id="rdoEmailMandatory")
                                                        label(for="rdoEmailMandatory")
                                                            span
                                                            | {{ $i18n.t('easypay.mandatory')}}

                                        <!--2-2-->
                                        div.row.f-row
                                            div.col-lg-5.col-md-5.col-sm-5.col-xs-12.nav-required-fields
                                                div.ta-right
                                                    input(name="usernameOptional" v-model="requiredFields.name.checkbox" type="checkbox" id="chkUserName")
                                                    label(for="chkUserName")
                                                        span
                                                        | {{ $i18n.t('easypay.username')}}

                                            div.nav-optional-radios.col-lg-7.col-md-7.col-sm-7.col-xs-12(v-show="requiredFields.name.checkbox")
                                                div.row
                                                    div.col-xs.ta-right
                                                        input(name="usernameOptional" v-model="requiredFields.name.radio" value="0" type="radio" id="rdoUsernameOptional")
                                                        label(for="rdoUsernameOptional")
                                                            span
                                                            | {{ $i18n.t('easypay.optional')}}

                                                    div.col-xs.ta-right
                                                        input(name="usernameOptional" v-model="requiredFields.name.radio" value="1" type="radio" id="rdoUsernameMandatory")
                                                        label(for="rdoUsernameMandatory")
                                                            span
                                                            | {{ $i18n.t('easypay.mandatory')}}

                                        <!--2-3-->
                                        div.row.f-row
                                            div.col-lg-5.col-md-5.col-sm-5.col-xs-12.nav-required-fields
                                                div.ta-right
                                                    input(name="mobileOptional" v-model="requiredFields.mobile.checkbox"  type="checkbox"  id="chkMobile")
                                                    label(for="chkMobile")
                                                        span
                                                        | {{ $i18n.t('easypay.mobile') }}

                                            div.nav-optional-radios.col-lg-7.col-md-7.col-sm-7.col-xs-12(v-show="requiredFields.mobile.checkbox")
                                                div.row
                                                    div.col-xs.ta-right
                                                        input(name="mobileOptional" v-model="requiredFields.mobile.radio" value="0" type="radio" id="rdoMobileOptional")
                                                        label(for="rdoMobileOptional")
                                                            span
                                                            | {{ $i18n.t('easypay.optional')}}

                                                    div.col-xs.ta-right
                                                        input(name="mobileOptional" v-model="requiredFields.mobile.radio" value="1" type="radio" id="rdoMobileMandatory")
                                                        label(for="rdoMobileMandatory")
                                                            span
                                                            | {{ $i18n.t('easypay.mandatory')}}


                                        div.row
                                            div.col-xs.nav-buttons


                    div.body
                        <!--3-->
                        div.row
                            div.col-lg-7.col-md-7.col-sm-12.col-xs-12
                                <!--div.nav-switch-->
                                <!--label.switch-label(for="chkType") {{ $i18n.t('easypay.advance')}}-->
                                <!--label.switch-->
                                <!--input(type="checkbox" id="chkType" v-model="type")-->
                                <!--span.slider.round-->

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
                                                            input(:class="{'input-danger': errors.has('limit')}" v-validate="{type: 'number'}" v-show="limited" type="number" v-model="limit" placeholder="تعداد")
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
                title: null,
                description: null,
                price: null,
                payTo: null,
                webservice_id: null,
                purse: null,
                requiredFields: {
                    email: {
                        checkbox: false,
                        radio: 0,
                    },
                    name: {
                        checkbox: false,
                        radio: 0,
                    },
                    mobile: {
                        checkbox: false,
                        radio: 0,
                    }
                },
                showReceipt: '',
                successfulRedirectUrl: '',
                failedRedirectUrl: '',
                limited: 0,
                limit: '',
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
            validation(name) {
                if (this.$store.state.alert.validationErrors[name]) {
                    let element = _.find(this.$validator.fields.items, function (field) {
                        return field.name == name;
                    });
                    this.errors.add(
                        name,
                        this.$validator.dictionary.container.fa.messages[this.$store.state.alert.validationErrors[name].rule](
                            element.el.dataset.vvAs,
                            this.$store.state.alert.validationErrors[name].params
                        ),
                        'api'
                    );
                    this.$store.state.alert.validationErrors[name] = false;
                }
                return this.errors.has(name);
            },
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

                        if (response.data.data.purse && !response.data.data.webservice_id) {
                            this.payTo = 'purse';
                            this.purse = response.data.data.purse;
                        } else {
                            this.payTo = 'webservice';
                            this.webservice_id = response.data.data.webservice_id;
                        }

//                        if (
//                            response.data.data.show_receipt ||
//                            response.data.data.successful_redirect_url ||
//                            response.data.data.failed_redirect_url ||
//                            response.data.data.limit
//                        ) {
//                            this.type = 1;
//                        } else {
//                            this.type = 0
//                        }
                        this.limit = response.data.data.limit;

                        this.handleOrderOptions('email');
                        this.handleOrderOptions('mobile');
                        this.handleOrderOptions('name');
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

                let price = this.price;
                if (/,/g.test(price)) {
                    price = price.replace(/,/g, "");
                }
                let easyPayData = {
                    title: this.title,
                    description: this.description,
                    price: price,
                    purse: this.purse,
                    webservice_id: this.webservice_id,
                    required_fields: {
                        email: this.handleOrderOptionsSave('email'),
                        name: this.handleOrderOptionsSave('name'),
                        mobile: this.handleOrderOptionsSave('mobile')
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
                            text: response.data.meta.error_message,
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
                        radio: 0,
                    },
                    optional: {
                        checkbox: true,
                        radio: 0,
                    },
                    required: {
                        checkbox: true,
                        radio: 1,
                    },
                };
                return this.requiredFields[requireFieldName] =
                    orderStates[this.easypay.required_fields[requireFieldName]];
            },
            handleOrderOptionsSave(requireFieldName) {
                if (this.requiredFields[requireFieldName].checkbox) {
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
                    this.showReceipt = 1;
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
                let easypayIndex = _.findIndex(this.$store.state.auth.user.easypays, function (easypay) {
                    return easypay.entity_id === vm.$route.params.public_id;
                });

                //this is error sometimes i dont know why :(
                if (this.title) {
                    this.$store.state.auth.user.easypays[easypayIndex].title = this.title;
                }

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
