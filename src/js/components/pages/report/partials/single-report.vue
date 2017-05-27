<template lang="pug">

div
    div.row.transaction-row
        div.col-lg-2.col-md-2.col-sm-3.hidden-xs.ta-center
            span.text {{report.date | jalali('jYYYY-jMM-jDD') | persianNumbers}}
        div.col-lg-2.col-md-2.col-sm-3.hidden-xs.ta-center
            span.text {{report.income_amount | persianNumbers}}
        div.col-lg-2.col-md-2.col-sm-3.hidden-xs.ta-center
            span.transaction-fields-title {{report.income_count | persianNumbers}}
        div.col-lg-2.col-md-2.col-sm-3.hidden-xs.ta-center
            span.transaction-fields-title {{report.outgo_amount | persianNumbers}}
        div.col-lg-2.col-md-2.col-sm-3.hidden-xs.ta-center
            span.transaction-fields-title {{report.outgo_count | persianNumbers}}
</template>
<script>
    export default {
        name:'pages-report-partials-single-report',
        props:['report'],
    }
</script>
