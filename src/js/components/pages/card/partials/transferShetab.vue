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
                                input(v-focus="" v-validate="{ rules: {required: true}}" v-bind:data-vv-as="$i18n.t('common.secondaryPass')" :class="{'input-danger': errors.has('password')}" type="password" v-model="password" name="password" :placeholder="$i18n.t('common.secondaryPass')")
                                div.ta-right(v-if="validation('password')")
                                    span.text-danger {{ errors.first('password') }}

                            div.col-xs.no-left-margin
                                input(v-validate="{ rules: {required: true, numeric: true}}" v-bind:data-vv-as="$i18n.t('common.cvv2')" :class="{'input-danger': errors.has('cvv2')}" type="password" v-model="cvv2" name="cvv2" :placeholder="$i18n.t('common.cvv2')")
                                div.ta-right(v-if="validation('cvv2')")
                                    span.text-danger {{ errors.first('cvv2') }}

                        div.row.no-margin
                            input.ltr-input(v-validate="{ rules: {required: true, max:19}}" v-bind:data-vv-as="$i18n.t('card.distCardNumber')" maxlength="19" :class="{'input-danger': errors.has('dst_pan')}" type="text" v-model="dst_pan" name="dst_pan" id="dst_pan" @keyup="cardNumberFormat('dst_pan')" :placeholder="$i18n.t('card.distCardNumber')")
                            div.ta-right(v-if="validation('dst_pan')")
                                span.text-danger {{ errors.first('dst_pan') }}

                        div.row.no-margin
                            input.ltr-input(v-mask="{money: true, min_value:100}" v-validate="{ rules: {required: true}}" v-bind:data-vv-as="$i18n.t('card.transferAmountTitle')" maxlength="15" :class="{'input-danger': errors.has('amount')}" type="text" v-model="amount" name="amount" :placeholder="$i18n.t('card.transferAmountTitle')")
                            div.ta-right(v-if="validation('amount')")
                                span.text-danger {{ errors.first('amount') }}

                        div.row.no-margin
                            div.col-xs.no-left-margin.nav-buttons
                                button.btn.success.pull-left(v-ripple="" @click="validateForm") {{ $i18n.t('purse.nextStep') }}

                div.list(v-else)
                    span(v-if="destinationUser && !transferResponse")
                        div.row
                            div.col-xs.ta-right
                                span.label {{ $i18n.t('card.srcAccountNumber')}}
                            div.col-xs.ta-left
                                span.value.persian-num {{card.pan}}
                        div.row
                            div.col-xs.ta-right
                                span.label {{ $i18n.t('card.distCardNumber')}}
                            div.col-xs.ta-left
                                span.value.persian-num {{this.dst_pan}}
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
                                span.value.persian-num {{this.amount | numberFormat }}

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
                                span.value.persian-num {{ transferResponse.card_balance| numberFormat }}
                        div.row
                            div.col-xs.ta-right
                                span.label {{ $i18n.t('common.date')}}
                            div.col-xs.ta-left
                                span.value.persian-num {{transferResponse.date}}
                        div.row
                            div.col-xs.ta-right
                                span.label  {{ $i18n.t('card.distAccountOwnerName')}}
                            div.col-xs.ta-left
                                span.value {{transferResponse.dst_card_holder_name}}
                        div.row
                            div.col-xs.ta-right
                                span.label {{ $i18n.t('card.distAccountNumber')}}
                            div.col-xs.ta-left
                                span.value.persian-num {{transferResponse.dst_card_pan}}
                        div.row
                            div.col-xs.ta-right
                                span.label {{ $i18n.t('card.refrenceNumber')}}
                            div.col-xs.ta-left
                                span.value.persian-num {{transferResponse.ref_id }}
                        div.row
                            div.col-xs.ta-right
                                span.label {{ $i18n.t('card.amount')}}
                            div.col-xs.ta-left
                                span.value.persian-num {{transferResponse.transfer_amount | numberFormat}}
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
                step: 1,
                cardId: null,
                password: null,
                cvv2: null,
                dst_pan: null,
                amount: null,
            }
        },
        props: ['card'],
        computed: {
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            }
        },
        created(){
            store.commit('clearValidationErrors');
        },
        methods: {
            validation(name) {
                if (this.$store.state.alert.validationErrors[name]) {
                    let element = _.find(this.$validator.fields.items, function (field) {
                        return field.name == name;
                    });
                    this.errors.add(
                        name,
                        this.$validator.dictionary.container.fa.messages[this.$store.state.alert.validationErrors[name].rule](
                            element.el.dataset.vvAs,
                            this.$store.state.alert.validationErrors[name].params
                        ),
                        'api'
                    );
                    this.$store.state.alert.validationErrors[name] = false;
                }
                return this.errors.has(name);
            },
            validateForm() {
                this.$validator.validateAll({
                    password: this.password,
                    cvv2: this.cvv2,
                    dst_pan: this.dst_pan,
                    amount: this.amount
                }).then((result) => {
                    if (result) {
                        this.confirmTransfer();
                    }
                });
            },
            cardNumberFormat(inputId) {
                let text = document.getElementById(inputId).value;
                let result = [];
                if (text) {
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
                this.requesting = true;
                let destPan = this.dst_pan.split('-').join('');

                this.$store.state.http.requests['zarincard.getHolderName'].get({destPan: destPan}).then(
                    (response) => {
                        this.step = 2;
                        this.requesting = false;
                        this.destinationUser = response.data.data;
                    },
                    (response) => {
                        this.requesting = false;
                        store.commit('flashMessage', {
                            text: response.data.meta.error_message,
                            important: false,
                            type: 'danger'
                        });
                        store.commit('setValidationErrors', response.data.validation_errors);
                    }
                );
            },
            acceptTransfer() {
                this.transferCompelled = true;

                let destPan = this.dst_pan.split('-').join('');
                let amount = this.amount.replace(/,/g, "");

                let transferData = {
                    card_id: this.card.entity_id,
                    password: this.password,
                    cvv2: this.cvv2,
                    dst_pan: destPan,
                    amount: amount
                };

                this.$store.state.http.requests['zarincard.postTransferShetab'].save(transferData).then(
                    (response) => {
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
                        store.commit('flashMessage', {
                            text: response.data.meta.error_message,
                            important: false,
                            type: 'danger'
                        });
                        store.commit('setValidationErrors', response.data.validation_errors);
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
                this.dst_pan = null;
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