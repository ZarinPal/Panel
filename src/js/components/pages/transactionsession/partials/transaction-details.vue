<template lang="pug">
    transition(name="fade"
    enter-active-class="fade-in"
    leave-active-class="fade-out")
        div.modal.transaction-detail(v-on:click.self="closeModal()")
            transition(name="zoom"
            enter-active-class="zoom-in"
            leave-active-class="zoom-out")
                div.row.center-xs(v-if="!closeModalContent" v-on:click.self="closeModal()")
                    div.col-lg-5.col-md-5.col-sm-10.col-xs-10.content
                        div.header
                            span.title {{$i18n.t('transaction.id')}} : {{ transaction.public_id | persianNumbers}}
                            span.icon-close(@click="closeModal()")

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
                                                    div.user-zp-id ZP.{{transaction.to_merchant.public_id}}

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
                            span.print(@click="printDetail(transaction.public_id)") {{$i18n.t('transaction.print')}}

</template>


<script>
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
                        this.coupons = response.data.data;
                    }
                );
            }
        },
    }

</script>
