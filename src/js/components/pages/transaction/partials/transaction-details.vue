<template lang="pug">
    modal.transaction-detail(v-on:closeModal="closeModal()")
        span(slot="title") {{$i18n.t('transaction.id')}} : {{ transaction.public_id | persianNumbers}}
        div.content(slot="content")
            div.body
                div.deposit-background
                    div.row.nav-deposit(v-bind:class="{'nav-deposit-in': transaction.effective_sign == 1, 'nav-deposit-internal': transaction.effective_sign == 0, 'nav-deposit-out': transaction.effective_sign == -1 }")
                        div.col-lg-6.col-md-6.col-sm-6.col-xs-6.from
                            div.row
                                div.user-image
                                    img(v-bind:src="'https:'+transaction.from_user.avatar")
                                div.col-xs.nav-user-info
                                    div.user-name {{transaction.from_user.name}}
                                    div.user-zp-id ZP.{{transaction.from_user.public_id}}
                        div.col-lg-6.col-md-6.col-sm-6.col-xs-6.to
                            div.row
                                div.user-image
                                    span(v-if="transaction.to_merchant")
                                        img(v-bind:src="'https:'+transaction.to_merchant.avatar")
                                    span(v-if="transaction.to_user")
                                        img(v-bind:src="'https:'+transaction.to_user.avatar")

                                div.col-xs.nav-user-info
                                    span(v-if="transaction.to_user")
                                        div.user-name {{transaction.to_user.name}}
                                        div.user-zp-id ZP.{{transaction.to_user.public_id}}

                                    span(v-if="transaction.to_merchant")
                                        div.user-name {{transaction.to_merchant.name}}
                                        div.user-name {{transaction.to_merchant.public_id}}

                span.amount {{ transaction.amount | numberFormat | persianNumbers }}
                span {{$i18n.t('transaction.toman')}}

                div.nav-rows
                    div.row
                        div.col-xs.ta-right
                            span.title.tick(v-if="transaction.confirmed == 'confirmed' ") {{ $i18n.t('transaction.confirmed') }}
                            span.title.unverified(v-else) {{ $i18n.t('transaction.notConfirmed') }}
                        div.col-xs.ta-left
                            span.value {{transaction.created | jalali('HH:mm:ss jYYYY-jMM-jDD') | persianNumbers}}

                    div.row
                        div.col-xs.ta-right
                            span.title {{$i18n.t('common.ip')}}
                        div.col-xs.ta-left
                            span.value  {{ transaction.from_ip}}

                    div.row
                        div.col-xs.ta-right
                            span.title {{$i18n.t('common.description')}}
                        div.col-xs.ta-left
                            span.value  {{ transaction.description}}


            div.footer.bottom-xs
                a.print(:href="this.$root.rootUrl + '/transaction/' + transaction.public_id + '.pdf'") {{$i18n.t('transaction.print')}}


</template>


<script>
    import modal from '../../partials/modal.vue';

    export default {
        name: 'transaction-details',
        data() {
            return {
                closeModalContent: true,
            }
        },
        props: ['transaction'],
        mounted(){
            this.closeModalContent = false
        },
        methods: {
            closeModal() {
                this.$emit('closeModal')
            },
            printDetail(documentId) {
                this.$store.state.http.requests['transaction.getInfoPdf'].get({transactionId: documentId}).then(
                    (response) => {
                        let blob = new Blob([response.data], { type: 'application/pdf' } ),
                            url = window.URL.createObjectURL(blob);

                        window.open(url);
                    }
                ).catch((response) => {

                });
            }
        },
        components: {
            modal
        }
    }

</script>
