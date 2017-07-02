<template lang="pug">
    div.row
        div.col-lg-3
            span {{debt.created_at}}
        div.col-lg-5
        div.col-lg-3
        div.col-lg-2
            span.req-btn.btn-decline رد کردن
            span.req-btn.btn-accept پرداخت

</template>

<script>

    export default {
        name: 'request-money-single-debt',
        data() {
          return {

          }
        },
        props:['debt'],
        created(){
        },
        methods: {

        },
    }
</script>
