<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                p.page-title {{ $i18n.t('common.cards') }}
                p.page-description {{$i18n.t('card.cardsDescription')}}

            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                button.btn.success(v-if="userHasAccess([1, 2, 3]) >= 0" @click="visibleCreateCard = true")
                    span.icon-add-circle
                    span.text {{ $i18n.t('card.createCard') }}

        div.row.nav-cards
            singleCard(v-for="card in cards" v-bind:key="card.entity_id" v-bind:card="card")

        div.row(v-if="!cards.length")
            div.col-xs.ta-center
                span.txt-nothing-to-show {{ $i18n.t('common.nothingToShow') }}

        createCard(v-if="visibleCreateCard" v-on:closeModal="closeModal()")
</template>

<script>
    import singleCard from './partials/single-card.vue';
    import createCard from './partials/create.vue';
    export default {
        name: 'card-index',
        data(){
            return {
                visibleCreateCard: false,
            }
        },
        computed: {
            cards(){
                let activeCards = [];
                let inActiveCards = [];
                let reorderedCards = [];
                this.$store.state.auth.user.cards.forEach(function (card) {
                    if (card.status === 'Active') {
                        activeCards.push(card);
                    } else {
                        inActiveCards.push(card);
                    }
                });
                reorderedCards = activeCards.concat(inActiveCards);
                return reorderedCards;
            }
        },
        methods: {
            closeModal(){
                this.visibleCreateCard = false;
                store.commit('clearValidationErrors');
            },
            userHasAccess(validLevels) {
                return _.indexOf(validLevels, this.$store.state.auth.user.level);
            },
        },
        components: {
            singleCard,
            createCard
        }
    }
</script>