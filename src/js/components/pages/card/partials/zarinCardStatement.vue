<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('card.create') }}
                p.page-description {{ $i18n.t('webservice.createDescription') }}

        div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section.create-webservice
            div.box
                div.body
                    div.row
                        div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                            div.row.no-margin
                                cards(:class="{'input-danger': validationErrors.card_id}" v-on:select="selectedCard")
                                div.ta-right(v-if="validationErrors.card_id")
                                    span.text-danger {{ $i18n.t(validationErrors.card_id) }}

                            div.row.no-margin
                                input(:class="{'input-danger': validationErrors.password}" type="text" v-model="password" placeholder= "رمز دوم")
                                div.ta-right(v-if="validationErrors.password")
                                    span.text-danger {{ $i18n.t(validationErrors.password) }}

                                input(:class="{'input-danger': validationErrors.cvv2}" type="text" v-model="cvv2" placeholder= "cvv2")
                                div.ta-right(v-if="validationErrors.cvv2")
                                    span.text-danger {{ $i18n.t(validationErrors.cvv2) }}


                div.row
                    div.col-xs.nav-buttons
                        button.btn.success.pull-right(v-ripple="" @click="getZarinCardStatment") مشاهده گردش حساب
                            svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

                div.row
                    div(v-if="zarinCardStatements") {{zarinCardStatements}}
</template>


<script>
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
        computed: {
            user(){
                return this.$store.state.auth.user;
            },
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
        },
        methods: {
            selectedCard(cardId) {
                this.cardId = cardId;
            },
            getZarinCardStatment() {
                this.loading = true;
                let zarincardData = {
                    card_id: this.cardId,
                    password: '987040',
                    cvv2: '6094'
                };
                this.$store.state.http.requests['zarincard.postStatement'].save(zarincardData).then(
                    (response)=> {
                        this.loading = false;
                        this.validationErrors = null;
                        this.zarinCardStatements = response.data;
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
            cards
        }
    }
</script>
