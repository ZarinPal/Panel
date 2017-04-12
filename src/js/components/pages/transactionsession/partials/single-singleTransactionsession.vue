<template lang="pug">

div
    div.row.transaction-row
        div.col-lg-2.col-md-3.col-sm-3
            span.text {{transactionsession.amount}}
</template>
    <script>
    export default {
        name:'pages-transactionsession-partials-singleTransactionsession',
        data(){
            return{
            }
        },
        props:['transactionsession'],
        methods:{
        }
    }
</script>
