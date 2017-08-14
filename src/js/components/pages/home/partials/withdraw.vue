<template lang="pug">
    modal.withdraw(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('transaction.withdraw') }} از کیف پول {{purse.name}}
        div(slot="content")
            div(v-if="this.$store.state.auth.user.cards")
                div.modal-description
                    div {{ $i18n.t('purse.purseBalance') + ': ' + purse.balance.balance | numberFormat | persianNumbers}} {{ $i18n.t('transaction.toman')}}

                form(autocomplete="on" onsubmit="event.preventDefault();")
                    div.row
                        input(v-validate="{type: 'number', money: true}" maxlength="15" :class="{'input-danger': validationErrors.amount}" type="text" v-model="amount" placeholder="مبلغ")
                        div.ta-right(v-if="validationErrors.amount")
                            span.text-danger {{ $i18n.t(validationErrors.amount) }}

                    div.row
                        cards.cards(:class="{'input-danger': validationErrors.card_id}" v-on:select="selectedCard")
                        div.ta-right(v-if="validationErrors.card_id")
                            span.text-danger {{ $i18n.t(validationErrors.card_id) }}

                    div.row
                        div.col-xs.no-margin
                            button.btn.success.pull-left(v-ripple="" @click="withdraw") {{$i18n.t('transaction.withdraw')}}

            div.nav-not-active-card(v-else)
                p.title {{ $i18n.t('common.zarinPal') }}
                p.description {{ $i18n.t('purse.withdraw') }}

</template>


<script>
    import selectbox from '../../partials/selectbox.vue';
    import modal from '../../partials/modal.vue';
    import cards from '../../partials/cards.vue';

    export default {
        name: 'home-purse-withdraw',
        data() {
            return {
                loading: false,
                closeModalContent: false,
                amount: '',
                cardId: '',
                redirectUrl:encodeURI(
                'https://' + window.location.hostname + '/'
                + this.$router.resolve({name: 'home.finishAddFund'}).href),
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
            withdraw() {
                this.loading = true;
                let amount = this.amount.replace(/,/g, ""); //remove , from amount
                let withdrawData = {
                    amount: amount,
                    card_id: this.cardId,
                };
                this.$store.state.http.requests['transaction.postWithdraw'].save(withdrawData).then(
                    (response)=> {
                        this.$store.commit('flashMessage',{
                            text: response.data.meta.message,
                            important: false,
                            type: 'success'
                        });
                        this.closeModal();
                    },
                    (response) => {
                        store.commit('setValidationErrors',response.data.validation_errors);
                        this.$store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            important: false,
                            type: 'danger'
                        });
                    }
                )
            },
            selectedCard(cardId) {
                this.cardId = cardId;
            }
        },
        components: {
            selectbox,
            modal,
            cards
        }
    }
</script>
