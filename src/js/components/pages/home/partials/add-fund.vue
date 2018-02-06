<template lang="pug">
    modal.add-fund(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('purse.addFund') }}
        div(slot="content")
            div
                form(autocomplete="on" onsubmit="event.preventDefault();")
                    div.row
                        vue-numeric.ltr-input(v-validate="{ rules: {required: true}}" v-bind:data-vv-as="$i18n.t('transaction.amount')" :class="{'input-danger': errors.has('amount')}" :currency="$i18n.t('webservice.toman')" separator="," v-model="amount" name="amount" id="amount" :placeholder="$i18n.t('card.transferAmountTitle')")
                        div.ta-right(v-if="validation('amount')")
                            span.text-danger {{ errors.first('amount') }}

                    purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(@click.native="removeErrors('purse')" v-validate="{ rules: {required: true}}" name="purse" v-model="purse" v-bind:data-vv-as="$i18n.t('user.purse')" :class="{'input-danger': errors.has('purse')}" v-on:select="selectedPurse" placeholder="انتخاب کیف‌پول" tabindex="2")
                    div.ta-right(v-if="validation('purse')")
                        span.text-danger {{ errors.first('purse') }}

                    div.row
                        div.col-xs.no-margin
                            button.btn.success.pull-left(v-ripple="" @click="validateForm" tabindex="3") {{$i18n.t('purse.addFund')}}
                                svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                    circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

</template>


<script>
    import selectbox from '../../partials/selectbox.vue';
    import modal from '../../partials/modal.vue';
    import cards from '../../partials/cards.vue';
    import purse from '../../partials/purses.vue';
    import VueNumeric from 'vue-numeric';

    export default {
        name: 'home-purse-addFund',
        data() {
            return {
                loading: false,
                closeModalContent: false,
                amount: '',
                card_id: null,
                purse: null,
                maxAmountLimit: 10000000,
                redirect_url: null
            }
        },
        mounted() {
            this.redirect_url = this.$root.baseUrl + this.$router.resolve({name: 'home.finishAddFund'}).href;
            this.closeModalContent = false;
        },
        computed: {
            activeCards() {
                let activeCards = [];
                _.forEach(this.$store.state.auth.user.cards, function (card) {
                    if (card.status == "Active" && card.pan !== null) {
                        activeCards.unshift({
                            'title': '<div class="card-logo bank-logo logo-' + card.issuer.slug.toLowerCase() + '"></div> <span class="bank-name">' + card.issuer.name + '</span>' + '<span class="pull-left">' + card.pan + '</span>',
                            'value': card.entity_id,
                        });
                    }
                });
                return activeCards;
            },
        },
        created() {
            store.commit('clearValidationErrors');
        },
        methods: {
            validateForm() {
                this.$validator.validateAll({
                    amount: this.amount,
                    purse: this.purse
                }).then((result) => {
                    if (result) {
                        this.addFund();
                    }
                });
            },
            removeErrors: function (field) {
                !!this[field] && this.errors.remove(field);
            },
            closeModal() {
                this.$emit('closeModal')
            },
            selectedPurse(purse) {
                this.purse = purse;
            },
            addFund() {
                if (this.amount > this.maxAmountLimit) {
                    this.$store.commit('flashMessage', {
                        text: 'PurseMaxAmountLimitLocal',
                        type: 'danger',
                        important: true,
                    });
                    return;
                }

                let addFundData = {
                    purse: this.purse,
                    amount: this.clearNumber(this.amount),
                    redirect_url: this.redirect_url
                };

                this.$store.state.http.requests['checkout.postAddFund'].save(addFundData).then(
                    (response) => {
                        let openZarinak = () => {
                            Zarinak.setAuthority(response.data.data.authority);
                            Zarinak.open();

                        };
                        if (!window.Zarinak) {
                            let zarinak = document.createElement("script");
                            zarinak.type = "application/javascript";
                            zarinak.src = 'https://cdn.zarinpal.com/zarinak/v1/checkout.js';
                            zarinak.onload = function () {
                                openZarinak();
                            };
                            document.body.appendChild(zarinak);
                        } else {
                            openZarinak();
                        }
                    },
                    (response) => {
                        this.loading = false;
                        store.commit('setValidationErrors', response.data.validation_errors);
                        this.$store.commit('flashMessage', {
                            text: response.data.meta.error_type,
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
            selectedCard(card_id) {
                this.card_id = card_id;
            },
        },
        components: {
            selectbox,
            modal,
            cards,
            purse,
            VueNumeric
        }
    }
</script>
