<template lang="pug">
div.col-xs-12.col-sm-12.col-md-6.col-lg-6.section
    div.box
        div.top-xs.header
            div.row
                div.col-xs.right-box
                    p
                        span.green-small-circle
                        span.header-title {{webservice.name}}

                div.col-xs.ta-left-box(v-bind:title="webservice.domain")
                    router-link.header-link(tag="span" v-bind:to="{ name: 'auth.register'}") {{webservice.domain}}


        div.middle-xs.body

            div.row.box-row
                div.col-xs.ta-right
                    span.label کد درگاه

                div.col-xs.ta-ta-left.no-margin
                    div.label-group.pull-left
                        span.text.merchant-code {{webservice.entity_id}}
                        span.icon

            div.row.box-row
                div.col-xs.ta-right
                    span.label آی پی

                div.col-xs.ta-left(v-if="webservice.ip")
                    span.text-value {{webservice.ip}}

                div.col-xs.ta-left(v-else)
                    span.text-value نامحدود

            div.row.box-row
                div.right
                    span.label سرویس ها

                div.col-xs.ta-left.no-margin
                    span.tag.tag-active.pull-left(v-if="webservice.ussd_id") USSD
                    span.tag.tag-inactive.pull-left(v-else) USSD
                    span.tag.tag-active.pull-left(v-if="webservice.zaringate_status == 'Activate'") وب گیت
                    span.tag.tag-inactive.pull-left(v-else) وب گیت

        div.bottom-xs.box-footer.webservice-box-footer
            div.row
                div.col-lg-4.col-md-4.col-sm-4.col-xs-6.no-margin
                    router-link.transaction(tag="span" v-bind:to="{ name: 'transaction.index', params: { type:'webservice', id:webservice.entity_id}}") تراکنش ها
                div.col-lg-4.col-md-4.col-sm-4.col-xs-6.no-margin
                    router-link.edit.no-margin(tag="span" v-bind:to="{ name: 'transactionsession.index', params: { id:webservice.entity_id}}") سشن های پرداخت
                div.col-lg-4.col-md-4.col-sm-4.col-xs-12.no-margin
                    router-link.edit(tag="span" v-bind:to="{ name: 'webservice.edit', params: { merchantCode:webservice.entity_id}}") {{$i18n.t('webservice.edit')}}

</template>
    <script>
    export default {
        name:'pages-webservice-partials-singleWebservice',
        data(){
            return{
            }
        },
        props:['webservice'],
        methods:{
        }
    }
</script>
