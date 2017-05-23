<template lang="pug">
div
    div.row.transaction-row
        div.col-lg-2.col-md-2.col-sm-3.hidden-xs.ta-center
            span.text {{session.authority | persianNumbers}}
        div.col-lg-2.col-md-2.col-sm-3.hidden-xs.ta-center
            span.transaction-fields-title {{session.created_at | persianNumbers}}
        div.col-lg-2.col-md-2.col-sm-3.hidden-xs.ta-center
            span.transaction-fields-title {{session.amount | persianNumbers}}
        div.col-lg-2.col-md-2.col-sm-3.hidden-xs.ta-center
            span.transaction-fields-title {{session.cellnum }}
        div.col-lg-2.col-md-2.col-sm-3.hidden-xs.ta-center
            span.transaction-fields-title {{session.email }}
        div.col-lg-2.col-md-2.col-sm-3.hidden-xs.ta-center
            span.transaction-fields-title(@click="showTransaction(session.transaction.public_id)") {{session.transaction.public_id }}

    transactionDetails(v-if="showTransactionDetail" v-bind:transaction="transaction" v-on:closeModal="closeModal()")


</template>
<script>
    import transactionDetails from './transaction-details.vue';

    export default {
        name:'pages-transactionSession-partials-singleTransactionSession',
        data(){
            return{
                showTransactionDetail: false,
                transaction: false,
            }
        },
        props:['session'],
        methods:{
            closeModal(){
                this.showTransactionDetail = false;
            },

            showTransaction(public_id){
                if(this.transaction){
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
