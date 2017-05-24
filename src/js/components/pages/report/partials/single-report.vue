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
        div.cal-heatmap
</template>
<script type="text/javascript" src="//d3js.org/d3.v3.min.js"></script>
<script type="text/javascript" src="//cdn.jsdelivr.net/cal-heatmap/3.3.10/cal-heatmap.min.js"></script>
<link rel="stylesheet" href="//cdn.jsdelivr.net/cal-heatmap/3.3.10/cal-heatmap.css" />
<script>
    var cal = new CalHeatMap();
    cal.init({});
    export default {
        name:'pages-report-partials-single-report',
        props:['report'],
    }
</script>
