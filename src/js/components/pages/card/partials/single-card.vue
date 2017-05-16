<template lang="pug">
div.col-xs-12.col-sm-12.col-md-6.col-lg-6.section
    div.box.card
        div.middle-xs.body.bank-card(v-bind:class="card.issuer.slug.toLowerCase()")
            div.row
                div.col-xs.ta-right
                    img.logo(v-bind:src="'assets/img/banks/' + card.issuer.slug  + '.png'")
                    span.bank-name {{ card.issuer.name}}
                div.ta-left(v-if="card.status === 'Active'")
                    span.accepted-card
                        span {{$i18n.t('card.accepted')}}

            div.row(v-if="card.pan")
                span.card-number
                    span {{card.pan}}
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
                    span.edit-bank-account(v-if="!card.is_legal && card.account_id" @click="showEditCard = true" ) {{ $i18n.t('card.editBankAccount')}}

    editCard(v-if="showEditCard" v-on:closeModal="closeModal()" v-bind:card="card")

</template>
<script>
    import editCard from './edit.vue';

    export default {
        name:'pages-card-partials-singleCard',
        data(){
            return{
                showEditCard: false,
                zarin: 'zarin-logo'
            }
        },
        props:['card'],
        methods:{
            closeModal() {
                this.showEditCard = false;
            }
        },
        components: {
            editCard
        }
    }
</script>
