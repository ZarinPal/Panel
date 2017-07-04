<template lang="pug">
    div.row.trans-row
        div.col-lg-2
            span.nav-user-avatars
                img.users-avatar(:src="debt.avatar" :title="debt.name")
        div.col-lg-6
            span.total-amount {{debt.amount | numberFormat | persianNumbers}}
            small {{ $i18n.t('transaction.toman') }} ،
            span {{debt.description}}
        div.col-lg-2.ta-center
            span {{ debt.created_at | fromNow | persianNumbers}}
        div.col-lg-2.ta-center
            span(v-if="debt.status == 'pending'")
                span.req-btn.btn-decline رد کردن
                span.req-btn.btn-accept پرداخت
            span(v-else)
                span.paid-text(v-if="debt.status == 'paid'") {{ $i18n.t('requestMoney.paid') }}
                span.reject-text(v-else-if="debt.status == 'reject'") {{ $i18n.t('requestMoney.reject') }}
                span.pending-text(v-else-if="debt.status == 'pending'") {{ $i18n.t('requestMoney.pending') }}

</template>

<script>

    export default {
        name: 'request-money-single-debt',
        data() {
          return {

          }
        },
        props:['debt'],
        created(){

        },
        methods: {

        },
    }
</script>
