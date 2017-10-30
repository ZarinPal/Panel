<template lang="pug">
    modal.add-fund(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('purse.addFund') }}
        div(slot="content")
            div(v-if="activeCards.length")
                form(autocomplete="on" onsubmit="event.preventDefault();")
                    purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(@click.native="removeErrors('purse')" v-validate="{ rules: {required: true}}" name="purse" v-bind:data-vv-as="$i18n.t('user.purse')" :class="{'input-danger': errors.has('purse')}" v-on:select="selectedPurse" placeholder="انتخاب کیف پول")
                    div.ta-right(v-if="validation('purse')")
                        span.text-danger {{ errors.first('purse') }}

                    div.row.no-margin
                        input.ltr-input(v-mask="{money: true}" v-validate="{ rules: {required: true, max: 15}}" v-bind:data-vv-as="$i18n.t('card.transferAmountTitle')" maxlength="15" :class="{'input-danger': errors.has('amount')}" type="text" v-model="amount" name="amount" :placeholder="$i18n.t('card.transferAmountTitle')" tabindex="1")
                        div.ta-right(v-if="validation('amount')")
                            span.text-danger {{ errors.first('amount') }}

                    div.row
                        div.col-xs.no-margin
                            button.btn.success.pull-left(v-ripple="" @click="validateForm") {{$i18n.t('purse.addFund')}}
                                svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                    circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

</template>


<script>
    import selectbox from '../../partials/selectbox.vue';
    import modal from '../../partials/modal.vue';
    import cards from '../../partials/cards.vue';
    import purse from '../../partials/purses.vue';

    export default {
        name: 'home-purse-addFund',
        data() {
            return {
                loading: false,
                closeModalContent: false,
                amount: null,
                card_id: null,
                purse: null,
                maxAmountLimit: 10000000,
                redirect_url: null,
                zarinakReady: false
            }
        },
        mounted(){
            this.redirect_url = this.$root.baseUrl + this.$router.resolve({name: 'home.finishAddFund'}).href;
            this.closeModalContent = false;

            if (!window.Zarinak) {
                let vm = this;
                let zarinak = document.createElement("script");
                zarinak.type = "application/javascript";
                zarinak.src = 'https://cdn.zarinpal.com/zarinak/v1/checkout.js';
                zarinak.onload = function() {
                    vm.zarinakReady = true;
                };
                document.body.appendChild(zarinak);
            }
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
            validation(name) {
                if(this.$store.state.alert.validationErrors[name]) {
                    this.errors.clear();
                    this.errors.add(name, this.$store.state.alert.validationErrors[name], 'api');
                    this.$store.state.alert.validationErrors[name] = false;
                }
                return this.errors.has(name);
            },
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
            removeErrors : function (field) {
                !!this[field] && this.errors.remove(field);
            },
            closeModal() {
                this.$emit('closeModal')
            },
            selectedPurse(purse) {
                this.purse = purse;
            },
            addFund() {
                if (!this.zarinakReady) {
                    this.$store.commit('flashMessage', {
                        text: 'zarinak is not loaded try again.',
                        type: 'danger',
                        important: true,
                    });
                    return;
                }
                if (this.amount > this.maxAmountLimit) {
                    this.$store.commit('flashMessage', {
                        text: 'add found max amount limit',
                        type: 'danger',
                        important: true,
                    });
                    return;
                }

                let amount = this.amount;
                if (/,/g.test(this.amount)) {
                    amount = this.amount.replace(/,/g, ""); //remove , from amount
                }
                let addFundData = {
                    purse: this.purse,
                    amount: amount,
                    redirect_url: this.redirect_url
                };

                this.$store.state.http.requests['checkout.postAddFund'].save(addFundData).then(
                    (response) => {
                        Zarinak.setAuthority(response.data.data.authority);
                        Zarinak.open();
                    },
                    (response) => {
                        this.loading = false;
                        store.commit('setValidationErrors', response.data.validation_errors);
                        this.$store.commit('flashMessage', {
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
            selectedCard(card_id) {
                this.card_id = card_id;
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
