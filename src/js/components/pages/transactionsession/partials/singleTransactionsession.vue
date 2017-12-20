<template lang="pug">
    div
        div.row.transaction-row
            div.col-lg-2.col-md-2.col-sm-3.hidden-xs.ta-center
                span.text.persian-num {{session.authority}}
            div.col-lg-2.col-md-2.col-sm-3.hidden-xs.ta-center
                span.transaction-fields-title.persian-num {{session.created_at}}
            div.col-lg-2.col-md-2.col-sm-3.hidden-xs.ta-center
                span.transaction-fields-title.persian-num {{session.amount | numberFormat}}
            div.col-lg-2.col-md-2.col-sm-3.hidden-xs.ta-center
                span.transaction-fields-title.persian-num {{session.cellnum }}
            div.col-lg-2.col-md-2.col-sm-3.hidden-xs.ta-center
                span.transaction-fields-title {{session.email }}
            div.col-lg-2.col-md-2.col-sm-3.hidden-xs.ta-center
                span.transaction-fields-title.persian-num(@click="showTransaction(session.transaction.public_id)") {{session.transaction.public_id }}

        transactionDetails(v-if="showTransactionDetail" v-bind:transaction="transaction" v-on:closeModal="closeModal()")


</template>
<script>
    import transactionDetails from './transaction-details.vue';

    export default {
        name: 'pages-transactionSession-partials-singleTransactionSession',
        data(){
            return {
                showTransactionDetail: false,
                transaction: false,
            }
        },
        props: ['session'],
        methods: {
            closeModal(){
                this.showTransactionDetail = false;
            },

            showTransaction(public_id){
                if (this.transaction) {
                    this.showTransactionDetail = true;
                    return;
                }
                this.$store.state.http.requests['transaction.getInfo'].get({transactionId: public_id}).then(
                    (response) => {
                        this.transaction = response.data.data;
                        this.showTransactionDetail = true;
                    }
                );
            }
        },
        components: {
            transactionDetails
        }
    }
</script>
