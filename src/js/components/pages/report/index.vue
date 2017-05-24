<template lang="pug">
     div.inner-content

        div.row.nav-page-header

            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('common.calendar') }}
                p.page-description {{ $i18n.t('report.description') }}
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                router-link.btn.default.pull-left(tag="button" v-bind:to="{ name: 'home.index'} ") {{ $i18n.t('common.returnToDashboard') }}

        div.row.transaction-fields-title
            div.col-lg-2.col-md-2.col-sm-3.hidden-xs
                span {{ $i18n.t('transaction.date') }}
            div.col-lg-2.col-md-2.col-sm-2.hidden-xs
                span {{ $i18n.t('report.incomeAmount') }}
            div.col-lg-2.col-md-2.col-sm-2.col-xs-12.hidden-title-md.hidden-xs
                span {{ $i18n.t('report.incomeCount') }}
            div.col-lg-2.col-md-3.col-sm-1.col-xs-12.hidden-xs
                span {{ $i18n.t('report.outcomeAmount') }}
            div.col-lg-2.col-md-3.col-sm-1.hidden-xs
                span {{ $i18n.t('report.outcomeCount') }}
        div.col-lg-12.col-md-12.col-sm-12.col-xs-12
            singleReport(v-for="(report, index) in reports" v-bind:key="index" v-bind:report="report")

</template>

<script>
    import singleReport from './partials/single-report.vue';

    export default {
        name: 'report-index',
        data () {
            return {
                isLoaded: false,
                searchOptions: {},
                resourceName : null,
                reports: [],
                filterType: null,
                filterValue: null,
                generalFilter: 'all',
            }
        },
        created() {
            this.restart();
            this.search();
        },
        methods: {
            restart() {
                this.filterValue = null;
                this.searchOptions = {};
                if (this.$route.params.type === 'purse') {
                    this.addFilter('purse_number', this.$route.params.id);
                    this.resourceName = 'report.purseTransactions';
                } else if (this.$route.params.type === 'webservice') {
                    this.addFilter('webservice_id', this.$route.params.id);
                    this.resourceName = 'report.webserviceTransactions';
                }
            },
            addFilter(filter, value) {
                this.searchOptions[filter] = value;
            },
            applyGeneralFilter(filter) {
                this.generalFilter = filter;
                this.addFilter('status', this.generalFilter);
                this.search();
            },
            search(){
                this.$store.state.http.requests[this.resourceName]
                    .save(this.searchOptions)
                    .then((results)=>{
                        this.reports = results.data.data;
                    });
            },
            loadMore() {
                this.$store.dispatch(
                    'paginator/next'
                );
            },

        },
        computed: {
            user() {
                return this.$store.state.auth.user;
            },
            transactions() {
                if(this.$store.state.paginator.data) {
                    this.isLoaded = true;
                }
                return this.$store.state.paginator.data;
            }
        },
        components: {
            singleReport,
        },
        watch: {
            '$route' () {
                this.restart();
                this.search();
            },
            filterType(){
                this.restart();
            }
        },
    }
</script>
