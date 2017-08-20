<template lang="pug">
    modal.add-fund(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('purse.addFund') }}
        div(slot="content")
            div(v-if="activeCards.length")
                div.row.purse-amount
                    span {{ $i18n.t('common.balance') + ': ' + purse.balance.balance | numberFormat | persianNumbers}}
                    span {{ $i18n.t('transaction.toman') }}
                form(autocomplete="on" onsubmit="event.preventDefault();")
                    div.row.no-margin
                        input(v-validate="{type: 'number', money: true}" maxlength="15" :class="{'input-danger': validationErrors.amount}" type="text" v-model="amount" placeholder="مبلغ" tabindex="1")
                        div.ta-right(v-if="validationErrors.amount")
                            span.text-danger {{ $i18n.t(validationErrors.amount) }}

                    div.row.no-margin
                        cards(:class="{'input-danger': validationErrors.card_id}" v-on:select="selectedCard" tabindex="2")
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
                maxAmountLimit: 10000000,
                redirectUrl: null
            }
        },
        props: ['purse'],
        mounted(){
            this.redirectUrl =  this.$root.baseUrl + this.$router.resolve({name: 'home.finishAddFund'}).href ;
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
                if (this.amount > this.maxAmountLimit) {
                    this.$store.commit('flashMessage',{
                        text: 'add found max amount limit',
                        type: 'danger',
                        important: true,
                    });
                    return;
                }

                this.loading = true;
                let amount = this.amount.replace(/,/g, ""); //remove , from amount
                let addFundData = {
                    purse: this.purse.purse,
                    amount: amount,
                    card_id: this.cardId,
                    redirect_url: this.redirectUrl
                };

                this.$store.state.http.requests['checkout.postAddFund'].save(addFundData).then(
                    (response)=> {
                        let addFundWindow = window.open(
                            'https://www.zarinpal.com/pg/StartPay/' + response.data.data.authority + '/ZarinGate',
                            '_self'
                        );
                    },
                    (response) => {
                        this.loading = false;
                        store.commit('setValidationErrors',response.data.validation_errors);
                        this.$store.commit('flashMessage',{
                            text: response.data.meta.error_message,
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
