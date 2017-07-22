<template lang="pug">
    div
        div.row.trans-row(@click="showDetails")
            div.col-lg-2.col-md-3.col-sm-3
                span.nav-user-avatars
                    img.users-avatar(:src="debt.avatar" :title="debt.name")
            div.col-lg-5.col-md-5.col-sm-5
                span.total-amount {{debt.amount | numberFormat | persianNumbers}}
                small {{ $i18n.t('transaction.toman') }} ،
                span {{debt.description}}
            div.col-lg-2.col-md-2.col-sm-2.ta-center
                span {{ debt.created_at | fromNow | persianNumbers}}
            div.col-lg-3.col-md-2.col-sm-2.ta-center
                span(v-if="debt.status == 'pending'")
                    span.req-btn.btn-decline(@click="confirmVisible = true" v-bind:class="{'clicked': rejectLoading}") رد کردن
                        svg.material-spinner(v-if="rejectLoading" width="15px" height="15px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                            circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

                    span.req-btn.btn-accept(@click="visiblePayRequest = true" v-bind:class="{'clicked-paid': payLoading}") پرداخت
                        svg.material-spinner(v-if="payLoading" width="15px" height="15px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                            circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

                span(v-else)
                    span.paid-text(v-if="debt.status == 'paid'") {{ $i18n.t('requestMoney.paid') }}
                    span.reject-text(v-else-if="debt.status == 'reject'") {{ $i18n.t('requestMoney.reject') }}
                    span.pending-text(v-else-if="debt.status == 'pending'") {{ $i18n.t('requestMoney.pending') }}



            confirm(v-if="confirmVisible" v-on:confirmed="reject()" v-on:closeModal="closeModal")
                span(slot="title") {{$i18n.t('common.zarinPal')}}
                div.ta-right(slot="message")
                    div {{$i18n.t('requestMoney.doYouDeclineRequestMoney')}}

                span(slot="messageDanger") {{$i18n.t('requestMoney.no')}}
                span(slot="messageSuccess") {{$i18n.t('requestMoney.yes')}}

            payRequest(v-if="visiblePayRequest" v-bind:debt="debt" v-on:closeModal="closeModal")


        <!--Debt details-->
        requestDetails(v-if="visibleDetails" v-bind:debt="debt" v-on:closeModal="closeModal")

</template>

<script>
    import confirm from '../../partials/confirm.vue';
    import payRequest from '../partials/pay_request.vue';
    import requestDetails from '../partials/request_details.vue';

    export default {
        name: 'request-money-single-debt',
        data() {
          return {
              rejectLoading: false,
              payLoading: false,
              confirmVisible: false,
              visiblePayRequest: false,
              visibleDetails: false
          }
        },
        props:['debt'],
        methods: {
            closeModal() {
                this.confirmVisible = false;
                this.visiblePayRequest = false;
                this.visibleDetails = false;
            },
            showDetails() {
                this.visibleDetails = this.debt.status !== 'pending';
            },
            reject() {
                this.changeRequestMode();
                this.rejectLoading = true;

                let requestData = {
                    entity_id: this.debt.entity_id,
                };

                this.$store.state.http.requests['requestMoney.postRequestMoney'].update(requestData).then(
                    (response)=> {
                        this.changeDebtState();
                        this.rejectLoading = false;
                        this.changeRequestMode();
                        store.commit('flashMessage',{
                            text: 'flash.reject-request-money-successfull',
                            type: 'success'
                        });
                    },
                    (response) => {
                        this.rejectLoading = false;
                        this.changeRequestMode();
                        store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            type: 'danger'
                        });
                    }
                )
            },
            changeDebtState() {
                let vm = this;
                let debtIndex = _.findIndex(this.$store.state.paginator.paginator.DebtList.data, function(debt) {
                    return debt.entity_id === vm.debt.entity_id;
                });
                this.$store.state.paginator.paginator.DebtList.data[debtIndex].status = 'reject';
            },
            changeRequestMode(){
                this.$emit('changeRequestMode',1);
            }
        },
        components: {
            confirm,
            payRequest,
            requestDetails
        }
    }
</script>
