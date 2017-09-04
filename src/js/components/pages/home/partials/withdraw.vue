<template lang="pug">
    modal.withdraw(v-on:closeModal="closeModal()")
        span(slot="title")
            span {{ $i18n.t('transaction.withdraw') }} از کیف پول
            span(v-if="purse") {{ ' ' + purse.name }}
        div(slot="content")
            div(v-if="this.$store.state.auth.user.cards")
                div.modal-description
                    div(v-if="purse") {{ $i18n.t('purse.purseBalance') + ': ' + purse.balance.balance | numberFormat | persianNumbers}} {{ $i18n.t('transaction.toman')}}

                form(autocomplete="on" onsubmit="event.preventDefault();")
                    purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-if="purse" :class="{'input-danger': validationErrors.purse}" v-on:select="selectedPurse" v-bind:selected="purse.purse" placeholder="انتخاب کیف پول")
                    purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-else :class="{'input-danger': validationErrors.purse}" v-on:select="selectedPurse" v-bind:selected="purse" placeholder="انتخاب کیف پول")
                    div.ta-right(v-if="validationErrors.purse")
                        span.text-danger {{ $i18n.t(validationErrors.purse) }}

                    div.row
                        input(v-validate="{type: 'number', money: true}" maxlength="15" :class="{'input-danger': validationErrors.amount}" type="text" v-model="amount" placeholder="مبلغ")
                        div.ta-right(v-if="validationErrors.amount")
                            span.text-danger {{ $i18n.t(validationErrors.amount) }}

                    div.row
                        cards.cards(:class="{'input-danger': validationErrors.card_id}" v-on:select="selectedCard")
                        div.ta-right(v-if="validationErrors.card_id")
                            span.text-danger {{ $i18n.t(validationErrors.card_id) }}



                    div.nav-fees(v-if="card")
                        div.row
                            div.col-xs(v-for="fee in fees" v-bind:class="{'inactive-step' : !fee.is_active}")
                                input(name="fees" type="radio" :value="fee.id" v-model="feeDetails.id" :id="'rdo' + fee.id" @click="selectFee(fee.id)")
                                label(:for="'rdo' + fee.id")
                                    span
                                    |{{fee.title}}


                        div.row.fee-date
                            div.col-xs
                                span حداکثر زمان واریز
                            div.col-xs
                                span(v-if="feeDetails.details") {{ (feeDetails.details.reconcile_in /60 /60).toFixed(0) }}

                        div.row.fee-date
                            div.col-xs
                                span مبلغ کارمزد
                            div.col-xs
                                div(v-if="feeDetails.details") {{ feeDetails.details.percent }} درصد
                                div(v-if="feeDetails.details") {{ (amount * feeDetails.details.percent) / 100}}


                        div.fee-description
                            span {{ selectedFee.description }}


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
    import purse from '../../partials/purses.vue';

    export default {
        name: 'home-purse-withdraw',
        data() {
            return {
                loading: false,
                closeModalContent: false,
                amount: null,
                purseId: null,
                redirectUrl:encodeURI(
                'https://' + window.location.hostname + '/'
                + this.$router.resolve({name: 'home.finishAddFund'}).href),
                card: {},

                isLoadedFees: false,
                feeDetails: {
                    id: 'default',
                    details: null,
                },
                selectedFee: null,
                reconcileIn: null,
                fees: null,

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
        created() {
            if(this.purse) {
                this.purseId = this.purse.purse;
            }
            this.getFees();
        },
        methods: {
            closeModal() {
                this.$emit('closeModal')
            },
            selectedPurse(purseId) {
                this.purseId = purseId;
                //get purse amount
                this.getPurseAmount(purseId);
            },
            selectedCard(cardId) {
                this.card.id = cardId;

                let cardIndex = _.findIndex(this.$store.state.auth.user.cards, function(card) {
                    return card.entity_id === cardId;
                });

                this.card.slug = this.$store.state.auth.user.cards[cardIndex].issuer.slug;
                this.getFeeWithdrawMethod();
            },
            selectFee(feeId) {
                if(!feeId) {
                    feeId = 'default';
                }

                let feeIndex = _.findIndex(this.fees, function(fee) {
                    return fee.id === feeId;
                });

                this.selectedFee = this.fees[feeIndex];
            },
            getPurseAmount(purseId) {
                let purseIndex = _.findIndex(this.$store.state.auth.user.purses, function(purse) {
                    return purse.purse === purseId;
                });

                this.amount = this.$store.state.auth.user.purses[purseIndex].balance.balance;
            },
            getFeeWithdrawMethod() {
                let cardType = 'default';
                if(this.card.slug === 'ZarinCard') {
                    cardType = 'zarincard';
                }

                let feeSlugIndex = _.findIndex(this.selectedFee.withdraw_method, function(fee) {
                    return fee.slug === cardType;
                });
                this.feeDetails.details = this.selectedFee.withdraw_method[feeSlugIndex];
            },
            getFees() {
                this.isLoadedFees = true;

                this.$store.state.http.requests['app.fees'].get().then(
                    (response) => {
                        this.fees = response.data.data;

                        //fee init
                        let feeIndex = _.findIndex(this.fees, function(fee) {
                            return fee.id === 'default';
                        });
                        this.selectedFee = this.fees[feeIndex];
                        this.selectFee();
                        this.getFeeWithdrawMethod();

                        this.isLoadedFees = false;
                    },()=>{
                        this.isLoadedFees = false;
                    }
                );
            },
            withdraw() {
                this.loading = true;
                let amount = this.amount.replace(/,/g, ""); //remove , from amount
                let withdrawData = {
                    amount: amount,
                    card_id: this.card.id,
                    purse: this.purseId
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
        },
        components: {
            selectbox,
            modal,
            cards,
            purse
        }
    }
</script>
