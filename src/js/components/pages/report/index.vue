<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                p.page-title {{ $i18n.t('report.title') }}
                p.page-description {{ $i18n.t('report.description') }}
        div.row
            div.col-xs
                div.section
                    div.box
                        div.body.search-box
                            div.row
                                span.icon-search
                                span.search-title {{ $i18n.t('ticket.search') }}
                                span.break

                            div.row
                                div.col-lg-4.col-md-4.col-sm-4.col-xs-12
                                    date-picker.persian-num(v-validate="'required'" v-bind:data-vv-as="$i18n.t('transaction.fromDate')" v-model="date" name="date" type="date" view='year' min="1300/01/01" :placeholder="$i18n.t('transaction.fromDate')")
                                    div.ta-right(v-if="validation('date')")
                                        span.text-danger {{ errors.first('date') }}

                                div.col-lg-4.col-md-4.col-sm-4.col-xs-12.search-box-buttons
                                    button.btn.info.pull-right(v-ripple="" @click="validateForm") {{ $i18n.t('common.search') }}
                                        svg.material-spinner(v-if="fetching" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                            circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")


        div.row.no-margin
            div.full-width
                div.box
                    div.full-width(v-if="reports")
                        div.row
                            div.col-xs.ta-center(v-for='titles in calendarDayTitles')
                                span {{titles}}
                        div.section(v-for='week in reports')
                            div.box.row
                                div.col-xs.cell(v-for='day in week' :class="{'zp-holiday': day.holiday, 'zp-inActive': day.inActived, 'zp-disabled-holiday': day.holiday && day.inActived, 'zp-today': day.date.format('YYYYMMDD') === momentNow.format('YYYYMMDD')}")
                                    div(v-if="day.income_count")
                                        span.show-income-count.pull-left.persian-num {{day.income_count}}
                                        span.show-income-amount.pull-right.persian-num {{day.income_amount | numberFormat}}
                                    div(v-if="day.outgo_count")
                                        span.show-outgo-count.pull-left.persian-num {{day.outgo_count}}
                                        span.show-outgo-amount.pull-right.persian-num {{day.outgo_amount | numberFormat}}
                                    div.row.bottom-xs.pull-left.persian-num.day-of-month
                                        |{{ day.date.format('jDD')}}
</template>

<script>
    import VuePersianDatetimePicker from 'vue-persian-datetime-picker'

    export default {
        name: 'report-index',
        data() {
            return {
                date: '',
                fetching: false,
                /**
                 * Request
                 */
                reportType: 'purse', //purse, webservice

                /**
                 * Response
                 */
                reports: null,

                /**
                 * Calendar
                 */
                calendarDayTitles: [],
                monthDays: [],
                currentDate: moment(),
            }
        },
        computed: {
            /**
             * Calendar
             */
            momentNow() {
                return moment();
            }
        },
        created() {
            this.calendarDayTitles = this.weekDayTitles();
        },
        methods: {
            validateForm() {
                this.$validator.validateAll({
                    date: this.date,
                }).then((result) => {
                    if (result) {
                        this.fetchReports(this.getMonthDays);
                    }
                });
            },
            fetchReports(callback) {
                this.fetching = true;
                let reportName = 'report.purseTransactions';

                let from_date = moment(this.date, 'jYYYY/jM/jD').endOf('jMonth').subtract(1, 'jMonth');
                let to_date = moment(this.date, 'jYYYY/jM/jD').endOf('jMonth');

                let reportData = {
                    from_date: from_date.endOf('jMonth').startOf('jWeek').format(),
                    to_date: to_date.endOf('jMonth').endOf("jWeek").format(),
                    purse_number: this.$route.params.reportId,
                };

                if (this.$route.params.reportFor === 'webservice') {
                    reportName = 'report.webserviceTransactions';
                    reportData.webservice_id = this.$route.params.reportId;
                    delete reportData.purse_number;
                }

                this.$store.state.http.requests[reportName].save(reportData).then((response) => {
                    this.reports = response.data.data;
                    callback(); //get calendar days
                    this.fetching = false;
                }).catch((error) => {
                    this.fetching = false;
                    store.commit('setValidationErrors', response.data.validation_errors);
                    store.commit('flashMessage', {
                        text: response.data.meta.error_message,
                        important: false,
                        type: 'danger'
                    });
                });
            },

            /**
             * Calendar
             */
            getMonthDays() {
                this.getCurrentMonth();
                this.reports = _.chunk(this.reports, 7);
            },
            getCurrentMonth() {
                let vm = this;
                this.reports = this.reports.map(function (report) {
                    report.date = moment(report.date);
                    report.inActived = false;
                    report.holiday = vm.checkForHoliday(report.date);
                    return report;
                });
            },
            weekDayTitles() {
                let weekDays = moment()._locale._weekdays;

                weekDays = _.initial(weekDays);
                weekDays.unshift(moment().day(6).format('dddd'))
                return weekDays
            },
            checkForHoliday(singleDate) {
                if (moment.locale() === 'fa') {
                    if (singleDate.days() === 5)
                        return true;
                    return false
                }

                if (singleDate.days() === 0)
                    return true;
                return false;
            },
        },
        components: {
            datePicker: VuePersianDatetimePicker
        }
    }
</script>
