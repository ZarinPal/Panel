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
                                    date-picker.persian-num(v-validate="'required'" v-bind:data-vv-as="$i18n.t('transaction.fromDate')" v-model="selectDay" name="selectDay" type="date" view='year' min="1388/01/01"  :max="maxDate"  :placeholder="$i18n.t('transaction.fromDate')")
                                    div.ta-right(v-if="validation('date')")
                                        span.text-danger {{ errors.first('date') }}

                                div.col-lg-4.col-md-4.col-sm-4.col-xs-12.search-box-buttons
                                    button.btn.info.pull-right(v-ripple="" @click="validateForm") {{ $i18n.t('common.search') }}
                                        svg.material-spinner(v-if="fetching" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                            circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")


        div.row.no-margin
            div.full-width
                div.box.xs-hidden
                    div.full-width(v-if="reports")
                        div.row
                            div.col-xs.ta-center(v-for='titles in calendarDayTitles')
                                span {{titles}}
                        div.section(v-for='week in this.monthDays')
                            div.box.row.min-height-box
                                div.col-xs.cell(v-for='day in week' :class="{'zp-holiday': day.holiday, 'zp-inActive': day.inActived, 'zp-disabled-holiday': day.holiday && day.inActived}")
                                    div.row(v-if="day.turnovers")
                                        div.col-xs-12(v-if="day.turnovers.income_count")
                                            span.show-income-count.pull-left.persian-num {{day.turnovers.income_count}}
                                            span.show-income-amount.pull-right.persian-num(title='تراکنش ورودی') {{day.turnovers.income_amount | numberFormat}}
                                        div.col-xs-12(v-if="day.turnovers.outgo_count")
                                            span.show-outgo-count.persian-num.pull-left {{day.turnovers.outgo_count}}
                                            span.show-outgo-amount.persian-num.pull-right(title='تراکنش خروجی') {{day.turnovers.outgo_amount | numberFormat}}
                                    div.row.bottom-xs.pull-left.persian-num.day-of-month
                                        div(:title="day.date.format('jD jMMMM jYY')") {{day.date.format('jD')}}

</template>

<script>
    import VuePersianDatetimePicker from 'vue-persian-datetime-picker'

    export default {
        name: 'report-index',
        data() {
            return {
                selectDay: moment().format('jYYYY-jMM-jDD'),
                durationDate: moment(),
                maxDate: moment().format('jYYYY/jMM/jDD'),

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
            this.fetchReports(this.getMonthDays);
        },
        methods: {
            validateForm() {
                this.$validator.validateAll({
                    durationDate: this.durationDate,
                }).then((result) => {
                    if (result) {
                        this.durationDate = moment(this.selectDay, 'jYYYY/jM/jD');
                        this.fetchReports(this.getMonthDays);
                    }
                });
            },

            /**
             * Api
             *
             */
            fetchReports(callback) {
                this.fetching = true;
                let reportName = 'report.purseTransactions';

                // let from_date = moment(this.durationDate, 'jYYYY/jM/jD').startOf('jMonth');
                // let to_date = moment(this.durationDate, 'jYYYY/jM/jD').endOf('jMonth');

                let from_date = this.durationDate.startOf('jMonth');
                let to_date = this.durationDate.clone().endOf('jMonth');


                let reportData = {
                    from_date: from_date.format('YYYY-MM-DD'),
                    to_date: to_date.format('YYYY-MM-DD'),
                    purse_number: this.$route.params.reportId,
                };

                if (this.$route.params.reportFor === 'webservice') {
                    reportName = 'report.webserviceTransactions';
                    reportData.webservice_id = this.$route.params.reportId;
                    delete reportData.purse_number;
                }

                this.$store.state.http.requests[reportName].save(reportData).then((response) => {
                    this.reports = response.data.data;

                    callback();
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
                this.getPrevMonth();
                this.getNextMonthDays();

                if (this.monthDays) {
                    let vm = this;

                    let finalMonthReport = _.forEach(this.monthDays, function(day) {
                        day.turnovers = _.find(vm.reports, function(report) {
                            return report.date == day.date.format('YYYY-MM-DD');
                        });
                    });

                    this.monthDays = _.chunk(finalMonthReport, 7);
                }

            },
            nextMonth() {
                this.durationDate.add(1, 'jMonth');
                this.getMonthDays();
            },
            prevMonth() {
                this.durationDate.subtract('jMonth');
                this.getMonthDays();
            },
            getCurrentMonth() {
                this.monthDays = [];
                let monthDays = this.durationDate.clone().startOf('jMonth').subtract(1, 'd');

                while (this.durationDate.clone().endOf('jMonth').format('jYYYYjMMjDD') !== monthDays.format('jYYYYjMMjDD')) {
                    monthDays.add(1, 'd');
                    this.monthDays.push({
                        inActived: false,
                        holiday: this.checkForHoliday(monthDays),
                        date: monthDays.clone()
                    });
                }
            },
            getPrevMonth() {
                let startOfPrevMonth = this.durationDate.clone().startOf('jMonth');
                this.getPrevMonthDays(startOfPrevMonth);
            },
            getPrevMonthDays(startOfPrevMonth) {
                let startOfPrevMonthDays = startOfPrevMonth.days() + 1;

                let prevMonthStart = startOfPrevMonth.clone().subtract(startOfPrevMonthDays, 'd');
                let prevMonthDay = prevMonthStart.clone().endOf('jMonth').add(1, 'd');
                while (prevMonthStart.format('jYYYYjMMjDD') !== prevMonthDay.format('jYYYYjMMjDD')) {
                    prevMonthDay.subtract(1, 'd');
                    this.monthDays.unshift({
                        inActived: true,
                        holiday: this.checkForHoliday(prevMonthDay),
                        date: prevMonthDay.clone()
                    });
                }
            },
            getNextMonthDays() {
                let nextMonthStart = this.durationDate.clone().endOf('jMonth').add(1, 'd');
                while (this.monthDays.length % 7 !== 0) {
                    this.monthDays.push({
                        inActived: true,
                        holiday: this.checkForHoliday(nextMonthStart),
                        date: nextMonthStart.clone()
                    });
                    nextMonthStart.add(1, 'd');
                }
            },
            weekDayTitles() {
                let weekDays = moment()._locale._weekdays;
                weekDays = _.initial(weekDays);
                weekDays.unshift(moment().day(6).format('dddd'))
                return weekDays
            },
            checkForHoliday(singleDate) {
                if (singleDate.days() === 5)
                    return true;
                return false;
            },
        },
        components: {
            datePicker: VuePersianDatetimePicker
        }
    }
</script>
