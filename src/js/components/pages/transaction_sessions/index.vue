<template lang="pug">
  div.inner-content

    div.row.nav-page-header

      div.col-lg-6.col-md-6.col-sm-12.col-xs-12
        p.page-description {{ $i18n.t('transactionSession.description') }}
      div.col-lg-6.col-md-6.col-sm-12.col-xs-12
        router-link.btn.default.pull-left(tag="button" v-bind:to="{ name: 'home.index'} ") {{ $i18n.t('common.returnToDashboard') }}

    div.row
      div.col-xs
        div.section
          div.box
            <!--div.body.search-box-->
            <!--div.row-->
            <!--span.icon-search-->
            <!--span.search-title {{ $i18n.t('transactionSession.search') }}-->
            <!--span.break-->
            <!--&lt;!&ndash;span.search-title {{ $i18n.t('transactionSession.advanceSearch') }}&ndash;&gt;-->
            <!---->
            <!--div.row-->
            <!--div.col-lg-4.col-md-4.col-sm-4.col-xs-12-->
            <!--input(v-model="filterValue" @change="addFilter(filterType, filterValue)" type="text" v-bind:placeholder="placeholder")-->
            <!--div.break-->
            <!--div.col-lg-4.col-md-4.col-sm-4.col-xs-12-->
            <!--selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-bind:data="filterTypeData" v-on:select="selectFilter" v-bind:selected="'transaction_id'" placeholder="انتخاب کنید ...")-->
            <!--div.break-->

            <!--div.col-lg-4.col-md-4.col-sm-4.col-xs-12.search-box-buttons-->
            <!--button.btn.info.pull-right(v-ripple="" @click="validateForm")-->
            <!--span {{ $i18n.t('common.search') }}-->

            <!--div-->
            <!--div.hand(@click="toggleDatePicker()") {{$i18n.t('transaction.advanceSearch')}}-->
            <!--transition(name="fade"-->
            <!--enter-active-class="fade-in"-->
            <!--leave-active-class="fade-out")-->
            <!--div.row(v-if="visibleAdvanceSearch")-->
            <!--div.col-lg-4.col-md-4.col-sm-4.col-xs-12-->
            <!--date-picker.persian-num(v-validate="{ rules: {required: true}}" v-model="fromDate" name="fromDate" v-bind:data-vv-as="$i18n.t('transaction.fromDate')" type="datetime" :placeholder="$i18n.t('transaction.fromDate')")-->
            <!--div.ta-right(v-if="validation('fromDate')")-->
            <!--span.text-danger {{ errors.first('fromDate') }}-->

            <!--div.col-lg-4.col-md-4.col-sm-4.col-xs-12-->
            <!--date-picker.persian-num(v-validate="{ rules: {required: true}}" v-model="toDate" name="toDate" v-bind:data-vv-as="$i18n.t('transaction.toDate')" type="datetime" :placeholder="$i18n.t('transaction.toDate')")-->
            <!--div.ta-right(v-if="validation('toDate')")-->
            <!--span.text-danger {{ errors.first('toDate') }}-->

    div.row.filter-row
      div.col-xs
        span.text {{$i18n.t('transactionSession.sessionList')}}
        span.purse-name {{webservice.name}}
    div.transaction-header-container
      div.row.transaction-fields-title#transactionsHeader(v-if="transactionSessions.data.length")
        div.col-lg-1.col-xs
          span {{ $i18n.t('transactionSession.id') }}
        div.col-lg-2.col-xs
          span {{ $i18n.t('transactionSession.amount') }}
        div.col-lg-2.col-xs.hidden-xs
          span {{ $i18n.t('transactionSession.created') }}
        div.col-lg-2.col-xs.hidden-xs.hidden-title-md
          span {{ $i18n.t('transactionSession.cellNum') }}
        div.col-lg-3.col-xs.hidden-xs.hidden-title-md
          span {{ $i18n.t('transactionSession.email') }}
        div.col-lg-2.col-xs
          span {{ $i18n.t('transactionSession.public_id') }}

    div.col-lg-12.col-md-12.col-sm-12.col-xs-12
      span(v-if="transactionSessions.data.length")
        singleSession(v-for="transactionSessions in transactionSessions.data" v-bind:key="transactionSessions.public_id" v-bind:transaction="transactionSessions")

      div.row(v-if="!transactionSessions.status && !transactionSessions.data.length")
        div.col-xs.ta-center
          span.txt-nothing-to-show  {{ $i18n.t('common.nothingToShow') }}

    div.ta-center(v-if="transactionSessions.status")
      loading

    div.ta-center(v-if="!this.$store.state.paginator.paginator.TransactionSessionList.resource.resource && transactionSessions.data.length")
      span.nothing-to-show-text {{ $i18n.t('common.thereIsNoOtherItemToDisplay') }}

    transactionDetails(v-if="transaction && showTransactionDetail" v-bind:transaction="transaction" v-on:closeModal="closeModal")

</template>

<script>
  import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
  import transactionDetails from './partials/transaction-details.vue';
  import singleSession from './partials/single-session.vue';
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
      }
    },
    computed: {
      user() {
        return this.$store.state.auth.user;
      },
      transactionSessions() {
        return {
          data: this.$store.state.paginator.paginator.TransactionSessionList.data,
          update: this.$store.state.paginator.update,
          status: this.$store.state.paginator.paginator.TransactionSessionList.isLoading,
        };
      },

      webservice(){
        return _.find(this.$store.state.auth.user.webservices,
            {'entity_id': this.$route.params.id});
      }
    },

    created() {

      this.restart();
      this.search();
      let vm = this;

      window.onscroll = function(ev) {
        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight
            &&
            !vm.$store.state.paginator.paginator.TransactionSessionList.isLoading) {
          vm.$store.dispatch(
              'paginator/next',
              {
                requestName: "TransactionSessionList"
              }
          );
        }
      };
    },
    methods: {
      toggleDatePicker() {
        this.visibleAdvanceSearch = !this.visibleAdvanceSearch;
        if (!this.visibleAdvanceSearch) {
          this.fromDate = '';
          this.toDate = '';
        }
      },
      validateForm() {
        this.$validator.validateAll({
          fromDate: this.fromDate,
          toDate: this.toDate
        }).then((result) => {
          if (result) {
            this.search();
          }
        });
      },
      restart() {
        this.filterValue = null;
        this.searchOptions = {};
        this.addFilter('webserviceId', this.$route.params.id);
        this.addFilter('status', this.generalFilter);
      },
      addFilter(filter, value) {
        this.searchOptions[filter] = value;
      },
      applyGeneralFilter(filter) {
        if (!this.transactionSessions.status) {
          this.generalFilter = filter;
          this.addFilter('status', this.generalFilter);
          this.search();
        }
      },
      search(){
        if (this.fromDate && this.toDate) {
          this.searchOptions.fromDate = moment(this.fromDate,
              'jYYYY/jMM/jDD HH:mm:ss').format();
          this.searchOptions.toDate = moment(this.toDate,
              'jYYYY/jMM/jDD HH:mm:ss').format();
        } else if (this.fromDate && !this.toDate) {
          this.searchOptions.fromDate = moment(this.fromDate,
              'jYYYY/jMM/jDD HH:mm:ss').format();
          this.searchOptions.toDate = moment(this.fromDate,
              'jYYYY/jMM/jDD HH:mm:ss').add(1, 'months').format();
        } else if (!this.fromDate && this.toDate) {
          this.searchOptions.fromDate = moment(this.toDate,
              'jYYYY/jMM/jDD HH:mm:ss').subtract(1, 'months').format();
          this.searchOptions.toDate = moment(this.toDate,
              'jYYYY/jMM/jDD HH:mm:ss').format();
        }

        let vm = this;
        this.$store.dispatch(
            'paginator/make',
            {
              vm,
              resource: vm.$store.state.http.requests['transaction.getSessions'],
              params: vm.searchOptions,
              requestName: "TransactionSessionList"
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
        let urlQuery = Object.keys(this.searchOptions).
            map(k => `${encodeURIComponent(k)}=${encodeURIComponent(
                this.searchOptions[k])}`).
            join('&');
        this.excelUrl = urlQuery; //this.$root.baseUrl + '?' + urlQuery;
      },
      closeModal(){
        this.showTransactionDetail = false;
        store.commit('clearValidationErrors');
      }
    },
    components: {
      singleSession,
      selectbox,
      loading,
      transactionDetails,
      datePicker: VuePersianDatetimePicker
    }
  }
</script>
