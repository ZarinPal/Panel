<template lang="pug">
    modal.add-fund(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('purse.addFund') }}
        div(slot="content")
            div(v-if="activeCards.length")
                div.row
                    span افزایش حساب کیف پول {{purse.name}}
                div.row.no-margin
                    input(:class="{'input-danger': validationErrors.amount}" type="number" v-model="amount" placeholder="مبلغ")
                    div.ta-right(v-if="validationErrors.amount")
                        span.text-danger {{ $i18n.t(validationErrors.amount) }}

                div.row.no-margin
                    cards(:class="{'input-danger': validationErrors.card_id}" v-on:select="selectedCard")
                    div.ta-right(v-if="validationErrors.card_id")
                        span.text-danger {{ $i18n.t(validationErrors.card_id) }}

                div.row
                    div.col-xs.no-margin
                        button.btn.success.pull-left(v-ripple="" @click="addFund") {{$i18n.t('purse.addFund')}}

            div.nav-not-active-card(v-else)
                p.title {{ $i18n.t('common.zarinPal') }}
                p.description {{ $i18n.t('purse.addFundNotActiveCard') }}

</template>


<script>
    import selectbox from '../../partials/selectbox.vue';
    import modal from '../../partials/modal.vue';
    import cards from '../../partials/cards.vue';

    export default {
        name: 'home-purse-addFund',
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
            addFund() {
                this.loading = true;
                let addFundData = {
                    purse: this.purse.purse,
                    amount: this.amount,
                    card_id: this.cardId,
                    redirect_url: this.redirectUrl
                };
                this.$store.state.http.requests['checkout.postAddFund'].save(addFundData).then(
                    (response)=> {
                        let addFundWindow = window.open(
                            'https://www.zarinpal.com/pg/StartPay/' + response.data.data.authority + '/ZarinGate',
                            'شارژ کیف‌پول'
                        );
                        addFundWindow.onbeforeunload = ()=>{
                            store.commit('flashMessage', {
                                text: 'کیف پول مورد نظر شارژ شد',
                                type: 'success',
                            });
                        };
                    },
                    (response) => {
                        this.loading = false;
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
            selectedCard(cardId) {
                this.cardId = cardId;
            },
        },
        components: {
            selectbox,
            modal,
            cards
        }
    }
</script>
