<template lang="pug">
    div.row.trans-row
        div.col-lg-2
            span.nav-user-avatars
                img.users-avatar(:src="debt.avatar" :title="debt.name")
        div.col-lg-5
            span.total-amount {{debt.amount | numberFormat | persianNumbers}}
            small {{ $i18n.t('transaction.toman') }} ،
            span {{debt.description}}
        div.col-lg-2.ta-center
            span {{ debt.created_at | fromNow | persianNumbers}}
        div.col-lg-3.ta-center
            span(v-if="debt.status == 'pending'")
                span.req-btn.btn-decline(@click="reject" v-bind:class="{'clicked': rejectLoading}") رد کردن
                    svg.material-spinner(v-if="rejectLoading" width="15px" height="15px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                        circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

                span.req-btn.btn-accept(@click="payRequest" v-bind:class="{'clicked-paid': payLoading}") پرداخت
                    svg.material-spinner(v-if="payLoading" width="15px" height="15px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                        circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

            span(v-else)
                span.paid-text(v-if="debt.status == 'paid'") {{ $i18n.t('requestMoney.paid') }}
                span.reject-text(v-else-if="debt.status == 'reject'") {{ $i18n.t('requestMoney.reject') }}
                span.pending-text(v-else-if="debt.status == 'pending'") {{ $i18n.t('requestMoney.pending') }}

</template>

<script>

    export default {
        name: 'request-money-single-debt',
        data() {
          return {
              rejectLoading: false,
              payLoading: false
          }
        },
        props:['debt'],
        created(){

        },
        methods: {
            reject() {
                this.rejectLoading = true;

                let requestData = {
                    entity_id: this.debt.entity_id
                };

                console.log(requestData);

                return;

                this.$store.state.http.requests['requestMoney.postRequestMoney'].save(requestData).then(
                    ()=> {
                        this.rejectLoading = false;

                        this.$router.push({name: 'requestMoney.index'})
                    },
                    (response) => {
                        this.rejectLoading = false;
                        store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            type: 'danger'
                        });
                    }
                )
            },
            payRequest() {
                this.payLoading = true;

            }
        },
    }
</script>
