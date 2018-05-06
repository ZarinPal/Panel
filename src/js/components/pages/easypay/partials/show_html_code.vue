<template lang="pug">
    modal(v-on:closeModal="closeModal()")
        span(slot="title") {{$i18n.t('easypay.showLinkLocal')}}
        div(slot="content")
            div.middle-xs.body
                div.row.box-row
                    div.col-xs.ta-right
                        span.label {{$i18n.t('easypay.easypay')}}
                    div.col-xs.ta-left.no-margin
                        div.row.label-group.pull-left
                            div.col-xs.text.merchant-code
                                input.txt-webservice-id.dir-ltr(:id="'htmlCodeLink'" onfocus="this.select();" :value="zarinLinkUrl" readonly="readonly")
                            div.icon.copy(@click="clipboardMessage(zarinLinkUrl)" v-clipboard="zarinLinkUrl" v-bind:data-clipboard-text="zarinLinkUrl")
                div.row.box-row.padding-row
                    div.col-xs.ta-right
                        span.label {{$i18n.t('easypay.htmlCode')}}
                    div.col-xs.ta-left.no-margin
                        div.row.label-group.pull-left
                            div.col-xs.text.merchant-code
                                input.txt-webservice-id.dir-ltr(:id="'htmlCode'" onfocus="this.select();" :value="zarinLinkHtml" readonly="readonly")
                            div.icon.copy(@click="clipboardMessage(zarinLinkHtml)" v-clipboard="zarinLinkHtml" v-bind:data-clipboard-text="zarinLinkHtml")
                div.row.box-row.padding-row
                    div.col-xs.ta-right
                        span.label {{$i18n.t('easypay.buttonCode')}}
                    div.col-xs.ta-left.no-margin
                        div.row.label-group.pull-left
                            div.col-xs.text.merchant-code
                                input.txt-webservice-id.dir-ltr(:id="'htmlCodeButton'" onfocus="this.select();" :value="zarinLinkButton" readonly="readonly")
                            div.icon.copy(@click="clipboardMessage(zarinLinkButton)" v-clipboard="zarinLinkButton" v-bind:data-clipboard-text="zarinLinkButton")
                div.row.box-row.padding-row
                    div.col-xs.ta-right
                        span.label {{$i18n.t('easypay.BbCode')}}
                    div.col-xs.ta-left.no-margin
                        div.row.label-group.pull-left
                            div.col-xs.text.merchant-code
                                input.txt-webservice-id.dir-ltr(:id="'htmlCodeBb'" onfocus="this.select();" :value="zarinLinkBb" readonly="readonly")
                            div.icon.copy(@click="clipboardMessage(zarinLinkBb)" v-clipboard="zarinLinkBb" v-bind:data-clipboard-text="zarinLinkBb")


</template>


<script>
    import modal from '../../partials/modal.vue';
    import loading from '../../partials/loading.vue';

    export default {
        name: 'show-html',
        props: ['entity'],
        computed: {
            zarinLinkUrl(){
                return 'https://Zarinp.al/' + this.entity;
            },
            zarinLinkHtml(){
                return '<a target=\'_blank\' title=\'پرداخت آنلاین\' href=\'' + this.zarinLinkUrl + '\'>پرداخت آنلاین</a>';
            },
            zarinLinkButton(){
                return '<a target=\'_blank\' title=\'پرداخت آنلاین\' href=\'' + this.zarinLinkUrl + '\'><img src=\'https://cdn.zarinpal.com/badges/easypay/logo1.png\'></a>';
            },
            zarinLinkBb(){
                return '[url=' + this.zarinLinkUrl + ']پرداخت آنلاین[/url]';
            }
        },
        methods: {
            closeModal() {
                this.$emit('closeModal');
            },
            clipboardMessage(event) {
                setTimeout(function () {
                    let htmlCodeField = document.getElementById(event);
                    if (htmlCodeField) {
                        htmlCodeField.select();
                    }
                }, 10);
                store.commit('flashMessage', {
                    text: 'Copied',
                    type: 'success',
                    timeout: '1500'
                });
            }
        },
        components: {
            modal,
            loading
        }
    };
</script>