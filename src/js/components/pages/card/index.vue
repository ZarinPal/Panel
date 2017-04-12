<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('common.cards') }}
                p.page-description {{$i18n.t('card.cardsDescription')}}

            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                span.btn.btn-success(@click="visibleCreateCard = true")
                    span.icon-add-circle
                    span.text {{ $i18n.t('card.createCard') }}

        div.row
            singleCard(v-for="card in user.cards" v-bind:card="card")

        createCard(v-if="visibleCreateCard" v-on:closeModal="closeModal()")
</template>

<script>
    import singleCard from './partials/single-card.vue';
    import createCard from './partials/create.vue';
    export default {
        name: 'card-index',
        data(){
            return{
                visibleCreateCard: false,
            }
        },
        computed:{
            user(){
                return this.$store.state.auth.user;
            }
        },
        methods: {
            closeModal(){
                this.visibleCreateCard = false;
            }
        },
        components: {
            singleCard,
            createCard
        }
    }
</script>