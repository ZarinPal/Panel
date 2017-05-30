<template lang="pug">
    modal(v-on:closeModal="closeModal()")
        div(slot="title") {{ $i18n.t('purse.zarinCardStatement') + ' : ' + card.pan }}
        div(slot="content")
            div.row.no-margin
                div.col-xs.no-right-margin
                    input(:class="{'input-danger': validationErrors.password}" type="text" v-model="password" placeholder= "رمز دوم")
                    div.ta-right(v-if="validationErrors.password")
                        span.text-danger {{ $i18n.t(validationErrors.password) }}

                div.col-xs.no-left-margin
                    input(:class="{'input-danger': validationErrors.cvv2}" type="text" v-model="cvv2" placeholder= "cvv2")
                    div.ta-right(v-if="validationErrors.cvv2")
                        span.text-danger {{ $i18n.t(validationErrors.cvv2) }}


            div.row.no-margin
                div.col-xs.nav-buttons.no-left-margin
                    button.btn.success.pull-left(v-ripple="" @click="getZarinCardStatment") مشاهده گردش حساب
                        svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                            circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

            div.row
                div(v-if="zarinCardStatements") {{zarinCardStatements}}
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
                this.$emit('closeModal')
            },
            selectedCard(cardId) {
                this.cardId = cardId;
            },
            getZarinCardStatment() {
                this.loading = true;
                let zarincardData = {
                    card_id: this.card.entity_id,
                    password: '',
                    cvv2: ''
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
            cards,
            modal
        }
    }
</script>
