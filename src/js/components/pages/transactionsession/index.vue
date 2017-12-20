<template lang="pug">
    div.inner-content

        div.row.nav-page-header

            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('common.transactionSession') }}
                p.page-description {{ $i18n.t('transactionSession.description') }}
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                router-link.btn.default.pull-left(tag="button" v-bind:to="{ name: 'home.index'} ") {{ $i18n.t('common.returnToDashboard') }}

        div.row
            div.col-xs
                div.section
                    div.box
                        div.body.search-box
                            div.row
                                span.icon-search
                                span.search-title {{ $i18n.t('transactionSession.search') }}
                                span.break

                            div.row
                                div.col-lg-4.col-md-4.col-sm-4.col-xs-12
                                    input(v-model="filterValue" @change="addFilter(filterType, filterValue)" type="text" v-bind:placeholder="placeholder")
                                    div.break
                                div.col-lg-4.col-md-4.col-sm-4.col-xs-12
                                    selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-bind:data="filterTypeData" v-on:select="selectFilter" v-bind:selected="'authority'" placeholder="انتخاب کنید ...")

                                div.col-lg-4.col-md-4.col-sm-4.col-xs-4
                                    button.btn.info.pull-right(v-ripple="" @click="search()")
                                        span {{ $i18n.t('common.search') }}

        div.row.filter-row
            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                span.text(v-if="this.$route.params.type == 'purse'") {{$i18n.t('transaction.purseTransactionList')}}
                span(v-for="purse in user.purses")
                    span.purse-name(v-if="purse.purse == $route.params.id") {{purse.name}}

                div.break

        div.row.transaction-fields-title(v-if="transactionSessions.length")
            div.col-lg-2.col-md-2.col-sm-3.hidden-xs
                span {{ $i18n.t('transactionSession.authority') }}
            div.col-lg-2.col-md-2.col-sm-2.hidden-xs
                span {{ $i18n.t('transaction.date') }}
            div.col-lg-2.col-md-2.col-sm-2.col-xs-12.hidden-title-md.hidden-xs
                span {{ $i18n.t('transaction.amount') }}
            div.col-lg-2.col-md-3.col-sm-1.col-xs-12.hidden-xs
                span {{ $i18n.t('common.mobile') }}
            div.col-lg-2.col-md-3.col-sm-1.hidden-xs
                span {{ $i18n.t('common.email') }}
            div.col-lg-2.col-md-3.col-sm-2.hidden-xs
                span {{ $i18n.t('transaction.id') }}

        div.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-if="transactionSessions.length")
            singleTransaction(v-for="session in transactionSessions"  v-bind:key="session.public_id" v-bind:session="session")

        div.col-lg-12.col-md-12.col-sm-12.col-xs-12
            span(v-if="transactionSessions.length")
                singleTransaction(v-for="session in transactionSessions"  v-bind:key="session.public_id" v-bind:session="session")

            div.row(v-if="!this.$store.state.paginator.isLoading && !transactionSessions.length")
                div.col-xs.ta-center
                    span.txt-nothing-to-show  {{ $i18n.t('common.nothingToShow') }}

            div.ta-center(v-if="this.$store.state.paginator.isLoading")
                svg.material-spinner(width="30px" height="30px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                    circle.path-colors(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")


</template>

<script>
    import singleTransaction from './partials/singleTransactionsession';
    import selectbox from '../partials/selectbox.vue';

    export default {
        name: 'transaction-index',
        data () {
            return {
                isLoaded: false,
                placeholder: '39xxxxxx',
                searchOptions: {},
                filterType: null,
                filterValue: null,
                generalFilter: 'all',
                filterTypeData: [
                    {
                        title: 'آتوریتی',
                        value: 'authority'
                    },
                    {
                        title: 'شماره موبایل',
                        value: 'mobile'
                    }
                ],
            }
        },
        watch: {
            filterType(){
                this.restart();
            }
        },
        created() {
            this.restart();
            this.search();
            let vm = this;

            window.onscroll = function (ev) {
                if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight
                    && !vm.$store.state.paginator.isLoading) {
                    vm.$store.dispatch(
                        'paginator/next'
                    );
                }
            };
        },
        methods: {
            restart() {
                this.filterValue = null;
                this.searchOptions = {};
                this.addFilter('webserviceId', this.$route.params.id)
            },
            addFilter(filter, value) {
                this.searchOptions[filter] = value;
            },
            search(){
                let vm = this;
                this.$store.dispatch(
                    'paginator/make',
                    {
                        vm,
                        resource: vm.$store.state.http.requests['transaction.getSessions'],
                        resourceData: vm.searchOptions
                    }
                );
            },
            selectFilter(value){
                this.filterType = value;
                switch (value) {
                    case 'authority':
                        this.placeholder = '39xxxxxx';
                        break;
                    case 'mobile':
                        this.placeholder = '09xxxxxxxxx';
                        break;
                }
            }

        },
        computed: {
            user() {
                return this.$store.state.auth.user;
            },
            transactionSessions() {
                if (this.$store.state.paginator.data) {
                    this.isLoaded = true;
                }
                return this.$store.state.paginator.data;
            }
        },
        components: {
            singleTransaction,
            selectbox
        }
    }
</script>
