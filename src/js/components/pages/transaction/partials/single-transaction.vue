<template lang="pug">
    div
        div.row.transaction-row.hand(@click="showTransactionDetail = true" )
            <!--Icon && Transaction id-->
            div.col-lg-2.col-md-3.col-sm-3
                span.transaction-id(v-if="transaction.confirmed =='confirmed'")
                    span(v-if="transaction.effective_sign == 1")
                        span.icon-income-trans

                    span(v-else-if="transaction.effective_sign == 0")
                        span.icon-internal-trans

                    span(v-else-if="transaction.effective_sign == -1")
                        span.icon-outcome-trans

                span(v-else)
                    span.icon-pending-trans

                span.text.persian-num {{transaction.public_id}}

            <!--From -> to -->
            div.col-lg-6.col-md-3.col-sm-4.hidden-xs.nav-to-from(v-if="transaction.confirmed =='confirmed'")
                div.row
                    div.col-lg-6.col-md-12.col-sm-12.col-xs-12.no-margin
                        img.user-image(v-bind:src="'https:'+transaction.from_user.avatar")
                        span.text {{transaction.from_user.name | less}}

                    div.col-lg-6.col-md-12.col-sm-12.col-xs-12.no-margin(v-if="transaction.to_user")
                        span.icon-forward.hidden-sm.hidden-xs
                        img.user-image(v-bind:src="'https:'+transaction.to_user.avatar")
                        span.text {{transaction.to_user.name | less}}


                    div.col-lg-6.col-md-6.col-sm-12.col-xs-12.no-margin(v-else-if="transaction.to_merchant")
                        span.icon-forward.hidden-sm
                        img.user-image(v-bind:src="'https:'+ transaction.to_merchant.avatar")
                        span.text {{transaction.to_merchant.name | less}}

            div.col-lg-6.col-md-6.col-sm-6.hidden-xs.ta-center(v-else)
                span.text {{ $i18n.t('transaction.movingOut') }}

            div.col-lg-2.col-md-2.col-sm-12.col-xs-12.ta-center
                span.text.created.persian-num {{transaction.created | jalali('HH:mm:ss | jYYYY-jMM-jDD')}}

            div.col-lg-1.col-md-2.col-sm-12.col-xs-12.ta-center
                span.nav-amount
                    span(v-if="transaction.confirmed =='confirmed'")
                        span(v-if="transaction.effective_sign == 1")
                            span.text.color-success.persian-num {{transaction.amount | numberFormat}}

                        span(v-if="transaction.effective_sign == 0")
                            span.text.persian-num {{transaction.amount | numberFormat}}


                        span(v-if="transaction.effective_sign == -1")
                            span.text.color-danger.persian-num {{transaction.amount | numberFormat}}


                    small.hidden-lg.show-xs {{ $i18n.t('transaction.toman') }}

            div.col-lg-1.col-md-2.col-sm-2.ta-center.hidden-xs
                span.text.persian-num {{transaction.balance | numberFormat}}

        transactionDetails(v-if="showTransactionDetail" v-bind:transaction="transaction" v-on:closeModal="closeModal()")
</template>
<script>
    import transactionDetails from './transaction-details.vue';

    export default {
        name: 'pages-transaction-partials-singleTransaction',
        data(){
            return {
                showTransactionDetail: false,
            }
        },
        props: ['transaction'],
        methods: {
            closeModal(){
                this.showTransactionDetail = false;
            }
        },
        components: {
            transactionDetails
        }
    }
</script>
