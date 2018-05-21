<template lang="pug">
  div.inner-content
    div.row.nav-page-header
      div.col-lg-6.col-md-6.col-sm-12.col-xs-12
        p.page-description {{$i18n.t('coupon.couponsDescription')}}

      div.col-lg-6.col-md-6.col-sm-12.col-xs-12
        router-link.btn.success(tag="button" v-bind:to="{ name: 'coupon.create'}")
          span.icon-add-circle
          span.text {{ $i18n.t('coupon.createCoupon') }}

    div.row
      singleCoupon(v-for="coupon in coupons.data" v-bind:key="coupon.entity_id" v-bind:coupon="coupon")

    div.row
      div.col-xs
        div.ta-center(v-if="coupons.status")
          loading

        div.row(v-if="!coupons.status && !coupons.data.length")
          div.col-xs.ta-center
            span.txt-nothing-to-show  {{ $i18n.t('common.nothingToShow') }}

        div.ta-center(v-if="!this.$store.state.paginator.paginator.CouponList.resource.resource && coupons.data.length")
          span.nothing-to-show-text {{ $i18n.t('common.thereIsNoOtherItemToDisplay') }}

</template>

<script>
  import singleCoupon from './partials/single-coupon.vue';
  import loading from '../../pages/partials/loading.vue';

  export default {
    name: 'coupon-index',
    data(){
      return {}
    },
    computed: {
      user(){
        return this.$store.state.auth.user;
      },
      coupons(){
        return {
          data: this.$store.state.paginator.paginator.CouponList.data,
          status: this.$store.state.paginator.paginator.CouponList.isLoading,
          update: this.$store.state.paginator.update,
        };
      }
    },
    created() {
      this.getCoupon();

      let vm = this;
      window.onscroll = function() {
        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight
            && !vm.$store.state.paginator.paginator.CouponList.isLoading) {
          vm.$store.dispatch(
              'paginator/next',
              {
                requestName: "CouponList"
              }
          );
        }
      };
    },
    methods: {
      getCoupon() {
        let vm = this;
        this.$store.dispatch(
            'paginator/make',
            {
              vm,
              resource: vm.$store.state.http.requests['coupon.getIndex'],
              requestName: "CouponList"
            }
        );
      }
    },
    components: {
      singleCoupon,
      loading
    }
  }
</script>
