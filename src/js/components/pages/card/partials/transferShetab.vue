<template lang="pug">
    modal.ptop(v-on:closeModal="closeModal()")
        div(slot="title") {{ $i18n.t('purse.moneyTransfer') }}
        div(slot="content")
            span زرین‌کارت به شتاب


            div.nav-loading(v-if="requesting")
                svg.material-spinner(width="30px" height="30px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                    circle.path-colors(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

            div(v-else)
                div(v-if="step == 1")
                    div.row
                        input(:class="{'input-danger': validationErrors.password}" type="text" v-model="password" placeholder="رمز دوم")
                        div.ta-right(v-if="validationErrors.password")
                            span.text-danger {{ $i18n.t(validationErrors.password) }}

                    div.row
                        input(:class="{'input-danger': validationErrors.cvv2}" type="text" v-model="cvv2" placeholder="cvv2")
                        div.ta-right(v-if="validationErrors.cvv2")
                            span.text-danger {{ $i18n.t(validationErrors.cvv2) }}

                    div.row
                        input(:class="{'input-danger': validationErrors.dst_pan}" type="text" v-model="dstPan" placeholder="شماره کارت مقصد")
                        div.ta-right(v-if="validationErrors.dst_pan")
                            span.text-danger {{ $i18n.t(validationErrors.dst_pan) }}

                    div.row
                        input(:class="{'input-danger': validationErrors.amount}" type="text" v-model="amount" placeholder="مبلغ")
                        div.ta-right(v-if="validationErrors.amount")
                            span.text-danger {{ $i18n.t(validationErrors.amount) }}

                    div.row
                        div.col-xs.no-margin
                            button.btn.success.pull-left(v-ripple="" @click="confirmTransfer") {{ $i18n.t('purse.nextStep') }}

                div(v-else)
                    div(v-if="destinationUser")


                    div.row.nav-buttons
                        div.col-xs.no-margin
                            button.btn.success.pull-left(v-ripple="" @click="acceptTransfer") {{ $i18n.t('purse.acceptTransfer') }}
                            button.btn.error.pull-left(v-ripple="" @click="declineTransform")  {{ $i18n.t('purse.declineTransfer') }}

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
                requesting: false,
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
                this.requesting = true;


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
                        this.destinationUser = response.data.data;
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

            }
        },
        components: {
            modal
        }
    }

</script>