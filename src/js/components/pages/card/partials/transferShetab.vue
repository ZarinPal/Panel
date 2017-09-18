<template lang="pug">
    modal.transfer-shetab(v-on:closeModal="closeModal()")
        div(slot="title") {{ $i18n.t('purse.shetabMoneyTransfer') }}
        div(slot="content")
            loading(v-if="requesting")

            div(v-else)
                div(v-if="step == 1")
                    form(autocomplete="on" onsubmit="event.preventDefault();")
                        div.row.no-margin
                            div.col-xs.no-right-margin
                                input(v-validate="{type: 'number'}" :class="{'input-danger': validationErrors.password}" type="password" v-model="password" placeholder="رمز دوم")
                                div.ta-right(v-if="validationErrors.password")
                                    span.text-danger {{ $i18n.t(validationErrors.password) }}

                            div.col-xs.no-left-margin
                                input(v-validate="{type: 'number'}" :class="{'input-danger': validationErrors.cvv2}" type="password" v-model="cvv2" placeholder="CVV2")
                                div.ta-right(v-if="validationErrors.cvv2")
                                    span.text-danger {{ $i18n.t(validationErrors.cvv2) }}

                        div.row.no-margin
                            input(v-validate="{type: 'number'}" maxlength="19" :class="{'input-danger': validationErrors.dst_pan}" type="text" v-model="dstPan" id="dstPan" @keyup="cardNumberFormat('dstPan')" placeholder="شماره کارت مقصد")
                            div.ta-right(v-if="validationErrors.dst_pan")
                                span.text-danger {{ $i18n.t(validationErrors.dst_pan) }}

                        div.row.no-margin
                            input(v-validate="{type: 'number', money: true}" maxlength="15" :class="{'input-danger': validationErrors.amount}" type="text" v-model="amount" placeholder="مبلغ")
                            div.ta-right(v-if="validationErrors.amount")
                                span.text-danger {{ $i18n.t(validationErrors.amount) }}

                        div.row.no-margin
                            div.col-xs.no-left-margin.nav-buttons
                                button.btn.success.pull-left(v-ripple="" @click="confirmTransfer") {{ $i18n.t('purse.nextStep') }}

                div.list(v-else)
                    span(v-if="destinationUser && !transferResponse")
                        div.row
                            div.col-xs.ta-right
                                span.label {{ $i18n.t('card.srcAccountNumber')}}
                            div.col-xs.ta-left
                                span.value {{card.pan| persianNumbers}}
                        div.row
                            div.col-xs.ta-right
                                span.label {{ $i18n.t('card.distCardNumber')}}
                            div.col-xs.ta-left
                                span.value {{this.dstPan | persianNumbers}}
                        div.row
                            div.col-xs.ta-right
                                span.label {{ $i18n.t('card.exporterBank')}}
                            div.col-xs.ta-left
                                span.value {{destinationUser.bank_info.name}}
                        div.row
                            div.col-xs.ta-right
                                span.label  {{ $i18n.t('card.accountOwnerName')}}
                            div.col-xs.ta-left
                                span.value {{destinationUser.holder_name}}
                        div.row
                            div.col-xs.ta-right
                                span.label {{$i18n.t('common.amount') + '(' + $i18n.t('transaction.toman') + ')' }}
                            div.col-xs.ta-left
                                span.value {{this.amount | numberFormat | persianNumbers}}

                        div.row.nav-buttons.no-left-margin.nav-buttons
                            div.col-xs.no-margin
                                button.btn.success.pull-left(v-ripple="" @click="acceptTransfer") {{ $i18n.t('purse.acceptTransfer') }}
                                    svg.material-spinner(v-if="transferCompelled" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                        circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

                                button.btn.default.pull-left(v-ripple="" @click="declineTransfer")  {{ $i18n.t('purse.declineTransfer') }}


                    <!--Show transfer response-->
                    span(v-else)
                        div.row
                            div.col-xs.ta-right
                                span.label {{ $i18n.t('card.cardBalance')}}
                            div.col-xs.ta-left
                                span.value {{ transferResponse.card_balance| numberFormat | persianNumbers}}
                        div.row
                            div.col-xs.ta-right
                                span.label {{ $i18n.t('common.date')}}
                            div.col-xs.ta-left
                                span.value {{transferResponse.date | persianNumbers}}
                        div.row
                            div.col-xs.ta-right
                                span.label  {{ $i18n.t('card.distAccountOwnerName')}}
                            div.col-xs.ta-left
                                span.value {{transferResponse.dst_card_holder_name}}
                        div.row
                            div.col-xs.ta-right
                                span.label {{ $i18n.t('card.distAccountNumber')}}
                            div.col-xs.ta-left
                                span.value {{transferResponse.dst_card_pan | persianNumbers}}
                        div.row
                            div.col-xs.ta-right
                                span.label {{ $i18n.t('card.refrenceNumber')}}
                            div.col-xs.ta-left
                                span.value {{transferResponse.ref_id | persianNumbers}}
                        div.row
                            div.col-xs.ta-right
                                span.label {{ $i18n.t('card.amount')}}
                            div.col-xs.ta-left
                                span.value {{transferResponse.transfer_amount | numberFormat | persianNumbers}}
</template>


<script>
    import modal from '../../partials/modal.vue';
    import loading from '../../partials/loading.vue';

    export default {
        name: 'pages-card-partials-transferShetab',
        data() {
            return {
                loading: false,
                closeModalContent: true,
                destinationUser: null,
                transferResponse: null,
                requesting: false,
                transferCompelled: false,
                step:1,
                cardId: null,
                password: null,
                cvv2: null,
                dstPan: null,
                amount: null,
            }
        },
        props:['card'],
        computed:{
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            }
        },
        methods: {
            cardNumberFormat(inputId) {
                let text = document.getElementById(inputId).value;
                let result = [];
                if(text) {
                    text = this[inputId].replace(/[^\d]/g, "");
                    while (text.length > 4) {
                        result.push(text.substring(0, 4));
                        text = text.substring(4);
                    }
                    if (this[inputId].length > 0) result.push(text);
                    this[inputId] = result.join("-");
                }

            },
            closeModal() {
                this.$emit('closeModal')
            },
            confirmTransfer() {
                if(!this.dstPan) {
                    store.commit('flashMessage',{
                        text: 'enter-destination-card-number',
                        important: false,
                        type: 'danger'
                    });
                    return
                }

                this.requesting = true;
                let destPan = this.dstPan.split('-').join('');

                this.$store.state.http.requests['zarincard.getHolderName'].get({destPan: destPan}).then(
                    (response)=> {
                        this.step = 2;
                        this.requesting = false;
                        this.destinationUser = response.data.data;
                    },
                    (response) => {
                        this.requesting = false;
                        store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            important: false,
                            type: 'danger'
                        });
                        store.commit('setValidationErrors',response.data.validation_errors);
                    }
                );
            },
            acceptTransfer() {
                this.transferCompelled = true;

                let destPan = this.dstPan.split('-').join('');
                let amount = this.amount.replace(/,/g, "");

                let transferData ={
                    card_id: this.card.entity_id,
                    password: this.password,
                    cvv2: this.cvv2,
                    dst_pan: destPan,
                    amount: amount
                };

                this.$store.state.http.requests['zarincard.postTransferShetab'].save(transferData).then(
                    (response)=> {
                        this.step = 2;
                        this.requesting = false;
                        this.transferCompelled = false;
                        this.transferResponse = response.data.data;
                        this.validationErrors = null;
                    },
                    (response) => {
                        this.step = 1;
                        this.transferCompelled = false;
                        this.requesting = false;
                        store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            important: false,
                            type: 'danger'
                        });
                        store.commit('setValidationErrors',response.data.validation_errors);
                    }
                );
            },
            declineTransfer() {
                this.step = 1;
                this.loading = false;
                this.destinationUser = null;
                this.cardId = null;
                this.password = null;
                this.cvv2 = null;
                this.dstPan = null;
                this.amount = null;
                this.closeModal();
            }
        },
        components: {
            modal,
            loading
        }
    }

</script>