<template lang="pug">
     div.inner-content
        div.row.nav-page-header

            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('common.calendar') }}
                p.page-description {{ $i18n.t('report.description') }}
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                router-link.btn.default.pull-left(tag="button" v-bind:to="{ name: 'home.index'} ") {{ $i18n.t('common.returnToDashboard') }}

        div.persian-num#cal

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
    import CalHeatMap from 'cal-heatmap/src/cal-heatmap';
    let reportCal = null;

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
        mounted() {

            reportCal = new CalHeatMap();
            reportCal.init({
                itemSelector: "#cal",
                domain: "month",
                subDomain: "x_day",
//                data: {'1493494200' : 4000},
                dataType: "json",
                start: new Date(2017, 2, 5),
                cellSize: 35,
                cellPadding: 5,
                domainGutter: 20,
                range: 3,
                domainDynamicDimension: false,
                previousSelector: "#example-g-PreviousDomain-selector",
                nextSelector: "#example-g-NextDomain-selector",
                domainLabelFormat: function(date) {
                    return moment(date).format("jMMMM").toUpperCase();
                },
                subDomainTextFormat: "%d",
                legend: [52540795,52542795,52544795,62742400],
                legendColors: {
                    empty: "#ededed",
                    min: "#40ffd8",
                    max: "#f20013"
                }
            });
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
                        this.fillChart(this.reports);
                    });
            },
            loadMore() {
                this.$store.dispatch(
                    'paginator/next'
                );
            },
            fillChart(data) {
                let chartData = {};
                data.forEach(function (item) {
                    chartData[moment(item.date).format('x')/1000] = item.income_amount;
                });
                console.dir(chartData);
                reportCal.update(chartData);
                reportCal.options.data = chartData;
                reportCal.legend =  [52540795,52542795,52544795,62742400];
                cal.setLegend();


//                reportCal.next();
                reportCal.jumpTo(new Date(2017, 4),true);

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
