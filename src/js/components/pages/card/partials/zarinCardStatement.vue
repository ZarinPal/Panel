<template lang="pug">
    modal.zarin-statement(v-on:closeModal="closeModal()")
        div(slot="title") {{ $i18n.t('purse.zarinCardStatement')}}
        div(slot="content")
            span(v-if="!zarinCardStatements")
                form(autocomplete="on" onsubmit="event.preventDefault();")
                    div.row.no-margin
                        div.col-xs.no-right-margin
                            input(v-validate="{type: 'number'}" :class="{'input-danger': validationErrors.password}" type="password" v-model="password" placeholder= "رمز دوم")
                            div.ta-right(v-if="validationErrors.password")
                                span.text-danger {{ $i18n.t(validationErrors.password) }}

                        div.col-xs.no-left-margin
                            input(v-validate="{type: 'number'}" :class="{'input-danger': validationErrors.cvv2}" type="password" v-model="cvv2" placeholder= "CVV2")
                            div.ta-right(v-if="validationErrors.cvv2")
                                span.text-danger {{ $i18n.t(validationErrors.cvv2) }}


                    div.row.no-margin
                        div.col-xs.nav-buttons.no-left-margin
                            button.btn.success.pull-left(v-ripple="" @click="getZarinCardStatment") مشاهده گردش حساب
                                svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                    circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")


            <!--Report result-->
            span(v-else)
                div.row.ta-right.top-box
                    span.label {{ $i18n.t('common.balance') + ':' + zarinCardStatements.balance | numberFormat | persianNumbers }}
                    span.label {{ ' ' + $i18n.t('transaction.toman') }}

                div.bottom-box
                    div.row.transaction-fields-title
                        div.col-lg-4.col-md-4.col-sm-4.col-xs-6
                            span {{ $i18n.t('transaction.date') }}
                        div.col-lg-3.col-md-3.col-sm-3.col-xs-6
                            span {{ $i18n.t('common.amount') }}
                            small ({{ $i18n.t('transaction.toman') }})
                        div.col-lg-5.col-md-5.col-sm-5.hidden-xs
                            span {{ $i18n.t('common.description') }}

                    div.row.transaction-row(v-for="statement in zarinCardStatements.statements")
                        div.col-lg-1.col-md-1.col-sm-1.col-xs-1
                            span.icon-income-trans(v-if="statement.effectiveSign == 1")
                            span.icon-internal-trans(v-else-if="statement.effectiveSign == 0")
                            span.icon-outcome-trans(v-else-if="statement.effectiveSign == -1")

                        div.col-lg-3.col-md-3.col-sm-3.col-xs-5.ta-center
                            span.text.created {{statement.time | fromNow | persianNumbers}}

                        div.col-lg-3.col-md-3.col-sm-3.col-xs-6.ta-center
                            span.text {{statement.amount | numberFormat | persianNumbers}}

                        div.col-lg-5.col-md-5.col-sm-5.ta-center.hidden-xs
                            span.text {{statement.description}}

</template>


<script>
    import modal from '../../partials/modal.vue';
    import cards from '../../partials/cards.vue';
    export default {
        name: 'pages-card-partials-statement',
        data() {
            return {
                loading: false,
                cardId: null,
                password: null,
                cvv2: null,
                zarinCardStatements : null
            }
        },
        props:['card'],
        computed: {
            user(){
                return this.$store.state.auth.user;
            },
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
        },
        methods: {
            closeModal() {
                this.$emit('closeModal');
            },
            selectedCard(cardId) {
                this.cardId = cardId;
            },
            getZarinCardStatment() {
                this.loading = true;
                let zarincardData = {
                    card_id: this.card.entity_id,
                    password: this.password,
                    cvv2: this.cvv2
                };
                this.$store.state.http.requests['zarincard.postStatement'].save(zarincardData).then(
                    (response)=> {
                        this.loading = false;
                        this.validationErrors = null;
                        this.zarinCardStatements = response.data.data;
                    },
                    (response) => {
                        this.loading = false;
                        store.commit('setValidationErrors',response.data.validation_errors);
                        store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            type: 'danger'
                        });
                    }
                )
            }
        },
        components: {
            cards,
            modal
        }
    }
</script>
