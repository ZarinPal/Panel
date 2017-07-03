<template lang="pug">
    div.row.trans-row
        div.col-lg-2
            span.nav-user-avatars
                img.users-avatar(v-for="user in demand.user" :src="user.avatar" :title="user.name" :class="{'pending-user': user.status == 'pending', 'reject-user': user.status == 'reject', 'paid-user': user.status == 'paid'}")
            span.more-number(v-if="demand.user.length > 5") {{ demand.user.length - 5 | persianNumbers}}+

        div.col-lg-6
            span.total-amount {{demand.total_amount | numberFormat | persianNumbers}}
            small {{ $i18n.t('transaction.toman') }} ،
            span {{demand.description}}
        div.col-lg-2.ta-center
            span {{ demand.created_at | fromNow | persianNumbers}}
        div.col-lg-2.ta-center
            <!--span.req-btn.btn-decline رد کردن-->
            <!--span.req-btn.btn-accept پرداخت-->
            span.paid-text(v-if="requestStatus == 'paid'") {{ $i18n.t('requestMoney.paid') }}
            span.reject-text(v-else-if="requestStatus == 'reject'") {{ $i18n.t('requestMoney.reject') }}
            span.pending-text(v-else-if="requestStatus == 'pending'") {{ $i18n.t('requestMoney.pending') }}


</template>

<script>
    export default {
        name: 'request-money-single-demand',
        data() {
          return {
              usersCount: 0,
              requestStatus: null,
          }
        },
        props:['demand'],
        created(){
            this.getDemandStatus();
        },
        methods: {
            getDemandStatus() {
                let paidCount = 0;
                let rejectCount = 0;
                this.usersCount = this.demand.user.length;

                this.demand.user.forEach(function(user){
                    if(user.status === 'paid') {
                        paidCount ++;
                    } else if(user.status === 'reject') {
                        rejectCount++;
                    }
                });

                if (paidCount === this.usersCount) {
                    this.requestStatus = 'paid';
                } else if (rejectCount === this.usersCount){
                    this.requestStatus = 'reject';
                } else {
                    this.requestStatus = 'pending'
                }
            }
        },
    }
</script>
