<template lang="pug">
div.col-xs-12.col-sm-12.col-md-6.col-lg-6.section
    div.box
        div.top-xs.header
            div.row
                div.col-xs.right-box
                    p
                        span.green-small-circle
                        span.header-title(:title="webservice.name") {{webservice.name}}

                div.col-xs.ta-left-box(v-bind:title="webservice.domain")
                    a.header-link(v-bind:href="'http://' + webservice.domain" target="blank") {{webservice.domain}}

        div.middle-xs.body

            div.row.box-row
                div.col-xs.ta-right
                    span.label کد درگاه

                div.col-xs.ta-left.no-margin
                    div.row.label-group.pull-left
                        div.col-xs.text.merchant-code {{webservice.entity_id}}
                        div.icon(@click="clipboardMessage()" v-clipboard="" v-bind:data-clipboard-text="webservice.entity_id")

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
                    span.tag.tag-inactive.pull-left(v-else @click="visibleUssdActivation = true") USSD
                    span.tag.tag-active.pull-left(v-if="webservice.zaringate_status == 'Activate'") وب گیت
                    span.tag.tag-inactive.pull-left(v-else @click="visibleZarinGateActivation = true") وب گیت

        div.bottom-xs.box-footer.webservice-box-footer
            div.row
                div.col-lg-3.col-md-3.col-sm-3.col-xs-3.no-margin
                    router-link.transaction(tag="span" v-bind:to="{ name: 'transaction.index', params: { type:'webservice', id:webservice.entity_id}}") تراکنش ها
                div.col-lg-3.col-md-3.col-sm-3.col-xs-3.no-margin
                    router-link.edit.no-margin(tag="span" v-bind:to="{ name: 'transactionsession.index', params: { id:webservice.entity_id}}") سشن های پرداخت
                div.col-lg-3.col-md-3.col-sm-3.col-xs-3.no-margin
                    router-link.transaction(tag="span" v-bind:to="{ name: 'report.index', params: { type:'webservice', id:webservice.entity_id}}") روزشمار
                div.col-lg-3.col-md-3.col-sm-3.col-xs-3.no-margin
                    router-link.edit(tag="span" v-bind:to="{ name: 'webservice.edit', params: { merchantCode:webservice.entity_id}}") {{$i18n.t('webservice.edit')}}

    ussdActivation(v-if="visibleUssdActivation" v-on:closeModal="closeModal()" v-bind:webservice="webservice")
    zarinGateActivation(v-if="visibleZarinGateActivation" v-on:closeModal="closeModal()" v-bind:webservice="webservice")
</template>

<script>

    import ussdActivation from './ussd-activation.vue';
    import zarinGateActivation from './zarin-gate-activation.vue';

    export default {
        name:'pages-webservice-partials-singleWebservice',
        data(){
            return{
                visibleUssdActivation: false,
                visibleZarinGateActivation: false
            }
        },
        props:['webservice'],
        methods:{
            closeModal(){
                this.visibleUssdActivation = false;
                this.visibleZarinGateActivation = false
            },
            clipboardMessage() {
                store.commit('flashMessage',{
                    text: 'copied',
                    type: 'success',
                    timeout: '500'

                });
            }
        },
        components:{
            ussdActivation,
            zarinGateActivation
        }
    }
</script>
