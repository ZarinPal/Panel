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
                            span.icon(@click="clipboardMessage()" v-clipboard="" v-bind:data-clipboard-text="coupon.code")

                div.row.box-row
                    div.right
                        span.label {{$i18n.t('easypay.limit')}}
                    div.col-xs.ta-left
                        span.text-value(v-if="coupon.limit") {{coupon.limit | persianNumbers}}
                        span.text-value(v-else) {{$i18n.t('easypay.noLimit')}}

                div.row.box-row
                    div.right
                        span.label {{$i18n.t('coupon.webservice')}}

                    div.col-xs.ta-left
                        span.text-value(v-if="!coupon.webservice_name") {{ $i18n.t('coupon.all') }}
                        span.text-value(v-else) {{coupon.webservice_name}}


                div.row.box-row(v-if="coupon.easypay_id")
                    div.right
                        span.label {{$i18n.t('coupon.easypayName')}}

                    div.col-xs.ta-left
                        span.text-value {{coupon.easypay_name}}

                div.row.box-row
                    div.right
                        span.label {{$i18n.t('coupon.expirationDate')}}

                    div.col-xs.ta-left
                        span.text-value {{coupon.expired_at  | jalali('jYYYY-jMM-jDD') | persianNumbers}}

            div.bottom-xs.box-footer
                div.row
                    div.col-xs
                        router-link.edit(tag="span" v-bind:to="{ name: 'coupon.edit', params:{entity_id: coupon.entity_id}}") {{$i18n.t('common.edit')}}
                    div.col-xs
                        span.details(@click="visibleCouponDetails = true") {{$i18n.t('coupon.showDetails')}}

        couponDetails(v-if="visibleCouponDetails" v-on:closeModal="closeModal()" v-bind:coupon="coupon")

</template>
<script>
    import couponDetails from '../partials/details.vue';

    export default {
        name:'pages-coupon-partials-singleCoupon',
        data(){
            return{
                visibleCouponDetails: false,
            }
        },
        props:['coupon'],
        methods:{
            closeModal(){
                this.visibleCouponDetails = false;
            },
            clipboardMessage() {
                store.commit('flashMessage',{
                    text: 'copied',
                    type: 'success',
                    timeout: '500'
                });
            }
        },
        components:{
            couponDetails
        }
    }
</script>
