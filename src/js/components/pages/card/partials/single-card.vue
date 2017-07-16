<template lang="pug">
div.col-xs-12.col-sm-12.col-md-6.col-lg-6.section
    div.box.card
        div.middle-xs.body.bank-card(v-bind:class="card.issuer.slug.toLowerCase()")
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

            div.row(v-if="card.pan")
                span.card-number
                    span(v-html="$options.filters.cardNumber(card.pan)")
            div.row(v-else)
                span.card-number
                    span.iransans {{$i18n.t('card.legalAccount')}}

            div.row.box-row
                div.ta-right
                    span.label {{$i18n.t('card.accountId')}}:
                    span.account-id(v-if="card.account_id") {{ card.account_id | persianNumbers}}
                    span(v-else) -

                div.col-xs.ta-left(v-if="card.pan")
                    span {{ $i18n.t('card.expiration') }}:
                    span.text-value {{card.expired_at| jalali("jYYYY/jM") | persianNumbers}}

        div.bottom-xs.box-footer
            div.row
                div.col-xs
                    span.edit-bank-account(v-if="!card.is_legal && card.account_id && card.issuer.slug != 'ZarinCard'" @click="showEditCard = true" ) {{ $i18n.t('card.editBankAccount')}}
                    span.edit-bank-account(v-if="card.issuer.slug == 'ZarinCard'" @click="showZarinCardStatement = true" ) مشاهده گردش حساب
                    span.edit-bank-account(v-if="card.issuer.slug == 'ZarinCard'" @click="showTransferShetab = true" ) انتقال وجه شتابی

    editCard(v-if="showEditCard" v-on:closeModal="closeModal()" v-bind:card="card")
    transferShetab(v-if="showTransferShetab" v-on:closeModal="closeModal()" v-bind:card="card")
    zarinCardStatement(v-if="showZarinCardStatement" v-on:closeModal="closeModal()" v-bind:card="card")

</template>
<script>
    import editCard from './edit.vue';
    import transferShetab from './transferShetab.vue';
    import zarinCardStatement from './zarinCardStatement.vue';

    export default {
        name:'pages-card-partials-singleCard',
        data(){
            return{
                showEditCard: false,
                showTransferShetab: false,
                showZarinCardStatement: false,
                zarin: 'zarin-logo'
            }
        },
        props:['card'],
        methods:{
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
