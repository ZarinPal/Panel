<template lang="pug">
    div.col-xs-12.col-sm-12.col-md-6.col-lg-6.section
        div.box
            div.middle-xs.body

                div.row.box-row
                    div.col-xs.ta-right
                        span.label  {{$i18n.t('coupon.offCode')}}

                    div.col-xs.ta-ta-left
                        div.label-group.pull-left
                            span.text {{coupon.code}}
                            span.icon


                div.row.box-row(v-if="coupon.limit")
                    div.right
                        span.label {{$i18n.t('easypay.limit')}}
                    div.col-xs.ta-left
                        span.text-value {{coupon.limit}}

                div.row.box-row(v-else)
                    div.right
                        span.text-value {{$i18n.t('easypay.noLimit')}}

                div.row.box-row(v-if="coupon.webservice_id")
                    div.right
                        span.label {{$i18n.t('coupon.webservice')}}

                    div.col-xs.ta-left
                        span.text-value {{coupon.webservice_name}}

                div.row.box-row(v-if="coupon.easypay_id")
                    div.right
                        span.label {{$i18n.t('coupon.easypayName')}}

                    div.col-xs.ta-left
                        span.text-value {{coupon.easypay_name}}

                div.row.box-row
                    div.right
                        span.label {{$i18n.t('coupon.expirationDate')}}

                    div.col-xs.ta-left
                        span.text-value {{coupon.expired_at | jalali("jYYYY/jM/jD") | persianNumbers}}

            div.bottom-xs.box-footer
                div.row
                    div.col-xs
                        router-link.edit(tag="span" v-bind:to="{ name: 'auth.register'}") {{$i18n.t('common.edit')}}
                    div.col-xs
                        router-link.details(tag="span" v-bind:to="{ name: 'auth.register'}") {{$i18n.t('coupon.showDetails')}}

</template>
<script>
    export default {
        name:'pages-coupon-partials-singleCoupon',
        data(){
            return{
            }
        },
        props:['coupon'],
        methods:{
        }
    }
</script>
