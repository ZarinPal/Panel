<template lang="pug">
    modal.create-purse(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('transaction.withdraw') }}
        div(slot="content")
            div(v-if="activeCards.length")
                div.row
                    span درخواست واریز وجه از کیف پول {{purse.name}}
                    div {{ $i18n.t('purse.purseBalance') + ': ' + purse.balance.balance | numberFormat | persianNumbers}} {{ $i18n.t('transaction.toman')}}

                div.row
                    input(:class="{'input-danger': validationErrors.amount}" type="number" v-model="amount" placeholder="مبلغ")
                    div.ta-right(v-if="validationErrors.amount")
                        span.text-danger {{ $i18n.t(validationErrors.amount) }}

                div.row
                    selectbox.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(:class="{'input-danger': validationErrors.card_id}" v-on:select="selectCard" v-bind:data="activeCards" placeholder="انتخاب حساب بانکی")
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
            activeCards() {
                let activeCards = [];
                _.forEach(this.$store.state.auth.user.cards, function(card) {
                    if(card.status == "Active" && card.pan !== null) {
                        activeCards.unshift({
                            'title' : '<div class="card-logo bank-logo logo-' + card.issuer.slug.toLowerCase() +'"></div> <span class="bank-name">' + card.issuer.name +'</span>' + '<span class="pull-left">' + card.pan +  '</span>',
                            'value' : card.entity_id,
                        });
                    }
                });
                return activeCards;
            },
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
                let withdrawData = {
                    purse: this.purse.purse,
                    amount: this.amount,
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
            reload() {
                location.reload();
            },
            cardNumberFormat(inputId) {
                let text = document.getElementById(inputId).value;
                let result = [];
                text = this[inputId].replace(/[^\d]/g, "");
                while (text.length > 4) {
                    result.push(text.substring(0, 4));
                    text = text.substring(4);
                }
                if (this[inputId].length > 0) result.push(text);
                this[inputId] = result.join("-");
            },
            selectCard(cardId) {
                this.cardId = cardId;
            }
        },
        components: {
            selectbox,
            modal
        }
    }
</script>
