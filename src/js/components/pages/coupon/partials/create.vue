<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('coupon.createCoupon') }}
                p.page-description {{ $i18n.t('coupon.createCouponDescription') }}

        div.row.section.nav-create-coupon
            div.row.box
                <!--Right box-->
                div.right-box.col-lg-6.col-md-6.col-sm-12.col-xs-12
                    div.row
                        div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                            span.label {{ $i18n.t('coupon.offCode') }}
                        div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                            input(type="text" v-model="code" placeholder="مثال:zarinfriends")


                    div.row
                        div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                            input(name="coupon-type" v-model="type" value="webservice" type="radio" id="rdoWebserviceٌ")
                            label(for="rdoWebserviceٌ")
                                span
                                |{{ $i18n.t('coupon.webservice') }}
                        div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                            selectbox.selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectedWebservice" v-bind:data="webserviceSelection" v-bind:class="{'disable' : type == 'easypay' }" placeholder="انتخاب وب سرویس")


                    div.row
                        div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                            input(name="coupon-type" v-model="type" value="easypay" type="radio" id="rdoEasypayٌ")
                            label(for="rdoEasypayٌ")
                                span
                                |{{ $i18n.t('coupon.easypay') }}
                        div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                            selectbox.selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectedEasypay" v-bind:data="easypaySelection" v-bind:class="{'disable' : type == 'webservice' }"  placeholder="انتخاب آسان پرداخت")

                    div.row
                        div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                            span.label {{ $i18n.t('coupon.expirationDate') }}
                        div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                            input(type="text" v-model="expired_at" placeholder="")

                <!--Left box-->
                div.right-box.col-lg-6.col-md-6.col-sm-12.col-xs-12
                    div.row
                        div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                            input(type="checkbox" v-model="visibleLimit" id= "chkLimit")
                            label(for="chkLimit")
                                span
                                |{{ $i18n.t('coupon.limit') }}

                        div.col-lg-8.col-md-8.col-sm-12.col-xs-12(v-bind:class="{'disable' : !visibleLimit}")
                            input(type="text" v-model="limit" placeholder="محدودیت در تعداد استفاده")

                    div.row
                        div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                            span.label {{ $i18n.t('coupon.minAmount') }}
                        div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                            input(type="text" v-model="min_amount" placeholder="حداقل مبلغ خرید(تومان)")

                    div.row
                        div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                            span.label {{ $i18n.t('coupon.maxAmount') }}
                        div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                            input(type="text" v-model="max_amount" placeholder="حداکثر مبلغ خرید(تومان)")

                    div.row
                        div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                            span.label {{ $i18n.t('coupon.offPercent') }}
                        div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                            input(type="text" v-model="percent" placeholder="مثال: ۲۵")

                    div.row.nav-button
                        div.col-xs
                            button.btn.success.pull-left(v-ripple="" @click="createCoupon") {{$i18n.t('coupon.createCoupon')}}

</template>


<script>
    import selectbox from '../../partials/selectbox.vue';

    export default {
        name: 'pages-coupon-partials-create',
        data() {
            return {
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
            }
        },
        mounted(){
            this.closeModalContent = false
        },
        methods: {
            selectedWebservice(entityId) {
                this.webservice_id = entityId;
                this.easypay_id = '';
            },
            selectedEasypay(entityId) {
                this.easypay_id = entityId;
                this.webservice_id = '';
            },
            createCoupon() {
                let couponData = {
                    code: this.code,
                    discount: {
                        max_amount: this.max_amount
                    },
                    webservice_id: this.webservice_id,
                    easypay_id: this.easypay_id,
                    expired_at: this.expired_at,
                    limit: this.limit,
                    min_amount: this.min_amount,
                    type: this.type,
                };

                this.$store.state.http.requests['coupon.getIndex'].save(couponData).then(
                    ()=> {
                        this.$router.push({name: 'coupon.index'})
                    },
                    (response) => {
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
