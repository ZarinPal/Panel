<template lang="pug">
    modal.pay-request(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('requestMoney.pay') }}
        div(slot="content")
            div.row
                div.col-xs.ta-center.nav-amount
                    span {{debt.amount | numberFormat | persianNumbers}}
                    small {{ $i18n.t('transaction.toman') }}

            div.row.no-margin.nav-description
                span {{ $i18n.t('common.description') }} :
                span {{debt.description}}

            div.row
                div.col-xs.no-margin
                    button.btn.success.pull-left(v-ripple="" @click="payRequest") {{$i18n.t('requestMoney.pay')}}
</template>

<script>
    import modal from '../../partials/modal.vue';

    export default {
        name: 'pages-requestMoney-partials-payRequest',
        data() {
            return {
                loading: false,
                purse: null,
                redirect_url: null,
            }
        },
        props: ['debt'],
        mounted() {
            this.closeModalContent = false;
            this.redirect_url = this.$root.baseUrl + this.$router.resolve({name: 'requestMoney.index'}).href + '/debt?';
        },
        methods: {
            closeModal() {
                this.$emit('closeModal');
            },
            payRequest() {
                let params = {
                    entityId: this.debt.entity_id
                };

                let requestData = {
                    redirect_url: this.redirect_url,
                };

                this.$store.state.http.requests['requestMoney.payRequestMoney'].save(params, requestData).then(
                    (response) => {
                        let authority = response.data.data.authority;
                        window.location.replace(this.$store.state.http.services.pg + authority);
                    },
                    (response) => {
                        this.loading = false;
                        this.messages = response.data.meta.error_message;
                        store.commit('flashMessage', {
                            text: this.messages,
                            type: 'danger'
                        });
                    }
                )
            }
        },
        components: {
            modal,
        }
    }
</script>