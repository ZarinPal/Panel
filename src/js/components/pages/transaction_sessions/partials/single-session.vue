<template lang="pug">
    div
        div.row.transaction-row
            div.col-lg-1.col-xs.ta-center
                span.text.persian-num {{transaction.authority}}
            div.col-lg-2.col-xs.ta-center
                span.text.persian-num {{transaction.amount | numberFormat}}

            div.col-lg-2.col-xs.ta-center.hidden-xs
                span.text.created.persian-num {{transaction.created_at| fromNow }}

            div.col-lg-2.col-xs.ta-center.hidden-xs.hidden-title-md
                span.text.persian-num(v-if="transaction.cellnum") {{transaction.cellnum }}
                span.text.persian-num(v-else) {{ $i18n.t('transactionSession.withoutPhone') }}
            div.col-lg-3.ta-center.hidden-xs.hidden-title-md
                span.text.persian-num(v-if="transaction.email") {{transaction.email  }}
                span.text.persian-num(v-else) {{ $i18n.t('transactionSession.withoutMail') }}
            div.col-lg-2.col-xs.ta-center
                span.text.persian-num(v-if="transaction.transaction.public_id") {{transaction.transaction.public_id  }}
                <!-- router-link.text.persian-num.link.hand(v-if="transaction.transaction.public_id"  v-bind:to="{ name: 'transaction.index', params: {id: transaction.transaction.public_id, type: 'purse', transactionId: transaction.transaction.public_id}}") {{transaction.transaction.public_id  }} -->
                span.text.persian-num(v-else) {{ $i18n.t('transactionSession.unPay') }}

</template>
<script>
    export default {
        name: 'pages-transaction-partials-singleTransaction',
        data(){
            return {
                showTransactionDetail: false,
            }
        },
        props: ['transaction'],
    }
</script>
