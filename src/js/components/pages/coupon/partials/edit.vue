<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('coupon.editCoupon') }}
                p.page-description {{ $i18n.t('coupon.editCouponDescription') }}

        div.row.section.nav-create-coupon
            div.row.box
                <!--Right box-->
                div.right-box.col-lg-6.col-md-6.col-sm-12.col-xs-12
                    div.row
                        div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                            span.label {{ $i18n.t('coupon.offCode') }}
                        div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                            input(:class="{'input-danger': validationErrors.code}" type="text" v-model="code" placeholder="مثال:zarinfriends")
                            div.ta-right(v-if="validationErrors.code")
                                span.text-danger {{ $i18n.t(validationErrors.code) }}

                    div.row
                        div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                            input(name="coupon-type" v-model="type" value="webservice" type="radio" id="rdoWebserviceٌ")
                            label(for="rdoWebserviceٌ")
                                span
                                |{{ $i18n.t('coupon.webservice') }}
                        div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                            selectbox.selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectedWebservice" v-bind:selected="webservice_id" v-bind:data="webserviceSelection" v-bind:class="{'disable' : type == 'easypay' }" placeholder="انتخاب وب سرویس")
                            div.ta-right(v-if="validationErrors.webservice_id")
                                span.text-danger {{ $i18n.t(validationErrors.webservice_id) }}

                    div.row
                        div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                            input(name="coupon-type" v-model="type" value="easypay" type="radio" id="rdoEasypayٌ")
                            label(for="rdoEasypayٌ")
                                span
                                |{{ $i18n.t('coupon.easypay') }}
                        div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                            selectbox.selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectedEasypay" v-bind:data="easypaySelection" v-bind:selected="easypay_id" v-bind:class="{'disable' : type == 'webservice' }"  placeholder="انتخاب آسان پرداخت")
                            div.ta-right(v-if="validationErrors.easypay_id")
                                span.text-danger {{ $i18n.t(validationErrors.easypay_id) }}

                    div.row
                        div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                            span.label {{ $i18n.t('coupon.expirationDate') }}
                        div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                            input(:class="{'input-danger': validationErrors.expired_at}" type="text" v-model="expired_at" placeholder="")
                            div.ta-right(v-if="validationErrors.expired_at")
                                span.text-danger {{ $i18n.t(validationErrors.expired_at) }}

                <!--Left box-->
                div.right-box.col-lg-6.col-md-6.col-sm-12.col-xs-12
                    div.row
                        div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                            input(type="checkbox" v-model="visibleLimit" id= "chkLimit" @change="emptyLimitValue()")
                            label(for="chkLimit")
                                span
                                |{{ $i18n.t('coupon.limit') }}

                        div.col-lg-8.col-md-8.col-sm-12.col-xs-12(v-bind:class="{'disable' : !visibleLimit}")
                            input(:class="{'input-danger': validationErrors.limit}" type="text" v-model="limit" placeholder="محدودیت در تعداد استفاده")
                            div.ta-right(v-if="validationErrors.limit")
                                span.text-danger {{ $i18n.t(validationErrors.limit) }}

                    div.row
                        div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                            span.label {{ $i18n.t('coupon.minAmount') }}
                        div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                            input(:class="{'input-danger': validationErrors.min_amount}"  type="text" v-model="min_amount" placeholder="حداقل مبلغ خرید(تومان)")
                            div.ta-right(v-if="validationErrors.min_amount")
                                span.text-danger {{ $i18n.t(validationErrors.min_amount) }}

                    div.row
                        div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                            span.label {{ $i18n.t('coupon.maxAmount') }}
                        div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                            input(:class="{'input-danger': validationErrors.max_amount}" type="text" v-model="max_amount" placeholder="حداکثر مبلغ خرید(تومان)")
                            div.ta-right(v-if="validationErrors.max_amount")
                                span.text-danger {{ $i18n.t(validationErrors.max_amount) }}

                    div.row
                        div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                            span.label {{ $i18n.t('coupon.offPercent') }}
                        div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                            input(:class="{'input-danger': validationErrors.percent}" type="text" v-model="percent" placeholder="مثال: ۲۵")
                            div.ta-right(v-if="validationErrors.percent")
                                span.text-danger {{ $i18n.t(validationErrors.percent) }}

                    div.row.nav-button
                        div.col-xs
                            button.btn.success.pull-left(v-ripple="" @click="editCoupon") {{$i18n.t('coupon.editCoupon')}}
                                svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                    circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

</template>


<script>
    import selectbox from '../../partials/selectbox.vue';

    export default {
        name: 'pages-coupon-partials-edit',
        data() {
            return {
                loading: false,
                code: '',
                max_amount: '',
                min_amount: '',
                webservice_id: '',
                easypay_id: '',
                expired_at: '',
                limit: '',
                type: 'webservice',
                percent: '',
                visibleLimit: false,
            }
        },
        computed:{
            webserviceSelection() {
                if(this.$store.state.auth.user.webservices) {
                    return this.$store.state.auth.user.webservices.map(function (webservice) {
                        return {
                            'title': webservice.name,
                            'value': webservice.entity_id
                        }
                    });
                }
            },
            easypaySelection() {
                if(this.$store.state.auth.user.easypays) {
                    return this.$store.state.auth.user.easypays.map(function (easypay) {
                        return {
                            'title': easypay.title,
                            'value': easypay.entity_id
                        }
                    });
                }
            },
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
        },
        beforeCreate() {
            this.$store.state.http.requests['coupon.getShow'].get({'coupon_id' : this.$route.params.entity_id}).then(
                (response) => {
                    this.code = response.data.data.code;
                    this.max_amount = response.data.data.discount.max_amount;
                    this.min_amount = response.data.data.min_amount;
                    this.webservice_id = response.data.data.webservice_id;
                    this.easypay_id = response.data.data.easypay_id;
                    this.expired_at = response.data.data.expired_at;
                    this.limit = response.data.data.limit;
                    this.type = response.data.data.type;
                    this.percent = response.data.data.discount.percent;

                    if(response.data.data.limit){
                        this.visibleLimit = true;
                    }
                }
            );
        },
        created(){
            //Add all item to webservice and easypay
            let webserviceAll = {
                'title' : 'همه',
                'value' : 'all'
            };
            this.webserviceSelection.unshift(webserviceAll);

            let easypayAll = {
                'title' : 'همه',
                'value' : 'all'
            };
            this.easypaySelection.unshift(easypayAll);
        },
        methods: {
            emptyLimitValue() {
                this.limit = '';
            },
            selectedWebservice(entityId) {
                this.webservice_id = entityId;
                this.easypay_id = '';
            },
            selectedEasypay(entityId) {
                this.easypay_id = entityId;
                this.webservice_id = '';
            },
            editCoupon() {
                this.loading = true;
                let couponData = {
                    code: this.code,
                    discount: {
                        max_amount: this.max_amount,
                        percent: this.percent
                    },
                    webservice_id: this.webservice_id,
                    easypay_id: this.easypay_id,
                    expired_at: this.expired_at,
                    limit: this.limit,
                    min_amount: this.min_amount,
                    type: this.type,
                };

                let params = {
                    coupon_id: this.$route.params.entity_id
                };

                this.$store.state.http.requests['coupon.getShow'].update(params, couponData).then(
                    ()=> {
                        this.loading = false;
                        this.$router.push({name: 'coupon.index'})
                    },
                    (response) => {
                        this.loading = false;
                        store.commit('setValidationErrors',response.data.validation_errors);
                        store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            type: 'danger'
                        });
                    }
                )
            }
        },
        components: {
            selectbox
        }
    }

</script>
