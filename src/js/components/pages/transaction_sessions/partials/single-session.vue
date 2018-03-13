<template lang="pug">
    div
        div.row.transaction-row.hand
            div.col-lg-2.col-md-3.col-sm-3
                span.text.persian-num {{transaction.authority}}
            div.col-lg-2.col-md-2.col-sm-12.col-xs-12.ta-center
                span.text.created.persian-num {{transaction.created_at }}
            div.col-lg-1.col-md-2.col-sm-12.col-xs-12.ta-center
                span.nav-amount
                    span.text.color-success.persian-num {{transaction.amount }}
                    small.hidden-lg.show-xs {{ $i18n.t('transaction.toman') }}
            div.col-lg-1.col-md-2.col-sm-2.ta-center
                span.text.persian-num {{transaction.cellnum }}
            div.col-lg-3.col-md-2.col-sm-2.ta-center
                span.text.persian-num {{transaction.email  }}
            div.col-lg-1.col-md-2.col-sm-2.ta-center
                span.text.persian-num {{transaction.transaction.public_id  }}

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
