<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                p.page-title {{ $i18n.t('common.cards') }}
                p.page-description {{$i18n.t('card.cardsDescription')}}

            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                button.btn.success(v-if="userHasAccess([0,1, 2, 3]) >= 0" @click="visibleCreateCard = true")
                    span.icon-add-circle
                    span.text {{ $i18n.t('card.createCard') }}

        div.row.nav-cards
            singleCard(v-for="card in cards.data" v-bind:key="card.entity_id" v-bind:card="card")

        <!--Components-->
        createCard(v-if="visibleCreateCard" v-on:closeModal="closeModal()")



        <!--Loading data -->
        div.ta-center(v-if="cards.status")
            loading

        div.ta-center(v-if="!this.$store.state.paginator.paginator.CardList.resource.resource && cards.data.length")
            span.txt-nothing-to-show {{ $i18n.t('common.thereIsNoOtherItemToDisplay') }}

        div.row(v-if="!cards.status && !cards.data.length")
            div.col-xs.ta-center
                span.txt-nothing-to-show  {{ $i18n.t('common.nothingToShow') }}
</template>

<script>
    import singleCard from './partials/single-card.vue';
    import createCard from './partials/create.vue';
    import loading from '../../pages/partials/loading.vue';

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

                let cards =  {
                    data: this.$store.state.paginator.paginator.CardList.data,
                    status: this.$store.state.paginator.paginator.CardList.isLoading,
                    update: this.$store.state.paginator.update,
                };

                cards.data.forEach(function (card) {
                    if (card.status === 'Active') {
                        activeCards.push(card);
                    } else {
                        inActiveCards.push(card);
                    }
                });
                reorderedCards = activeCards.concat(inActiveCards);
                return {
                    data: reorderedCards,
                    status: this.$store.state.paginator.paginator.CardList.isLoading,
                };
            }
        },
        created() {
            this.getCards();
        },
        methods: {
            closeModal(){
                this.visibleCreateCard = false;
                store.commit('clearValidationErrors');
            },
            userHasAccess(validLevels) {
                return _.indexOf(validLevels, this.$store.state.auth.user.level);
            },
            getCards() {
                let vm = this;
                this.$store.dispatch(
                    'paginator/make',
                    {
                        vm,
                        resource: vm.$store.state.http.requests['card.getList'],
                        params: vm.searchOptions,
                        requestName: 'CardList'
                    }
                );
            }
        },
        components: {
            singleCard,
            createCard,
            loading
        }
    }
</script>