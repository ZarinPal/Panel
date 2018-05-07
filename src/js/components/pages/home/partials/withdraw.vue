<template lang="pug">
    modal.withdraw(v-on:closeModal="closeModal()")
        span(slot="title")
            span {{ $i18n.t('transaction.withdraw') }} از کیف‌پول
        div(slot="content")

            <!-- If user dont have any card -->
            div.ta-right(v-if="!cards.length")
                span.message-text {{ $i18n.t('transaction.youDontHaveAnyActiveCardMakeNewDescription') }}

                div.row.no-margin
                    div.col-xs.no-margin.xs-ta-center
                        router-link.btn.success.pull-left(tag="button" v-bind:to="{ name: 'card.index'}")
                            span {{ $i18n.t('card.createCard') }}

            span(v-else)
                div(v-if="this.$store.state.auth.user.cards")
                    form(autocomplete="on" onsubmit="event.preventDefault();")
                        purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(@click.native="removeErrors('purse')" v-focus="" v-validate="{ rules: {required: true}}" name="purse" v-model="purse" id="purse" v-bind:data-vv-as="$i18n.t('user.purse')" :class="{'input-danger': errors.has('purse')}" v-on:select="selectedPurse" tabindex="2" v-bind:selected="purse" :placeholder="$i18n.t('easypay.selectPurse')")
                        div.ta-right(v-if="validation('purse')")
                            span.text-danger {{ errors.first('purse') }}

                        div.row
                            vue-numeric.ltr-input(v-validate="{ rules: {required: true}}" v-bind:data-vv-as="$i18n.t('transaction.amount')" :class="{'input-danger': errors.has('amount')}" :currency="$i18n.t('webservice.toman')" separator="," v-model="amount" name="amount" id="amount" :placeholder="$i18n.t('card.transferAmountTitle')")
                            div.ta-right(v-if="validation('amount')")
                                span.text-danger {{ errors.first('amount') }}

                        div.row
                            cards.cards(@click.native="removeErrors('card_id')" v-validate="{ rules: {required: true}}" name="card_id" v-model="card_id" v-bind:data-vv-as="$i18n.t('card.card')" :class="{'input-danger': errors.has('card_id')}" tabindex="3" v-on:select="selectedCard")
                            div.ta-right(v-if="validation('card_id')")
                                span.text-danger {{ errors.first('card_id') }}

                        div.nav-fees(v-if="!isLoadedFees")
                            div.row.bx.nav-options.ta-right
                                div.full-width.option-row(v-for="fee in validFees" v-bind:class="{'inactive-step' : !fee.is_active}")
                                    input(name="fees" type="radio" :value="fee.id" v-model="feeDetails.id" :id="'rdo' + fee.id" @click="selectFee(fee.id)")
                                    label(:for="'rdo' + fee.id")
                                        span
                                        | {{fee.title}}

                            div.row.bx.fee-date
                                div.col-xs
                                    span حداکثر زمان واریز
                                div.col-xs.left-box
                                    span.persian-num(v-if="feeDetails.details") {{ calcFeeDate(feeDetails.details.reconcile_in)  }}

                            div.row.bx.fee-amount
                                div.col-xs
                                    span.title مبلغ کارمزد
                                div.col-xs.left-box
                                    div.persian-num(v-if="feeDetails.details") {{ feeDetails.details.percent | numberFormat}} %
                                    div.persian-num(v-if="feeDetails.details") {{ withdrawAmount | numberFormat }} تومان

                            div.fee-description
                                span {{ selectedFee.description }}

                        div.ta-center(v-else)
                            loading

                        div.row
                            div.col-xs.no-margin
                                button.btn.success.pull-left(v-ripple="" @click="validateForm" tabindex="4") {{$i18n.t('transaction.withdraw')}}
                                    svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                        circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

                div.nav-not-active-card(v-else)
                    p.title {{ $i18n.t('common.zarinPal') }}
                    p.description {{ $i18n.t('purse.withdraw') }}


                <!--Confirm withdraw-->
                confirm(v-if="confirmVisible" v-on:confirmed="withdraw()" v-on:closeModal="closeModal")
                    span(slot="title") {{$i18n.t('purse.confirmWithdrawTitle')}}
                    div.ta-right(slot="message")
                        div {{$i18n.t('purse.doYouConfirmWithdrawDescription')}}

                    span(slot="messageDanger") {{$i18n.t('requestMoney.no')}}
                    span(slot="messageSuccess") {{$i18n.t('requestMoney.yes')}}
                        svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                            circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

</template>


<script>
  import selectbox from '../../partials/selectbox.vue';
  import loading from '../../partials/loading.vue';
  import modal from '../../partials/modal.vue';
  import cards from '../../partials/cards.vue';
  import purse from '../../partials/purses.vue';
  import confirm from '../../partials/confirm.vue';
  import VueNumeric from 'vue-numeric';

  export default {
    name: 'home-purse-withdraw',
    data() {
      return {
        loading: false,
        closeModalContent: false,
        confirmVisible: false,
        amount: '',
        purse: null,
        redirectUrl: encodeURI(
            'https://' + window.location.hostname + '/'
            + this.$router.resolve({name: 'home.finishAddFund'}).href),
        card: {},
        card_id: null,
        isLoadedFees: false,
        withdrawAmount: 0,
        feeDetails: {
          id: 'default',
          details: null,
        },
        validFees: [],
        selectedFee: {},
        reconcileIn: null,
        fees: [],
      }
    },
    computed: {
      cards() {
        //check user cant withdraw or not
        if (this.$store.state.auth.user.cards) {
          let activeCards = [];
          _.forEach(this.$store.state.auth.user.cards, function(card) {
            if (card.status === "Active") {
              activeCards.unshift(card);
            }
          });
          return activeCards;
        }
      }
    },
    watch: {
      amount: function() {
        this.withdrawAmount = (this.amount * (this.feeDetails.details.percent / 100)).toFixed(0);
      },
    },
    created() {
      store.commit('clearValidationErrors');
      this.getFees();
    },
    mounted() {
      this.closeModalContent = false;
    },
    methods: {
      validateForm() {
        this.$validator.validateAll({
          amount: this.amount,
          card_id: this.card_id,
          purse: this.purse
        }).then((result) => {
          if (result) {
            this.confirmVisible = !this.confirmVisible;
          }
        });
      },
      removeErrors: function(field) {
        this.errors.remove(field);
      },
      closeModal() {
        if (this.confirmVisible) {
          this.confirmVisible = false;
        } else {
          this.$emit('closeModal');
        }
      },
      calcPercentAmount() {
        this.withdrawAmount = (this.clearNumber(this.amount) * (this.feeDetails.details.percent / 100)).toFixed(0);
      },
      calcFeeDate(seconds) {
        let numDays = Math.floor(seconds / 86400);
        let numHours = Math.floor((seconds % 86400) / 3600);
        if (numDays > 0) {
          return numDays + ' روز و ' + numHours + ' ساعت ';
        } else {
          return numHours + ' ساعت ';
        }
      },
      selectedPurse(purseId) {
        this.purse = purseId;
        //get purse amount
        this.getPurseAmount(purseId);
        this.calcPercentAmount();
      },
      selectedCard(cardId) {
        this.card.id = cardId;
        this.card_id = cardId;

        let cardIndex = _.findIndex(this.$store.state.auth.user.cards, function(card) {
          return card.entity_id === cardId;
        });

        this.card.slug = this.$store.state.auth.user.cards[cardIndex].issuer.slug;
        this.getFeeWithdrawMethod();
        this.selectFee();
      },
      selectFee(feeId) {
        if (!feeId) {
          feeId = 'default';
        }

        let feeIndex = _.findIndex(this.fees, function(fee) {
          return fee.id === feeId;
        });

        this.validFees = [];

        this.validFees.push(this.fees[0]);
        let vm = this;
        this.fees.forEach(function(fee, feeIndex) {
          if (feeIndex > 0) {
            fee.withdraw_method.forEach(function(feeMethod) {
              if (vm.card.slug) {
                if (vm.card.slug.toLowerCase() === feeMethod.slug.toLowerCase()) {
                  vm.validFees.push(fee);
                }
              }
            });
          }
        });

        this.selectedFee = this.fees[feeIndex];
        this.getFeeWithdrawMethod();
        this.calcPercentAmount();
      },
      getPurseAmount(purseId) {
        let purseIndex = _.findIndex(this.$store.state.auth.user.purses, function(purse) {
          return purse.purse === purseId;
        });
        this.withdrawAmount = this.$store.state.auth.user.purses[purseIndex].balance.balance;
      },
      getPursesBalances() {
        this.$store.state.auth.updatePurseListener++;
        this.$store.dispatch('auth/fetchPurseBalance');
        this.$store.state.timer.getPurseBalanceTime = Date.now();
      },
      getFeeWithdrawMethod() {
        let cardType = 'default';
        if (this.card.slug === 'ZarinCard') {
          cardType = 'zarincard';
        }

        let feeSlugIndex = _.findIndex(this.selectedFee.withdraw_method, function(fee) {
          return fee.slug === cardType;
        });
        this.feeDetails.details = this.selectedFee.withdraw_method[feeSlugIndex];
      },
      getFees() {
        this.isLoadedFees = true;

        this.$store.state.http.requests['app.fees'].get().then(
            (response) => {
              this.fees = response.data.data;

              //fee init
              let feeIndex = _.findIndex(this.fees, function(fee) {
                return fee.id === 'default';
              });
              this.selectedFee = this.fees[feeIndex];
              this.selectFee();
              this.getFeeWithdrawMethod();

              this.isLoadedFees = false;
            }, () => {
              this.isLoadedFees = false;
            }
        );
      },
      withdraw() {
        this.loading = true;
        let withdrawData = {
          amount: this.clearNumber(this.amount),
          card_id: this.card_id,
          purse: this.purse,
          fee_id: this.feeDetails.id
        };

        this.$store.state.http.requests['transaction.postWithdraw'].save(withdrawData).then(
            (response) => {
              //update purse balance after withdraw
              this.getPursesBalances();
              this.loading = false;
              this.$store.commit('flashMessage', {
                text: response.data.meta.message,
                type: 'success'
              });

              //Close modal after operation success
              this.confirmVisible = false;
              this.$emit('closeModal');

              this.$router.push({
                name: 'transaction.index',
                params: {
                  id: this.purse,
                  type: 'purse',
                  transactionId: response.data.data.transaction_public_id
                }
              });
            },
            (response) => {
              store.commit('setValidationErrors', response.data.validation_errors);
              this.$store.commit('flashMessage', {
                text: response.data.meta.error_type,
                important: false,
                type: 'danger'
              });
              this.loading = false;
            }
        )
      },
    },
    components: {
      selectbox,
      modal,
      cards,
      purse,
      loading,
      confirm,
      VueNumeric
    }
  }
</script>