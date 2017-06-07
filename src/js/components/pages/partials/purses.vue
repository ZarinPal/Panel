<template lang="pug">
    selectbox.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectedPurse" v-bind:selected="selected" v-bind:data="purses" placeholder="انتخاب کیف پول")
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
                return this.$store.state.auth.user.purses.map(function (purse) {
                    let sep = ',';
                    let number = typeof purse.balance.balance === "number" ? purse.balance.balance.toString() : purse.balance.balance;
                    let balance = number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + sep);

                    return {
                        'title': '<span class="wallet-color color-' + purse.purse + '"></span>' + purse.name + '<span class="pull-left persian-num purse-selectbox-balance">' + balance +  ' تومان</span>',
                        'value': purse.purse
                    }
                });
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


