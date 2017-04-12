<template lang="pug">
    div.inner-content

        div.row.nav-page-header

            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('common.transactions') }}
                p.page-description {{ $i18n.t('transaction.description') }}
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                div.break
                button.btn.default.pull-left {{ $i18n.t('common.returnToDashboard') }}


        div.row
            div.col-xs
                div.section
                    div.box
                        div.body.search-box
                            div.row
                                span.icon-search
                                span.search-title {{ $i18n.t('transaction.search') }}
                                span.search-title {{ $i18n.t('transaction.advanceSearch') }}

                            div.row
                                div.col-lg-4.col-md-4.col-sm-4.col-xs-12
                                    input(v-model="filterValue" @change="addFilter(filterType, filterValue)" type="text" placeholder="62198610****7448")
                                    div.break
                                div.col-lg-4.col-md-4.col-sm-4.col-xs-9
                                    selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-bind:data="filterTypeData" v-on:select="selectFilter" placeholder="انتخاب کنید ...")

                                div.col-lg-4.col-md-4.col-sm-4.col-xs-3
                                    button.btn.info.pull-right(v-ripple @click="search()")
                                        span {{ $i18n.t('common.search') }}
                                    div.cb


        div.row.filter-row
            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                span.text {{$i18n.t('transaction.purseTransactionList')}}
                span(v-for="purse in user.purses")
                    span.purse-name(v-if="purse.purse == $route.params.id") {{purse.name}}

                div.break

            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                ul.select_item.pull-left
                    li(v-ripple @click="applyGeneralFilter('all')" v-bind:class="{ active: generalFilter == 'all' }" ) {{$i18n.t('transaction.all')}}
                    li(v-ripple @click="applyGeneralFilter('1')" v-bind:class="{ active: generalFilter == '1' }")  {{$i18n.t('transaction.deposit')}}
                    li(v-ripple @click="applyGeneralFilter('-1')" v-bind:class="{ active: generalFilter == '-1' }")  {{$i18n.t('transaction.removal')}}
                    li(v-ripple @click="applyGeneralFilter('-2')" v-bind:class="{ active: generalFilter == '-2' }")  {{$i18n.t('transaction.movingOut')}}


        div.row.transaction-fields-title
            div.col-lg-2.col-md-2.col-sm-3.hidden-xs
                span {{ $i18n.t('transaction.id') }}
            div.col-lg-3.col-md-3.col-sm-3.hidden-xs
                span {{ $i18n.t('transaction.source') }}
            div.col-lg-3.col-md-3.col-sm-3.col-xs-12.hidden-title-md.hidden-xs
                span {{ $i18n.t('transaction.destination') }}
            div.col-lg-2.col-md-3.col-sm-1.col-xs-12.hidden-xs
                span {{ $i18n.t('transaction.date') }}
            div.col-lg-1.col-md-2.col-sm-1.hidden-xs
                span {{ $i18n.t('transaction.amount') }}
                small ({{ $i18n.t('transaction.toman') }})
            div.col-lg-1.col-md-2.col-sm-1.hidden-xs
                span {{ $i18n.t('common.balance') }}
                small ({{ $i18n.t('transaction.toman') }})


        div.col-lg-12.col-md-12.col-sm-12.col-xs-12
                singleTransaction(v-for="transaction in transactions" v-bind:transaction="transaction")

        div.ta-center
            button.btn.rounded.success(@click="loadMore") +

</template>

<script>
    import singleTransaction from './partials/single-transaction.vue';
    import selectbox from '../partials/selectbox.vue';

    export default {
        name: 'transaction-index',
        data () {
            return {
                searchOptions: {},
                filterType: null,
                filterValue: null,
                generalFilter: 'all',
                filterTypeData: [
                    {
                        title: 'شماره تراکنش',
                        value: 'transaction_id'
                    },
                    {
                        title: 'پن',
                        value: 'pan'
                    },
                    {
                        title: 'توضیحات',
                        value: 'description'
                    },
                    {
                        title: 'ایمیل',
                        value: 'email'
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

            window.onscroll = function(ev) {
                if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
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
                if (this.$route.params.type === 'purse') {
                    this.addFilter('purseId', this.$route.params.id);
                } else if (this.$route.params.type === 'webservice') {
                    this.addFilter('webserviceId', this.$route.params.id);
                }
                this.addFilter('status', this.generalFilter);
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
                let vm = this;
                this.$store.dispatch(
                    'paginator/make',
                    {
                        vm,
                        resource:vm.$store.state.http.requests['transaction.getRecents'],
                        resourceData:vm.searchOptions
                    }
                );
            },
            loadMore() {
                this.$store.dispatch(
                    'paginator/next'
                );
            },
            selectFilter(value){
                this.filterType = value;
            }

        },
        computed: {
            user() {
                return this.$store.state.auth.user;
            },
            transactions(){
                return this.$store.state.paginator.data;
            }
        },
        components: {
            singleTransaction,
            selectbox
        }
    }
</script>
