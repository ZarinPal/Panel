<template lang="pug">
    transition(name="fade"
    enter-active-class="fade-in"
    leave-active-class="fade-out")
        div.modal.coupon-details(v-on:click.self="closeModal()")
            transition(name="zoom"
            enter-active-class="zoom-in"
            leave-active-class="zoom-out")
                div.row.center-xs(v-if="!closeModalContent" v-on:click.self="closeModal()")
                    div.col-lg-5.col-md-5.col-sm-10.col-xs-10.content
                        div.header
                            span.icon-close(@click="closeModal()")
                            span.title {{ $i18n.t('coupon.couponDetails') }}

                        div.body
                            div.contains
                                div.row
                                    div.col-xs.ta-right
                                        span.label {{ $i18n.t('coupon.offCode') }}
                                    div.col-xs.ta-left
                                        div.label-group.pull-left
                                            span.text {{coupon.code}}
                                            span.icon(v-clipboard="")

                                div.row
                                    div.col-xs.ta-right
                                        span.label {{ $i18n.t('coupon.limit') }}
                                    div.col-xs.ta-left
                                        span.value(v-if="coupon.limit") {{coupon.limit | numberFormat | persianNumbers}}
                                        span.value(v-else) {{ $i18n.t('coupon.noLimit') }}

                                div.row
                                    div.col-xs.ta-right
                                        span.label {{ $i18n.t('coupon.webservice') }}
                                    div.col-xs.ta-left
                                        span.value {{coupon.webservice_name}}

                                div.row
                                    div.col-xs.ta-right
                                        span.label {{ $i18n.t('coupon.expirationDate') }}
                                    div.col-xs.ta-left
                                        span.value {{coupon.expired_at | jalali('jYYYY-jMM-jDD') | persianNumbers}}


                                div.row
                                    div.col-xs.ta-right
                                        span.label {{ $i18n.t('coupon.minAmount') }}
                                    div.col-xs.ta-left
                                        span.value {{coupon.min_amount | numberFormat | persianNumbers}}

                                div.row
                                    div.col-xs.ta-right
                                        span.label {{ $i18n.t('coupon.maxAmount') }}
                                    div.col-xs.ta-left
                                        span.value {{coupon.discount.max_amount | numberFormat | persianNumbers}}

                                div.row
                                    div.col-xs.ta-right
                                        span.label {{ $i18n.t('coupon.offPercent') }}
                                    div.col-xs.ta-left
                                        span.value(v-if="coupon.discount.percent") {{coupon.discount.percent | persianNumbers}}
                                        span.value(v-else) -




</template>


<script>

    export default {
        name: 'pages-coupon-partials-details',
        data() {
            return {
                closeModalContent: true,
            }
        },
        props: ['coupon'],
        mounted(){
            this.closeModalContent = false
        },
        computed:{
        },
        methods: {
            closeModal() {
                this.$emit('closeModal')
            }
        },
    }

</script>
