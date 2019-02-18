<template lang="pug">
  selectbox.cards.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectedCard" v-bind:data="cards" :placeholder="$i18n.t('transaction.selectCard')")
</template>

<script>
  import selectbox from './selectbox.vue';
  export default {
    name: 'cards',
    props: ['visibleNewCard'],
    computed: {
      cards() {
        if (this.$store.state.auth.user.cards) {
          let activeCards = [];

          if (this.visibleNewCard) {
            activeCards = [
              {
                'title': '<div class="col-xs ta-right"><span class="icon icon-add-circle"></span> <span class="nav-card-item-bank-name"> کارت جدید </span></div><div class="col-xs"><span class="nav-card-item-bank-card-id pull-left persian-num"> </span></div>',
                'value': 'NEW',
              }
            ];
          }

          _.forEach(this.$store.state.auth.user.cards, function(card) {
            if (card.status === "Active" && card.iban || card.issuer.slug === 'ZarinCard') {
              let cardPan = card.account_id;
              if (card.issuer.slug === 'ZarinCard')
                cardPan = Vue.options.filters.cardNumber(card.pan);
              activeCards.unshift({
                'title': '<div class="col-xs ta-right"><span class="card-logo bank-logo logo-' +
                card.issuer.slug.toLowerCase() +
                '"></span> <span class="nav-card-item-bank-name">' +
                card.issuer.name +
                '</span></div><div class="col-xs"><span class="nav-card-item-bank-card-id pull-left persian-num">' +
                cardPan + '</span></div>',
                'value': card.entity_id
              });
            }
          });
          return activeCards;
        }
      },
    },
    methods: {
      selectedCard(value) {
        this.$emit('select', value);
      },
    },
    components: {
      selectbox
    }
  };

</script>