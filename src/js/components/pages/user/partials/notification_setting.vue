<template lang="pug">
    div.inner-content.nav-user-setting
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('user.notificationSetting') }}
                p.page-description {{ $i18n.t('user.notificationSettingDescription') }}

        alert-box
            span(slot="title") {{ $i18n.t('user.notice') }}
            span(slot="body")  {{ $i18n.t('user.notificationSmsPriceNotice') }}

        form(autocomplete="on" onsubmit="event.preventDefault();")
            div.row.section
                div.box.full-width

                    <!--Income Transaction-->
                    div.row.nav-notification-row
                        h4.full-width {{ $i18n.t('user.incomeTransaction') }}

                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.check-box
                            input(name="income_transaction" v-model="setting.income_transaction.email" type="checkbox" id="rdoIncomeTransactionEmail")
                            label(for="rdoIncomeTransactionEmail")
                                span
                                |{{ $i18n.t('user.email') }}
                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.check-box
                            input(name="income_transaction" v-model="setting.income_transaction.sms" type="checkbox" id="rdoIncomeTransactionSms")
                            label(for="rdoIncomeTransactionSms")
                                span
                                |{{ $i18n.t('user.sms') }}
                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.check-box
                            input(name="income_transaction" v-model="setting.income_transaction.telegram" type="checkbox" id="rdoIncomeTransactionTelegram")
                            label(for="rdoIncomeTransactionTelegram")
                                span
                                |{{ $i18n.t('user.telegram') }}
                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.check-box
                            input(name="income_transaction" v-model="setting.income_transaction.pusher" type="checkbox" id="rdoIncomeTransactionPusher")
                            label(for="rdoIncomeTransactionPusher")
                                span
                                |{{ $i18n.t('user.pusher') }}


                    <!--Outgo Transaction-->
                    div.row.nav-notification-row
                        h4.full-width {{ $i18n.t('user.outGoTransaction') }}

                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.check-box
                            input(name="outgo_transaction" v-model="setting.outgo_transaction.email" type="checkbox" id="rdoOutgoTransactionEmail")
                            label(for="rdoOutgoTransactionEmail")
                                span
                                |{{ $i18n.t('user.email') }}
                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.check-box
                            input(name="outgo_transaction" v-model="setting.outgo_transaction.sms" type="checkbox" id="rdoOutgoTransactionSms")
                            label(for="rdoOutgoTransactionSms")
                                span
                                |{{ $i18n.t('user.sms') }}
                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.check-box
                            input(name="outgo_transaction" v-model="setting.outgo_transaction.telegram" type="checkbox" id="rdoOutgoTransactionTelegram")
                            label(for="rdoOutgoTransactionTelegram")
                                span
                                |{{ $i18n.t('user.telegram') }}
                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.check-box
                            input(name="outgo_transaction" v-model="setting.outgo_transaction.pusher" type="checkbox" id="rdoOutgoTransactionPusher")
                            label(for="rdoOutgoTransactionPusher")
                                span
                                |{{ $i18n.t('user.pusher') }}


                    <!--New Ticket-->
                    div.row.nav-notification-row
                        h4.full-width {{ $i18n.t('user.newTicket') }}

                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.check-box
                            input(name="new_ticket" v-model="setting.new_ticket.email" type="checkbox" id="rdoNewTicketEmail")
                            label(for="rdoNewTicketEmail")
                                span
                                |{{ $i18n.t('user.email') }}
                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.check-box
                            input(name="new_ticket" v-model="setting.new_ticket.sms" type="checkbox" id="rdoNewTicketSms")
                            label(for="rdoNewTicketSms")
                                span
                                |{{ $i18n.t('user.sms') }}
                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.check-box
                            input(name="new_ticket" v-model="setting.new_ticket.telegram" type="checkbox" id="rdoNewTicketTelegram")
                            label(for="rdoNewTicketTelegram")
                                span
                                |{{ $i18n.t('user.telegram') }}
                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.check-box
                            input(name="new_ticket" v-model="setting.new_ticket.pusher" type="checkbox" id="rdoNewTicketPusher")
                            label(for="rdoNewTicketPusher")
                                span
                                |{{ $i18n.t('user.pusher') }}


                    <!--Ticket Reply-->
                    div.row.nav-notification-row
                        h4.full-width {{ $i18n.t('user.ticketReply') }}

                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.check-box
                            input(name="reply_ticket" v-model="setting.reply_ticket.email" type="checkbox" id="rdoTicketReplyEmail")
                            label(for="rdoTicketReplyEmail")
                                span
                                |{{ $i18n.t('user.email') }}
                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.check-box
                            input(name="reply_ticket" v-model="setting.reply_ticket.sms" type="checkbox" id="rdoTicketReplySms")
                            label(for="rdoTicketReplySms")
                                span
                                |{{ $i18n.t('user.sms') }}
                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.check-box
                            input(name="reply_ticket" v-model="setting.reply_ticket.telegram" type="checkbox" id="rdoTicketReplyTelegram")
                            label(for="rdoTicketReplyTelegram")
                                span
                                |{{ $i18n.t('user.telegram') }}
                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.check-box
                            input(name="reply_ticket" v-model="setting.reply_ticket.pusher" type="checkbox" id="rdoTicketReplyPusher")
                            label(for="rdoTicketReplyPusher")
                                span
                                |{{ $i18n.t('user.pusher') }}



                    <!--New Login-->
                    div.row.nav-notification-row
                        h4.full-width {{ $i18n.t('user.newLogin') }}

                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.check-box.inactive-step
                            input(name="new_login" v-model="setting.new_login.email" type="checkbox" id="rdoNewLoginEmail")
                            label(for="rdoNewLoginEmail")
                                span
                                |{{ $i18n.t('user.email') }}
                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.check-box.inactive-step
                            input(name="new_login" v-model="setting.new_login.sms" type="checkbox" id="rdoNewLoginSms")
                            label(for="rdoNewLoginSms")
                                span
                                |{{ $i18n.t('user.sms') }}
                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.check-box
                            input(name="new_login" v-model="setting.new_login.telegram" type="checkbox" id="rdoNewLoginTelegram")
                            label(for="rdoNewLoginTelegram")
                                span
                                |{{ $i18n.t('user.telegram') }}
                        div.col-lg-6.col-md-6.col-sm-6.col-xs-12.check-box.inactive-step
                            input(name="new_login" v-model="setting.new_login.pusher" type="checkbox" id="rdoNewLoginPusher")
                            label(for="rdoNewLoginPusher")
                                span
                                |{{ $i18n.t('user.pusher') }}



                    div.row.nav-button
                        div.col-xs
                            button.btn.success.pull-left(v-ripple="" @click="postUserNotificationSetting" tabindex="9") {{$i18n.t('user.updateSetting')}}
                                svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                    circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")
</template>



<script>
    import alertBox from '../../partials/alert-box.vue';

    export default {
        name: 'notificationSetting',
        data() {
            return {
                loading: false,
                setting: {
                    income_transaction: {
                        email: this.$store.state.auth.user.setting.income_transaction.email,
                        sms: this.$store.state.auth.user.setting.income_transaction.sms,
                        telegram: this.$store.state.auth.user.setting.income_transaction.telegram,
                        pusher: this.$store.state.auth.user.setting.income_transaction.pusher
                    },
                    outgo_transaction: {
                        email: this.$store.state.auth.user.setting.new_login.email,
                        sms: this.$store.state.auth.user.setting.new_login.sms,
                        telegram: this.$store.state.auth.user.setting.new_login.telegram,
                        pusher: this.$store.state.auth.user.setting.new_login.pusher
                    },
                    new_ticket: {
                        email: this.$store.state.auth.user.setting.new_ticket.email,
                        sms: this.$store.state.auth.user.setting.new_ticket.sms,
                        telegram: this.$store.state.auth.user.setting.new_ticket.telegram,
                        pusher: this.$store.state.auth.user.setting.new_ticket.pusher
                    },
                    reply_ticket: {
                        email: this.$store.state.auth.user.setting.reply_ticket.email,
                        sms: this.$store.state.auth.user.setting.reply_ticket.sms,
                        telegram: this.$store.state.auth.user.setting.reply_ticket.telegram,
                        pusher: this.$store.state.auth.user.setting.reply_ticket.pusher
                    },
                    new_login: {
                        email: this.$store.state.auth.user.setting.new_login.email,
                        sms: this.$store.state.auth.user.setting.new_login.sms,
                        telegram: this.$store.state.auth.user.setting.new_login.telegram,
                        pusher: this.$store.state.auth.user.setting.new_login.pusher
                    }
                }


            }
        },
        computed:{
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
        },
        methods: {
            postUserNotificationSetting() {
                this.loading = true;

                this.$store.state.http.requests['user.putNotificationPreferences'].update(this.setting).then(
                    ()=> {
                        /*** update user setting state ***/
                        delete this.$store.state.auth.user.setting;
                        this.$store.state.auth.user.setting = this.setting;

                        store.commit('flashMessage',{
                            text: 'notification setting set success',
                            important: false,
                            type: 'success'
                        });

                        this.loading = false;
//                        this.$router.push({name: 'user.index'})
                    },
                    (response) => {
                        this.loading = false;
                        store.commit('setValidationErrors',response.data.validation_errors);
                        store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            type: 'danger'
                        });
                    }
                )
            }
        },
        components: {
            'alert-box':alertBox
        }
    }
</script>