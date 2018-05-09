<template lang="pug">
  modal.ptop(v-on:closeModal="closeModal()")
    div(slot="title") {{ $i18n.t('purse.moneyTransfer') }}
    div(slot="content")
      loading(v-if="requesting")

      div(v-else)
        div(v-if="step == 1")
          div.modal-description
            p {{ $i18n.t('purse.moneyTransferDescription') }}

          form(autocomplete="on" onsubmit="event.preventDefault();")
            div.row
              div.col-xs-12.no-margin
                purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(@click.native="removeErrors('purse')" v-focus="" v-validate="{ rules: {required: true}}" name="purse" v-model="purse" v-bind:data-vv-as="$i18n.t('user.purse')" :class="{'input-danger': errors.has('purse')}" v-on:select="selectedPurse"  tabindex="3" :placeholder="$i18n.t('user.userAddress')")
                div.ta-right(v-if="validation('purse')")
                  span.text-danger {{ errors.first('purse') }}

              div.col-xs.no-right-margin
                vue-numeric.ltr-input(v-validate="{ rules: {required: true}}" v-bind:data-vv-as="$i18n.t('transaction.amount')" :class="{'input-danger': errors.has('amount')}" :currency="$i18n.t('webservice.toman')" separator="," v-model="amount" name="amount" id="amount" :placeholder="$i18n.t('card.transferAmountTitle')")
                div.ta-right(v-if="validation('amount')")
                  span.text-danger {{ errors.first('amount') }}

              div.col-xs.no-left-margin
                input(v-validate="{ rules: {required: true}}" v-bind:data-vv-as="$i18n.t('card.dstZarinpalId')" :class="{'input-danger': errors.has('zpId')}" type="text" v-model="zpId" name="zpId" :placeholder="$i18n.t('card.ptopTo')" tabindex="2")
                div.ta-right(v-if="validation('zpId')")
                  span.text-danger {{ errors.first('zpId') }}

            div.row
              textarea(v-validate="{rules: {required: true, max:255}}" v-bind:data-vv-as="$i18n.t('common.description')" :class="{'input-danger': errors.has('description')}" type="text" v-model="description" name="description" :placeholder="$i18n.t('common.description')" tabindex="4")
              div.ta-right(v-if="validation('description')")
                span.text-danger {{ errors.first('description') }}

            div.row
              div.col-xs.no-margin
                button.btn.success.pull-left(v-ripple="" @click="validateForm" tabindex="5") {{ $i18n.t('purse.nextStep') }}

        div(v-else)
          div.list(v-if="destinationUser")
            div.row
              div.col-xs.ta-right
                span.label {{ $i18n.t('transaction.amount') }}
              div.col-xs.ta-left
                span.value.persian-num {{ this.amount | numberFormat }}
                small {{ $i18n.t('transaction.toman') }}

            div.row
              div.col-xs.ta-right
                span.label {{ $i18n.t('purse.sourceZpId') }}
              div.col-xs.ta-left
                span.value ZP.{{this.$store.state.auth.user.public_id}}

            div.row
              div.col-xs.ta-right
                span.label {{ $i18n.t('purse.sourcePurse') }}
              div.col-xs.ta-left
                span.value(v-if="!purse_name") {{this.purse.name}}
                span.value(v-else) {{this.purse_name.name}}

            div.row
              div.col-xs.ta-right
                span.label {{ $i18n.t('purse.sourceUserName') }}
              div.col-xs.ta-left
                span.value {{this.$store.state.auth.user.name}}

            div.row
              div.col-xs.ta-right
                span.label {{ $i18n.t('purse.destinationZpId') }}
              div.col-xs.ta-left
                span.value {{destinationUser.zp_id}}

            div.row
              div.col-xs.ta-right
                span.label {{ $i18n.t('purse.destinationUserName') }}
              div.col-xs.ta-left
                span.value {{destinationUser.name}}

            div.row
              div.col-xs.ta-right
                span.label {{ $i18n.t('purse.transactionDescription') }}
              div.col-xs.ta-left
                span.value {{this.description}}

          div.row
            div.col-xs.no-margin
              button.btn.success.pull-left(v-ripple="" @click="acceptTransfer") {{ $i18n.t('purse.acceptTransfer') }}
              button.btn.default.pull-left(v-ripple="" @click="declineTransfer")  {{ $i18n.t('purse.declineTransfer') }}

</template>

<script>
  import selectbox from '../../partials/selectbox.vue';
  import purse from '../../partials/purses.vue';
  import modal from '../../partials/modal.vue';
  import loading from '../../partials/loading.vue';
  import alert from "../../../../store/modules/alert";
  import VueNumeric from 'vue-numeric';

  export default {
    name: 'home-purse-ptop',
    data() {
      return {
        requesting: false,
        closeModalContent: true,
        step: 1,
        purse: null,
        zpId: null,
        amount: '',
        description: null,
        destinationUser: null,
        purse_name: null,
      }
    },
    mounted(){
      this.closeModalContent = false
    },
    created() {
      store.commit('clearValidationErrors');
    },
    methods: {
      validateForm() {
        this.$validator.validateAll({
          purse: this.purse,
          zpId: this.zpId,
          amount: this.amount,
          description: this.description
        }).then((result) => {
          if (result) {
            this.confirmPtopData();
          }
        });
      },
      removeErrors: function(field) {
        !!this[field] && this.errors.remove(field);
      },
      closeModal() {
        this.$emit('closeModal')
      },
      selectedPurse(purse) {
        this.purse = purse;
        this.purse_name = this.getPurseName(purse);
      },
      getPurseName(purseId) {
        return _.find(this.$store.state.auth.user.purses, function(purse) {
          return purse.purse === purseId;
        });
      },
      confirmPtopData() {
        if (this.purse && this.amount && this.description && this.zpId) {
          this.requesting = true;

          let zarinId;
          if (this.zpId) {
            zarinId = this.zpId.toLowerCase();
          }

          this.$store.state.http.requests['purse.getInfoByZp'].get(
              {purseId: zarinId}).then(
              (response) => {
                this.requesting = false;
                this.step = 2;
                this.destinationUser = response.data.data;
              },
              (response) => {
                this.requesting = false;
                store.commit('flashMessage', {
                  text: response.data.meta.error_type,
                  important: false,
                  type: 'danger'
                });
                store.commit('setValidationErrors',
                    response.data.validation_errors);
              }
          );
        } else {
          store.commit('flashMessage', {
            text: 'UserPleaseFillAllFieldsLocal',
            important: false,
            type: 'danger'
          });
        }
      },
      acceptTransfer() {
        this.requesting = true;
        let zarinId = null;
        if (this.destinationUser) {
          zarinId = this.destinationUser.zp_id.toLowerCase();
        }

        let ptopData = {
          purse: this.purse,
          zpId: zarinId,
          amount: this.clearNumber(this.amount),
          description: this.description
        };

        this.$store.state.http.requests['transaction.postPurseToPurseTransfer'].save(
            ptopData).then(
            (response) => {
              this.requesting = false;
              this.$router.push({
                name: 'transaction.index',
                params: {
                  id: this.purse,
                  type: 'purse',
                  page: 1,
                  transactionId: response.data.data.transaction_public_id
                }
              });
              store.commit('flashMessage', {
                text: 'UserTransferSuccessLocal',
                type: 'success'
              });
            },
            (response) => {
              this.requesting = false;
              this.step = 1;
              store.commit('flashMessage', {
                text: response.data.meta.error_type,
                type: 'danger'
              });
              store.commit('setValidationErrors',
                  response.data.validation_errors);
            }
        )
      },
      declineTransfer() {
        this.step = 1;
        this.purse = null;
        this.zpId = null;
        this.amount = null;
        this.description = null;
        this.destinationUser = null;
        this.closeModal();
      }
    },
    components: {
      selectbox,
      purse,
      modal,
      loading,
      VueNumeric
    }
  }

</script>
