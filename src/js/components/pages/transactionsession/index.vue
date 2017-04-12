<template lang="pug">
    div.inner-content
        div.col-lg-12.col-md-12.col-sm-12.col-xs-12
            singleTransactionsession(v-for="transactionsession in transactionsessions" v-bind:transactionsession="transactionsession")
</template>

<script>
    import singleTransactionsession from './partials/single-singleTransactionsession.vue';
    export default {
        name: 'transactionsession-index',
        data () {
            return {
                searchOptions: {},
                filterValue: null,
                filterType: null,
                generalFilter: 'all',
            }
        },
        created(){
            this.restart();
            this.search();
//            window.onscroll = function() {
//                console.log((window.innerHeight + window.scrollY) , document.body.offsetHeight);
//                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
//                    alert("you're at the bottom of the page");
//                }
//            };

        },
        watch: {
            filterType(){
                this.restart();
            }
        },
        methods: {
            restart(){
                this.filterValue = null;
                this.searchOptions = {};

                this.addFilter('webserviceId', this.$route.params.id);
            },
            addFilter(filter, value){
                this.searchOptions[filter] = value;
            },
            applyGeneralFilter(filter){
                this.generalFilter = filter;
                this.addFilter('filter', this.generalFilter);
                this.search();
            },
            search(){
                this.$store.dispatch(
                    'paginator/make',
                    this.$store.state.http.requests['transaction.getSessions'].get(this.searchOptions)
                );
            }
        },
        computed: {
            user(){
                return this.$store.state.auth.user;
            },
            transactionsessions(){
                return this.$store.state.paginator.data;
            }
        },
        components: {
            singleTransactionsession
        }
    }
</script>
