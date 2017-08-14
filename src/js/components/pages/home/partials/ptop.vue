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
                            div.col-xs.no-right-margin
                                input(v-validate="{type: 'number', money: true}" maxlength="15" :class="{'input-danger': validationErrors.amount}" type="text" v-model="amount" placeholder="مبلغ"  tabindex="1")
                                div.ta-right(v-if="validationErrors.amount")
                                    span.text-danger {{ $i18n.t(validationErrors.amount) }}

                            div.col-xs.no-left-margin
                                input(:class="{'input-danger': validationErrors.zpId}" type="text" v-model="zpId" placeholder="زرین پال مقصد، مثال: zp.123 یا 09365363586 یا domain@gmail.com" tabindex="2")
                                div.ta-right(v-if="validationErrors.zpId")
                                    span.text-danger {{ $i18n.t(validationErrors.zpId) }}

                        div.row
                            textarea(maxlength="255" :class="{'input-danger': validationErrors.description}" type="text" v-model="description" placeholder="توضیحات" tabindex="3")
                            div.ta-right(v-if="validationErrors.description")
                                span.text-danger {{ $i18n.t(validationErrors.description) }}

                        div.row
                            div.col-xs.no-margin
                                button.btn.success.pull-left(v-ripple="" @click="confirmPtopData" tabindex="4") {{ $i18n.t('purse.nextStep') }}

                div(v-else)
                    div.list(v-if="destinationUser")
                        div.row
                            div.col-xs.ta-right
                                span.label {{ $i18n.t('transaction.amount') }}
                            div.col-xs.ta-left
                                span.value {{ this.amount | numberFormat | persianNumbers}}
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
                                span.value {{this.purse.name}}

                        div.row
                            div.col-xs.ta-right
                                span.label {{ $i18n.t('purse.sourceUserName') }}
                            div.col-xs.ta-left
                                span.value {{this.$store.state.auth.user.name}}

                        div.row
                            div.col-xs.ta-right
                                span.label {{ $i18n.t('purse.destinationZpId') }}
                            div.col-xs.ta-left
                                span.value {{destinationUser.name}}

                        div.row
                            div.col-xs.ta-right
                                span.label {{ $i18n.t('purse.destinationUserName') }}
                            div.col-xs.ta-left
                                span.value {{destinationUser.zp_id}}

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

    export default {
        name: 'home-purse-ptop',
        data() {
            return {
                requesting: false,
                closeModalContent: true,
                step:1,
                purseId: null,
                zpId: null,
                amount: null,
                description: null,
                destinationUser: null
            }
        },
        props: ['purse'],
        mounted(){
            this.closeModalContent = false
        },
        computed:{
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
        },
        methods: {
            closeModal() {
                this.$emit('closeModal')
            },
            confirmPtopData(){
                if(this.amount && this.description && this.zpId) {
                    this.requesting = true;

                    let zarinId;
                    if(this.zpId) {
                        zarinId = this.zpId.toLowerCase();
                    }

                    this.$store.state.http.requests['purse.getInfoByZp'].get({purseId: zarinId}).then(
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
                } else {
                    store.commit('flashMessage',{
                        text: 'please fill all fields',
                        important: false,
                        type: 'danger'
                    });
                }
            },
            acceptTransfer() {
                this.requesting = true;
                let zarinId = null;
                if(this.zpId) {
                    zarinId = this.zpId.toLowerCase();
                }

                let amount = this.amount.replace(/,/g, ""); //remove , from amount
                let ptopData = {
                    purse: this.purse.purse,
                    zpId: zarinId,
                    amount: amount,
                    description: this.description
                };

                this.$store.state.http.requests['transaction.postPurseToPurseTransfer'].save(ptopData).then(
                    (response)=> {
                        this.requesting = false;
                        this.$router.push({name: 'transaction.index', params: {id: this.purse.purse, type:'purse', page:1, transactionId: response.data.data.transaction_public_id}});
                        store.commit('flashMessage',{
                            text: 'ptop-transfer-success',
                            type: 'success'
                        });
                    },
                    (response) => {
                        this.requesting = false;
                        this.step = 1;
                        store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            type: 'danger'
                        });
                        store.commit('setValidationErrors',response.data.validation_errors);
                    }
                )
            },
            declineTransfer() {
                this.step = 1;
                this.purseId = null;
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
            loading
        }
    }

</script>
