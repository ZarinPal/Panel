<template lang="pug">
  div.col-xs-12.col-sm-12.col-md-6.col-lg-4.section.single-coupon
    div.box
      div.middle-xs.body

        div.row.box-row
          div.ta-right
            span.label  {{$i18n.t('coupon.offCode')}}

          div.col-xs.ta-ta-left
            div.row.label-group.pull-left
              div.col-xs.text {{coupon.code}}
              div.icon.copy(@click="clipboardMessage()" v-clipboard="" v-bind:data-clipboard-text="coupon.code")

        div.row.box-row
          div.right
            span.label {{$i18n.t('easypay.limit')}}
          div.col-xs.ta-left
            span.text-value(v-if="coupon.limit == '0'") {{$i18n.t('coupon.finished')}}
            span.text-value(v-else-if="coupon.limit == ''") {{$i18n.t('coupon.noLimit')}}
            span.text-value.persian-num(v-else="coupon.limit != ''") {{coupon.limit}}

        div.row.box-row
          div.right
            span.label {{$i18n.t('coupon.webservice')}}

          div.col-xs.ta-left
            span.text-value(v-if="!coupon.webservice_name") {{ $i18n.t('coupon.all') }}
            span.text-value(v-else) {{coupon.webservice_name}}

        div.row.box-row
          div.right
            span.label {{$i18n.t('coupon.easypayName')}}

          div.col-xs.ta-left
            span.text-value(v-if="coupon.easypay_id") {{coupon.easypay_name}}
            span.text-value(v-else) -

        div.row.box-row
          div.right
            span.label {{$i18n.t('coupon.expirationDate')}}

          div.col-xs.ta-left
            span.text-value.persian-num {{coupon.expired_at  | jalali('jYYYY-jMM-jDD') }}

      div.bottom-xs.box-footer
        div.row
          div.col-xs
            router-link.footer-icon.edit(tag="span" v-bind:to="{ name: 'coupon.edit', params:{entity_id: coupon.entity_id}}") {{$i18n.t('common.edit')}}
          div.col-xs
            span.footer-icon.details(@click="visibleCouponDetails = true") {{$i18n.t('coupon.showDetails')}}
          div.col-xs
            span.footer-icon.delete(@click="confirmVisible = true") {{$i18n.t('coupon.delete')}}

    couponDetails(v-if="visibleCouponDetails" v-on:closeModal="closeModal()" v-bind:coupon="coupon")
    confirm(v-if="confirmVisible" v-on:confirmed="deleteCoupon()" v-on:closeModal="closeModal")
      span(slot="title") {{$i18n.t('coupon.deleteCoupon')}}
      div.ta-right(slot="message")
        div.row.no-margin
          div.col-xs-12 {{$i18n.t('coupon.deleteSure')}} {{$i18n.t('coupon.offCode')}} "{{coupon.code}}"  {{$i18n.t('coupon.areYouSure')}}
          div.col-xs-12 {{$i18n.t('coupon.irreversible')}}
      span(slot="messageDanger") {{$i18n.t('common.cancel')}}
      span(slot="messageSuccess") {{$i18n.t('easypay.yesDeleteIt')}}

</template>
<script>
  import couponDetails from '../partials/details.vue';
  import confirm from '../../partials/confirm.vue';

  export default {
    name: 'pages-coupon-partials-singleCoupon',
    data(){
      return {
        confirmVisible: false,
        visibleCouponDetails: false,
      }
    },
    props: ['coupon'],
    methods: {
      closeModal(){
        this.visibleCouponDetails = false;
        store.commit('clearValidationErrors');
      },
      clipboardMessage() {
        store.commit('flashMessage', {
          text: 'Copied',
          type: 'success',
          timeout: '1500'
        });
      },
      closeModal(){
        this.confirmVisible = false;
        this.showHtmlVisible = false;
        this.visibleCouponDetails = false;
        store.commit('clearValidationErrors');
      },
      deleteCoupon() {
        this.confirm = true;
        if (this.confirm) {
          let params = {
            coupon_id: this.coupon.entity_id
          };

          this.$store.state.http.requests['coupon.getShow'].remove(params).then(
              () => {
                let couponIndex = _.findIndex(
                    this.$store.state.paginator.paginator.CouponList.data,
                    {'entity_id': this.coupon.entity_id});
                this.$store.state.paginator.paginator.CouponList.data.splice(
                    couponIndex, 1);
                this.$store.state.paginator.update++;

                store.commit('flashMessage', {
                  text: 'CouponDeletedLocal',
                  important: false,
                  type: 'success'
                });
              },
              (response) => {
                store.commit('flashMessage', {
                  text: response.data.meta.error_type,
                  important: false,
                  type: 'danger'
                });
              }
          )
        }
      }
    },
    components: {
      confirm,
      couponDetails
    }
  }
</script>
