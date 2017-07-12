<template lang="pug">
    modal.new-request-money(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('requestMoney.pay') }}
        div(slot="content")
            div.row
                div {{debt.amount}}

            div.row.no-margin
                purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectedPurse" placeholder="انتخاب کیف پول")

            div.row
                div.col-xs.no-margin
                    button.btn.success.pull-left(v-ripple="" @click="payRequest") {{$i18n.t('requestMoney.pay')}}
</template>


<script>
    import modal from '../../partials/modal.vue';
    import purse from '../../partials/purses.vue';

    export default {
        name: 'pages-requestMoney-partials-payRequest',
        data() {
            return {
                loading: false,
                purse: null,
                redirect_url: null,
            }
        },
        props:['debt'],
        mounted() {
            this.closeModalContent = false
        },
        methods: {
            closeModal() {
                this.$emit('closeModal');
            },
            selectedPurse(purseId) {
                this.purse = purseId;
            },
            payRequest() {
                let params = {
                    entityId: this.debt.entity_id
                };

                let requestData = {
                    redirect_url: this.redirect_url,
                };

                this.$store.state.http.requests['requestMoney.payRequestMoney'].save(params, requestData).then(
                    (response)=> {
                        let authority = response.data.data.authority;
                        window.location.replace(this.$store.state.http.services.pg + authority);
                    },
                    (response) => {
                        this.loading = false;
                        this.messages = response.data.meta.error_message;
                        store.commit('flashMessage',{
                            text: this.messages,
                            type: 'danger'
                        });
                    }
                )


            }
        },
        components: {
            modal,
            purse
        }
    }
</script>