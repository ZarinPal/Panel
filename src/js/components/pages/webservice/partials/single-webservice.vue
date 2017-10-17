<template lang="pug">
    div.col-xs-12.col-sm-12.col-md-6.col-lg-6.section
        div.box
            div.top-xs.header
                div.row
                    div.col-xs.right-box
                        p(v-if="this.$store.state.app.singleWebserviceMoreTrigger != webservice.entity_id")
                            span.green-small-circle
                            span.header-title(:title="webservice.name") {{webservice.name}}

                    div.col-xs.ta-left-box.left-box
                        span.icon-more(@click="changeMoreTriggerOn()" id="btnMoreIcon")
                        transition( name="bounce"
                        enter-active-class="drop-down-show"
                        leave-active-class="drop-down-hide")
                            span.drop-down.pull-left(v-click-outside="closeDropDownFromOutside" v-if="this.$store.state.app.singleWebserviceMoreTrigger == webservice.entity_id")
                                span.close-drop-down.drop-down-item(v-ripple="" @click="changeMoreTriggerOff()")
                                router-link.drop-down-item.transaction-icon(tag="span" v-bind:to="{ name: 'transaction.index', params: { type:'webservice', id:webservice.entity_id}}") {{ $i18n.t('common.transactions') }}
                                <!--router-link.drop-down-item.transaction-session-icon(tag="span" v-bind:to="{ name: 'transactionsession.index', params: { id:webservice.entity_id}}") {{ $i18n.t('common.transactionSession') }}-->
                                <!--router-link.drop-down-item.withdraw-icon(tag="span" v-bind:to="{ name: 'report.index', params: { type:'webservice', id:webservice.entity_id}}") {{$i18n.t('common.calendar')}}-->
                                router-link.drop-down-item.edit-icon(tag="span" v-bind:to="{ name: 'webservice.edit', params: { merchantCode:webservice.entity_id}}") {{$i18n.t('webservice.edit')}}

                        a.header-link(v-if="this.$store.state.app.singleWebserviceMoreTrigger != webservice.entity_id" v-bind:href="'http://' + webservice.domain" target="blank") {{webservice.domain}}

            div.middle-xs.body
                div.row.box-row
                    div.col-xs.ta-right
                        span.label {{ $i18n.t('webservice.webserviceCode') }}

                    div.col-xs.ta-left.no-margin
                        div.row.label-group.pull-left
                            div.col-xs.text.merchant-code
                                input.txt-webservice-id(:id="'txtWebserviceId-' + webservice.entity_id" onfocus="this.select();" v-bind:value="webservice.entity_id" readonly="readonly")
                            div.icon(@click="clipboardMessage(webservice.entity_id)"   v-clipboard="" v-bind:data-clipboard-text="webservice.entity_id")

                div.row.box-row
                    div.col-xs.ta-right
                        span.label {{ $i18n.t('webservice.ip') }}

                    div.col-xs.ta-left(v-if="webservice.ip")
                        span.text-value {{webservice.ip}}

                    div.col-xs.ta-left(v-else)
                        span.text-value {{ $i18n.t('webservice.unlimited') }}

                <!--Web gate-->
                div.row.box-row
                    div.col-xs.ta-right
                        span.label وب گیت

                    div.col-xs.ta-left.no-left-margin(v-if="webservice.zaringate_status == 'NotActivated'")
                        span.tag.tag-inactive.pull-left(v-ripple="" @click="visibleZarinGateActivation = true") {{ $i18n.t('webservice.zarinGate') }}

                    div.col-xs.ta-left.no-left-margin(v-else)
                        span.tag.tag-active.pull-left(v-ripple="") {{ $i18n.t('webservice.zarinGate') }}

                <!--Ussd-->
                div.row.box-row
                    div.col-xs.ta-right
                        span.label USSD

                    div.col-xs.ta-left.no-left-margin.dir-ltr(v-if="webservice.ussd_id")
                        span.text-value.persian-num *788*97*{{ webservice.ussd_id }}#
                    div.col-xs.ta-left.no-left-margin(v-else)
                        span.tag.tag-inactive.pull-left(v-ripple="" @click="visibleUssdActivation = true") USSD

        ussdActivation(v-if="visibleUssdActivation" v-on:closeModal="closeModal()" v-bind:webservice="webservice")
        zarinGateActivation(v-if="visibleZarinGateActivation" v-on:closeModal="closeModal()" v-bind:webservice="webservice")
</template>

<script>

    import ussdActivation from './ussd-activation.vue';
    import zarinGateActivation from './zarin-gate-activation.vue';

    export default {
        name: 'pages-webservice-partials-singleWebservice',
        data(){
            return {
                visibleUssdActivation: false,
                visibleZarinGateActivation: false
            }
        },
        props: ['webservice'],
        methods: {
            changeMoreTriggerOn() {
                this.$store.state.app.singleWebserviceMoreTrigger = this.webservice.entity_id;
            },
            changeMoreTriggerOff() {
                this.$store.state.app.singleWebserviceMoreTrigger = null;
            },
            closeDropDownFromOutside() {
                let vm = this;
                document.addEventListener('click', function (e) {
                    if (e.target.id !== 'btnMoreIcon') {
                        vm.$store.state.app.singleWebserviceMoreTrigger = null;
                    }
                }, false);
            },
            closeModal(){
                this.visibleUssdActivation = false;
                this.visibleZarinGateActivation = false;
                store.commit('clearValidationErrors');
            },
            clipboardMessage(event) {
                setTimeout(function () {
                    let txtWebserviceId = document.getElementById('txtWebserviceId-' + event);
                    if (txtWebserviceId) {
                        txtWebserviceId.select();
                    }
                }, 10);

                store.commit('flashMessage', {
                    text: 'copied',
                    type: 'success',
                    timeout: '1500'
                });
            },
            handleFocus(){
                console.log('kosher');
                event.target.select();
            }
        },
        components: {
            ussdActivation,
            zarinGateActivation
        }
    }
</script>
