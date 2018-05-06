<template lang="pug">
    selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-if="this.$store.state.auth.isLoaded" v-on:select="selectedPurse" v-bind:selected="selected" v-bind:data="purses" :placeholder="$i18n.t('easypay.selectPurse')")
</template>

<script>
    import selectbox from './selectbox.vue';
    export default {
        name: 'purse',
        props: [
            'selected'
        ],
        computed: {
            purses() {
                if (this.$store.state.auth.user.purses) {
                    return this.$store.state.auth.user.purses.map(function (purse) {
                        let balance = null;
                        if (purse.balance) {
                            if (purse.balance.balance) {
                                balance = purse.balance.balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + ',');
                            } else {
                                balance = purse.balance.balance;
                            }
                            return {
                                'title': '<div class="col-xs>"><span class="wallet-color color-' + purse.purse + '"></span>' +
                                purse.name + '</div><div class="col-xs ta-left persian-num purse-selectbox-balance">' + balance +
                                ' تومان</div>',
                                'value': purse.purse
                            }
                        } else {
                            return {
                                'title': '<div class="col-xs>"><span class="wallet-color color-' + purse.purse + '"></span>' +
                                purse.name + '</div>',
                                'value': purse.purse
                            };
                        }
                    });
                }
            }
        },
        methods: {
            selectedPurse(value) {
                this.$emit('select', value);
            },
        },
        components: {
            selectbox
        }
    };

</script>


