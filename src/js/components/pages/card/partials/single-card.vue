<template lang="pug">
    div.col-xs-12.col-sm-12.col-md-6.col-lg-4.section
        div.box.card(:class="{'disable-card-box': card.status !== 'Active'}")
            <!--Active Card-->
            div.middle-xs.body.bank-card(v-if="card.status == 'Active'" v-bind:class="card.issuer.slug.toLowerCase()")
                div.row
                    div.col-xs.ta-right
                        div.card-logo(:class="'logo-' + card.issuer.slug.toLowerCase()")
                        span.bank-name {{ card.issuer.name}}
                    div.ta-left
                        span.accepted-card(v-if="card.status === 'Active'")
                            span {{$i18n.t('card.Active')}}
                        span.pending-card(v-else-if="card.status === 'Pending'")
                            span {{$i18n.t('card.pending')}}
                        span.in-active-card(v-else-if="card.status === 'InActive'")
                            span {{$i18n.t('card.inActive')}}

                div.row
                    span.card-number(v-if="card.pan")
                        span(v-html="$options.filters.cardNumber(card.pan)")
                    span.card-number(v-if="card.is_legal")
                        span.iransans {{$i18n.t('card.legalAccount')}}

                div.row.box-row
                    div.ta-right
                        span.label {{$i18n.t('card.accountId')}}:
                        span.account-id.persian-num(v-if="card.account_id") {{ card.account_id}}
                        span(v-else) -

                    div.col-xs.ta-left(v-if="card.pan")
                        span {{ $i18n.t('card.expiration') }}:
                        span.text-value.persian-num {{card.expired_at| jalali("jYYYY/jM")}}

            <!--InActive OR Pending Card-->
            div.middle-xs.body.bank-card.disable-card(v-else-if="card.status == 'InActive' || card.status == 'Pending' || card.status == 'Expired'")
                div.row
                    div.col-xs.ta-right
                        div.card-logo(:class="'logo-' + card.issuer.slug.toLowerCase()")
                        span.bank-name {{ card.issuer.name}}
                    div.ta-left
                        span.accepted-card(v-if="card.status === 'Active'")
                            span {{$i18n.t('card.Active')}}
                        span.pending-card(v-else-if="card.status === 'Pending'")
                            span {{$i18n.t('card.pending')}}
                        span.in-active-card(v-else-if="card.status === 'InActive'")
                            span {{$i18n.t('card.inActive')}}
                        span.in-active-card(v-else-if="card.status === 'Expired'")
                            span {{$i18n.t('card.expired')}}

                div.row
                    span.card-number(v-if="card.pan")
                        span(v-html="$options.filters.cardNumber(card.pan)")
                    span.card-number(v-if="card.is_legal")
                        span.iransans {{$i18n.t('card.legalAccount')}}

                div.row.box-row
                    div.ta-right
                        span.label {{$i18n.t('card.accountId')}}:
                        span.account-id.persian-num(v-if="card.account_id") {{ card.account_id }}
                        span(v-else) -

                    div.col-xs.ta-left(v-if="card.pan")
                        span {{ $i18n.t('card.expiration') }}:
                        span.text-value.persian-num {{card.expired_at| jalali("jYYYY/jM") }}

            div.bottom-xs.box-footer
                div.row
                    <!--div.col-xs(v-if="card.status !== 'InActive'")-->
                    <!--span.edit-bank-account(v-if="!card.is_legal && card.account_id && card.issuer.slug !== 'ZarinCard'" @click="showEditCard = true" ) {{ $i18n.t('card.editBankAccount')}}-->
                    <!--span.edit-bank-account.not-allowed(v-if="card.is_legal && card.account_id && card.issuer.slug != 'ZarinCard'") {{ $i18n.t('card.editBankAccount')}}-->

                    <!--span.statement-icon(v-if="card.issuer.slug == 'ZarinCard'" @click="showZarinCardStatement = true" ) {{ $i18n.t('common.getBalance')}}-->
                    <!--span.shetab-icon(v-if="card.issuer.slug == 'ZarinCard'" @click="showTransferShetab = true" ) {{ $i18n.t('purse.shetabMoneyTransfer')}}-->

                    <!--div.col-xs(v-else)-->
                    <!--span.edit-bank-account.not-allowed(v-if="card.issuer.slug != 'ZarinCard'") {{ $i18n.t('card.editBankAccount')}}-->
                    <!--span.statement-icon.not-allowed(v-if="card.issuer.slug == 'ZarinCard' && card.status != 'Expired'")  {{ $i18n.t('common.getBalance')}}-->
                    <!--span.shetab-icon.not-allowed(v-if="card.issuer.slug == 'ZarinCard' && card.status != 'Expired'") {{ $i18n.t('purse.shetabMoneyTransfer')}}-->



                    div.col-xs
                        <!--Active-->
                        span(v-if="card.status == 'Active'")
                            span.option.statement-icon(v-if="card.issuer.slug == 'ZarinCard', $store.state.auth.user.level !== -1 " @click="showZarinCardStatement = true" ) {{ $i18n.t('common.getBalance')}}
                            span.option.shetab-icon(v-if="card.is_cs_supported" @click="showTransferShetab = true" ) {{ $i18n.t('purse.shetabMoneyTransfer')}}
                            span.option.edit-bank-account(v-if="!card.is_legal && card.account_id && card.issuer.slug !== 'ZarinCard'" @click="showEditCard = true" ) {{ $i18n.t('card.editBankAccount')}}

                        <!--Expired-->
                        span(v-else-if="card.status == 'Expired'")
                            span.option.statement-icon.not-allowed(v-if="card.issuer.slug == 'ZarinCard'") {{ $i18n.t('common.getBalance')}}
                            span.option.shetab-icon.not-allowed {{ $i18n.t('purse.shetabMoneyTransfer')}}
                            span.option.edit-bank-account(v-if="!card.is_legal && card.account_id && card.issuer.slug !== 'ZarinCard'" @click="showEditCard = true" ) {{ $i18n.t('card.editBankAccount')}}

                        <!--InActive-->
                        span(v-else-if="card.status == 'InActive'")
                            span.option.statement-icon.not-allowed(v-if="card.issuer.slug == 'ZarinCard'") {{ $i18n.t('common.getBalance')}}
                            span.option.shetab-icon.not-allowed {{ $i18n.t('purse.shetabMoneyTransfer')}}
                            span.option.edit-bank-account.not-allowed(v-if="!card.is_legal && card.account_id && card.issuer.slug !== 'ZarinCard'") {{ $i18n.t('card.editBankAccount')}}

                        <!--Pending-->
                        span(v-else-if="card.status == 'Pending'")
                            span.option.statement-icon.not-allowed(v-if="card.issuer.slug == 'ZarinCard'") {{ $i18n.t('common.getBalance')}}
                            span.option.shetab-icon.not-allowed {{ $i18n.t('purse.shetabMoneyTransfer')}}
                            span.option.edit-bank-account.not-allowed(v-if="!card.is_legal && card.account_id && card.issuer.slug !== 'ZarinCard'") {{ $i18n.t('card.editBankAccount')}}

        <!--Modals-->
        editCard(v-if="showEditCard" v-on:closeModal="closeModal()" v-bind:card="card")
        transferShetab(v-if="showTransferShetab" v-on:closeModal="closeModal()" v-bind:card="card")
        zarinCardStatement(v-if="showZarinCardStatement" v-on:closeModal="closeModal()" v-bind:card="card")

</template>
<script>
    import editCard from './edit.vue';
    import transferShetab from './transferShetab.vue';
    import zarinCardStatement from './zarinCardStatement.vue';

    export default {
        name: 'pages-card-partials-singleCard',
        data(){
            return {
                showEditCard: false,
                showTransferShetab: false,
                showZarinCardStatement: false,
                zarin: 'zarin-logo'
            }
        },
        props: ['card'],
        methods: {
            closeModal() {
                this.showEditCard = false;
                this.showTransferShetab = false;
                this.showZarinCardStatement = false;
                store.commit('clearValidationErrors');
            }
        },
        components: {
            editCard,
            transferShetab,
            zarinCardStatement
        }
    }
</script>
