<template lang="pug">
  modal.request-details(v-on:closeModal="closeModal()")
    span(slot="title") {{ $i18n.t('requestMoney.details') }}
    div(slot="content")
      <!--Demand D-->
      div.demand-details(v-if="demand")
        div.nav-top
          div.nav-amount
            span.persian-num {{ demand.total_amount | numberFormat }}
            small {{ $i18n.t('transaction.toman') }}

          div.nav-request-status
            div.row.no-margin
              div.col-xs.ta-right
                span {{ $i18n.t('common.date') }}
              div.col-xs.ta-left
                span.persian-num.persian-num {{ demand.created_at | fromNow }}

            div.row
              div.ta-right
                span {{ $i18n.t('common.description') + ' : ' + demand.description }}

        div.users
          div.ta-right.persons-text {{ $i18n.t('requestMoney.persons') }}

          div.row.no-margin(v-for="(user, index) in demand.user")
            div.col-xs.ta-right
              div.row
                div
                  img.avatar(:src="user.avatar")
                div.col-xs.ta-right
                  div.name {{user.name}}
                  span.amount.persian-num {{user.amount | numberFormat}}
                  small {{ $i18n.t('transaction.toman') }}
            div.ta-left.nav-status
              span(:class="{'paid-text': user.status == 'paid', 'reject-text': user.status == 'reject', 'pending-text': user.status == 'pending'}") {{ $i18n.t('requestMoney.' + user.status) }}

      <!--Debt details-->
      div.debt-details(v-if="debt")
        div.ta-center
          img.avatar(:src="debt.avatar")
          div.name {{debt.name}}
          div.zp-id ZP.{{debt.zp}}

        div.nav-amount
          span.persian-num {{ debt.amount | numberFormat }}
          small {{ $i18n.t('transaction.toman') }}

        div.nav-request-status
          div.row
            div.col-xs.ta-right
              span {{ $i18n.t('requestMoney.condition') }}
            div.col-xs.ta-left
              span(:class="{'paid-text': debt.status == 'paid', 'reject-text': debt.status == 'reject', 'pending-text': debt.status == 'pending'}") {{ $i18n.t('requestMoney.' + debt.status)  }}

          div.row
            div.ta-right
              span {{ $i18n.t('common.description') + ' : ' + debt.description }}

</template>

<script>
  import modal from '../../partials/modal.vue';

  export default {
    name: 'pages-requestMoney-partials-details',
    data() {
      return {}
    },
    props: ['debt', 'demand'],
    mounted() {
      this.closeModalContent = false;
    },
    methods: {
      closeModal() {
        this.$emit('closeModal');
      },
    },
    components: {
      modal
    }
  }
</script>