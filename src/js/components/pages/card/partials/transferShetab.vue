<template lang="pug">
    modal.transfer-shetab(v-on:closeModal="closeModal()")
        div(slot="title") {{ $i18n.t('purse.shetabMoneyTransfer') }}
        div(slot="content")
            div.nav-loading(v-if="requesting")
                svg.material-spinner(width="30px" height="30px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                    circle.path-colors(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

            div(v-else)
                div(v-if="step == 1")
                    div.row.no-margin
                        div.col-xs.no-right-margin
                            input(:class="{'input-danger': validationErrors.password}" type="password" v-model="password" placeholder="رمز دوم")
                            div.ta-right(v-if="validationErrors.password")
                                span.text-danger {{ $i18n.t(validationErrors.password) }}

                        div.col-xs.no-left-margin
                            input(:class="{'input-danger': validationErrors.cvv2}" type="text" v-model="cvv2" placeholder="cvv2")
                            div.ta-right(v-if="validationErrors.cvv2")
                                span.text-danger {{ $i18n.t(validationErrors.cvv2) }}

                    div.row.no-margin
                        input(:class="{'input-danger': validationErrors.dst_pan}" type="text" v-model="dstPan" placeholder="شماره کارت مقصد")
                        div.ta-right(v-if="validationErrors.dst_pan")
                            span.text-danger {{ $i18n.t(validationErrors.dst_pan) }}

                    div.row.no-margin
                        input(:class="{'input-danger': validationErrors.amount}" type="text" v-model="amount" placeholder="مبلغ")
                        div.ta-right(v-if="validationErrors.amount")
                            span.text-danger {{ $i18n.t(validationErrors.amount) }}

                    div.row.no-margin
                        div.col-xs.no-left-margin
                            button.btn.success.pull-left(v-ripple="" @click="confirmTransfer") {{ $i18n.t('purse.nextStep') }}

                div.list(v-else)
                    span(v-if="destinationUser && !transferResponse")
                        div.row
                            div.col-xs.ta-right
                                span.label شماره کارت مبدا
                            div.col-xs.ta-left
                                span.value {{card.pan| persianNumbers}}
                        div.row
                            div.col-xs.ta-right
                                span.label شماره کارت مقصد
                            div.col-xs.ta-left
                                span.value {{this.dstPan | persianNumbers}}
                        div.row
                            div.col-xs.ta-right
                                span.label بانک صادر کننده
                            div.col-xs.ta-left
                                span.value {{destinationUser.bank_info.name}}
                        div.row
                            div.col-xs.ta-right
                                span.label نام صاحب حساب
                            div.col-xs.ta-left
                                span.value {{destinationUser.holder_name}}
                        div.row
                            div.col-xs.ta-right
                                span.label مبلغ {{ '(' + $i18n.t('transaction.toman') + ')' }}
                            div.col-xs.ta-left
                                span.value {{this.amount | numberFormat | persianNumbers}}

                        div.row.nav-buttons.no-left-margin
                            div.col-xs.no-margin
                                button.btn.success.pull-left(v-ripple="" @click="acceptTransfer") {{ $i18n.t('purse.acceptTransfer') }}
                                    svg.material-spinner(v-if="transferCompelled" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                        circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

                                button.btn.default.pull-left(v-ripple="" @click="declineTransfer")  {{ $i18n.t('purse.declineTransfer') }}


                    <!--Show transfer response-->
                    span(v-else)
                        div.row
                            div.col-xs.ta-right
                                span.label موجودی کارت
                            div.col-xs.ta-left
                                span.value {{ transferResponse.card_balance| numberFormat | persianNumbers}}
                        div.row
                            div.col-xs.ta-right
                                span.label تاریخ
                            div.col-xs.ta-left
                                span.value {{transferResponse.date | persianNumbers}}
                        div.row
                            div.col-xs.ta-right
                                span.label نام صاحب حساب مقصد
                            div.col-xs.ta-left
                                span.value {{transferResponse.dst_card_holder_name}}
                        div.row
                            div.col-xs.ta-right
                                span.label شماره حساب مقصد
                            div.col-xs.ta-left
                                span.value {{transferResponse.dst_card_pan | persianNumbers}}
                        div.row
                            div.col-xs.ta-right
                                span.label شماره مرجع
                            div.col-xs.ta-left
                                span.value {{transferResponse.ref_id | persianNumbers}}
                        div.row
                            div.col-xs.ta-right
                                span.label مقدار
                            div.col-xs.ta-left
                                span.value {{transferResponse.transfer_amount | numberFormat | persianNumbers}}
</template>


<script>
    import modal from '../../partials/modal.vue';

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

                this.$store.state.http.requests['zarincard.getHolderName'].get({destPan: this.dstPan}).then(
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
                let transferData ={
                    card_id: this.card.entity_id,
                    password: this.password,
                    cvv2: this.cvv2,
                    dst_pan: this.dstPan,
                    amount: this.amount
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
            modal
        }
    }

</script>