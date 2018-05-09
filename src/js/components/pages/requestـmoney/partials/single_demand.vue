<template lang="pug">
  div
    div.row.trans-row(@click="visibleDetails = true")
      div.col-lg-2.col-md-3.col-sm-3
        span.nav-user-avatars
          img.users-avatar(v-for="user in demand.user" :src="user.avatar" :title="user.name" :class="{'pending-user': user.status == 'pending', 'reject-user': user.status == 'reject', 'paid-user': user.status == 'paid'}")
        span.more-number.persian-num(v-if="demand.user.length > 5") {{ demand.user.length - 5}}+

      div.col-lg-6.col-md-5.col-sm-5
        span.total-amount.persian-num {{demand.total_amount | numberFormat}}
        small {{ $i18n.t('transaction.toman') }} ،
        span {{demand.description}}
      div.col-lg-2.ta-center.col-md-2.col-sm-2
        span.persian-num {{ demand.created_at | fromNow}}
      div.col-lg-2.col-md-2.col-sm-2.ta-center
        <!--span.req-btn.btn-decline رد کردن-->
        <!--span.req-btn.btn-accept پرداخت-->
        span(:class="{'paid-text': requestStatus == 'paid', 'reject-text': requestStatus == 'reject', 'pending-text': requestStatus == 'pending'}") {{ $i18n.t('requestMoney.' + requestStatus)  }}

    <!--Demand details-->
    requestDetails(v-if="visibleDetails" v-bind:demand="demand" v-on:closeModal="closeModal")

</template>

<script>
  import requestDetails from '../partials/request_details.vue';

  export default {
    name: 'request-money-single-demand',
    data() {
      return {
        usersCount: 0,
        requestStatus: null,
        visibleDetails: false
      }
    },
    props: ['demand'],
    created(){
      this.getDemandStatus();
    },
    methods: {
      closeModal() {
        this.visibleDetails = false;
      },
      getDemandStatus() {
        let paidCount = 0;
        let rejectCount = 0;
        this.usersCount = this.demand.user.length;

        this.demand.user.forEach(function(user) {
          if (user.status === 'paid') {
            paidCount++;
          } else if (user.status === 'reject') {
            rejectCount++;
          }
        });

        if (paidCount === this.usersCount) {
          this.requestStatus = 'paid';
        } else if (rejectCount === this.usersCount) {
          this.requestStatus = 'reject';
        } else {
          this.requestStatus = 'pending'
        }
      }
    },
    components: {
      requestDetails
    }
  }
</script>
