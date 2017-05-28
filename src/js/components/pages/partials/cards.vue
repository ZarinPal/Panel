<template lang="pug">
    selectbox.cards.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectedCard" v-bind:data="cards" placeholder="انتخاب کارت")
</template>

<script>
    import selectbox from './selectbox.vue';
    export default {
        name: 'cards',
        computed: {
            cards() {
                if(this.$store.state.auth.user.cards) {
                    return this.$store.state.auth.user.cards.map(function (card) {
                        return {
                            'title' : '<span class="card-logo bank-logo logo-' + card.issuer.slug.toLowerCase() +'"></span> <span class="nav-card-item-bank-name">' + card.issuer.name +'</span>' + '<span class="nav-card-item-bank-card-id pull-left">' + card.pan + '</span>',
                            'value': card.entity_id
                        }
                    });
                }
            }
        },
        methods: {
            selectedCard(value) {
                this.$emit('select', value);
            },
        },
        components: {
            selectbox
        }
    };

</script>