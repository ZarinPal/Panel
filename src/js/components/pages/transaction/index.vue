<template lang="pug">
    div.inner-content

        div.row.nav-page-header

            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                p.page-title {{ $i18n.t('common.transactions') }}
                p.page-description {{ $i18n.t('transaction.description') }}
            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                router-link.btn.default.pull-left(tag="button" v-bind:to="{ name: 'home.index'} ") {{ $i18n.t('common.returnToDashboard') }}

        div.row
            div.col-xs
                div.section
                    div.box
                        div.body.search-box
                            div.row
                                span.icon-search
                                span.search-title {{ $i18n.t('transaction.search') }}
                                span.break
                                <!--span.search-title {{ $i18n.t('transaction.advanceSearch') }}-->

                            div.row
                                div.col-lg-4.col-md-4.col-sm-4.col-xs-12
                                    input(v-model="filterValue" @change="addFilter(filterType, filterValue)" type="text" v-bind:placeholder="placeholder")
                                    div.break
                                div.col-lg-4.col-md-4.col-sm-4.col-xs-12
                                    selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-bind:data="filterTypeData" v-on:select="selectFilter" v-bind:selected="'transaction_id'" placeholder="انتخاب کنید ...")
                                    div.break

                                div.col-lg-4.col-md-4.col-sm-4.col-xs-12.search-box-buttons
                                    button.btn.info.pull-right(v-ripple="" @click="search()")
                                        span {{ $i18n.t('common.search') }}

                            div
                                div.hand(@click="visibleAdvanceSearch = !visibleAdvanceSearch") {{$i18n.t('transaction.advanceSearch')}}
                                transition(name="fade"
                                enter-active-class="fade-in"
                                leave-active-class="fade-out")
                                    div.row(v-show="visibleAdvanceSearch")
                                        div.col-lg-4.col-md-4.col-sm-4.col-xs-12
                                            date-picker.persian-num(v-model="fromDate" type="datetime" :placeholder="$i18n.t('transaction.fromDate')")
                                        div.col-lg-4.col-md-4.col-sm-4.col-xs-12
                                            date-picker.persian-num(v-model="toDate" type="datetime" :placeholder="$i18n.t('transaction.toDate')")

        div.row.filter-row
            div.col-lg-4.col-md-4.col-sm-4.col-xs-12
                span.text(v-if="this.$route.params.type == 'purse'") {{$i18n.t('transaction.purseTransactionList')}}
                span(v-for="purse in user.purses")
                    span.purse-name(v-if="purse.purse == $route.params.id") {{purse.name}}
            div.col-lg-4.col-md-4.col-sm-4.col-xs-12.search-box-buttons
                a.btn.success.pull-left(:href="'/rest/v3/transaction/excel.json?' + excelUrl") {{$i18n.t('transaction.excelExport')}}

                div.break

            div.col-lg-4.col-md-4.col-sm-4.col-xs-12
                ul.select_item.pull-left(:class="{'disable-filter': loadingState.status}")
                    li(v-ripple="" @click="applyGeneralFilter('all')" v-bind:class="{ active: generalFilter == 'all' }" ) {{$i18n.t('transaction.all')}}
                    li(v-ripple="" @click="applyGeneralFilter('1')" v-bind:class="{ active: generalFilter == '1' }")  {{$i18n.t('transaction.deposit')}}
                    li(v-ripple="" @click="applyGeneralFilter('-1')" v-bind:class="{ active: generalFilter == '-1' }")  {{$i18n.t('transaction.removal')}}
                    li(v-ripple="" @click="applyGeneralFilter('-2')" v-bind:class="{ active: generalFilter == '-2' }")  {{$i18n.t('transaction.movingOut')}}

        div.transaction-header-container
            div.row.transaction-fields-title#transactionsHeader(v-if="transactions.data.length")
                div.col-lg-2.col-md-2.col-sm-3.hidden-xs
                    span {{ $i18n.t('transaction.id') }}
                div.col-lg-3.col-md-3.col-sm-3.hidden-xs
                    span {{ $i18n.t('transaction.source') }}
                    span.trans-float-destination-title ، {{ $i18n.t('transaction.destination') }}
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
            span(v-if="transactions.data.length")
                singleTransaction(v-for="transaction in transactions.data" v-bind:key="transaction.public_id" v-bind:transaction="transaction")

            div.row(v-if="!loadingState.status && !transactions.data.length")
                div.col-xs.ta-center
                    span.txt-nothing-to-show  {{ $i18n.t('common.nothingToShow') }}

        div.ta-center(v-if="loadingState.status")
            loading

        div.ta-center(v-if="!this.$store.state.paginator.paginator.TransactionList.resource.resource && transactions.data.length")
            span.nothing-to-show-text {{ $i18n.t('common.thereIsNoOtherItemToDisplay') }}

        transactionDetails(v-if="transaction && showTransactionDetail" v-bind:transaction="transaction" v-on:closeModal="closeModal")

</template>

<script>
    import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
    import transactionDetails from './partials/transaction-details.vue';
    import singleTransaction from './partials/single-transaction.vue';
    import selectbox from '../partials/selectbox.vue';
    import loading from '../../pages/partials/loading.vue';

    export default {
        name: 'transaction-index',
        data () {
            return {
                placeholder: '123456******6273',
                fromDate: '',
                toDate: '',
                searchOptions: {},
                filterType: null,
                filterValue: [],
                generalFilter: 'all',
                filterTypeData: [
                    {
                        title: 'شماره‌تراکنش',
                        value: 'transaction_id'
                    },
                    {
                        title: 'شماره‌کارت',
                        value: 'pan'
                    },
                    {
                        title: 'توضیحات',
                        value: 'description'
                    },
                    {
                        title: 'ایمیل',
                        value: 'email'
                    },
                    {
                        title: 'شماره‌موبایل',
                        value: 'mobile'
                    }

                ],
                transaction: null,
                showTransactionDetail: false,
                visibleAdvanceSearch: false,
                visibleDownloadExcel: false,
                excelUrl: null
            }
        },
        watch: {
            filterType(){
                this.restart();
            },
            '$route' () {
                this.showStandAloneTransaction();
            }
        },
        computed: {
            user() {
                return this.$store.state.auth.user;
            },
            transactions() {
                return {
                    data: this.$store.state.paginator.paginator.TransactionList.data,
                    update: this.$store.state.paginator.update,
                };
            },
            loadingState() {
                return {
                    status: this.$store.state.paginator.paginator.TransactionList.isLoading,
                    update: this.$store.state.paginator.update,
                }
            }
        },
        created() {
            this.restart();
            this.search();
            let vm = this;

            window.onscroll = function (ev) {
                if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight
                    && !vm.$store.state.paginator.paginator.TransactionList.isLoading) {
                    vm.$store.dispatch(
                        'paginator/next',
                        {
                            requestName: "TransactionList"
                        }
                    );
                }
            };
            this.showStandAloneTransaction();
        },
        methods: {
            restart() {
                this.filterValue = null;
                this.searchOptions = {};
                if (this.$route.params.type === 'purse') {
                    this.addFilter('purseId', this.$route.params.id);
                } else if (this.$route.params.type === 'webservice') {
                    this.addFilter('webserviceId', this.$route.params.id);
                } else if (this.$route.params.type === 'easypay') {
                    this.addFilter('easypayId', this.$route.params.id);
                }
                this.addFilter('status', this.generalFilter);
            },
            addFilter(filter, value) {
                this.searchOptions[filter] = value;
            },
            applyGeneralFilter(filter) {
                if (!this.loadingState.status) {
                    this.generalFilter = filter;
                    this.addFilter('status', this.generalFilter);
                    this.search();
                }
            },
            search(){
                if (this.fromDate || this.toDate) {
                    this.searchOptions.fromDate = moment(this.fromDate, 'jYYYY/jMM/jDD HH:mm:ss').format('YYYY-M-D HH:mm:ss');
                    this.searchOptions.toDate = moment(this.toDate, 'jYYYY/jMM/jDD HH:mm:ss').format('YYYY-M-D HH:mm:ss');
                }

                let vm = this;
                this.$store.dispatch(
                    'paginator/make',
                    {
                        vm,
                        resource: vm.$store.state.http.requests['transaction.getRecents'],
                        params: vm.searchOptions,
                        requestName: "TransactionList"
                    }
                );

                this.makeExcelQueryString();
            },
            selectFilter(value){
                this.filterType = value;
                switch (value) {
                    case 'transaction_id':
                        this.placeholder = '۳۹۲۳۳۸۷۱۵۱۴';
                        break;
                    case 'pan':
                        this.placeholder = '۱۲۳۴۵۶******۶۲۷۳';
                        break;
                    case 'description':
                        this.placeholder = 'بازگشت کارمزد تراکنش  ';
                        break;
                    case 'email':
                        this.placeholder = 'example@gmail.com';
                        break;
                    case 'mobile':
                        this.placeholder = '09xxxxxxxxx';
                        break;
                }
            },
            makeExcelQueryString() {
                let urlQuery = Object.keys(this.searchOptions).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(this.searchOptions[k])}`).join('&');
                this.excelUrl = urlQuery; //this.$root.baseUrl + '?' + urlQuery;
            },
            showStandAloneTransaction() {
                if (this.$route.params.transactionId) {
                    this.$store.state.http.requests['transaction.getInfo'].get({transactionId: this.$route.params.transactionId}).then(
                        (response) => {
                            this.showTransactionDetail = true;
                            this.transaction = response.data.data;
                        }, () => {

                        }
                    );
                }
            },
            closeModal(){
                this.showTransactionDetail = false;
                store.commit('clearValidationErrors');
            }
        },
        components: {
            singleTransaction,
            selectbox,
            loading,
            transactionDetails,
            datePicker: VuePersianDatetimePicker
        }
    }
</script>
