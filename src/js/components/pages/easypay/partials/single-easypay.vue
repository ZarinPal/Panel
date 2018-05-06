<template lang="pug">
    div.col-xs-12.col-sm-12.col-md-6.col-lg-4.section
        div.box
            div.top-xs.header
                div.row
                    div.right-box.overflow-hidden
                        p(v-if="this.$store.state.app.singleEasypayMoreTrigger != easypay.entity_id")
                            span.green-small-circle(@click="confirmVisible = true")
                            a.header-title(:href="'https://Zarinp.al/' +  easypay.public_id" target='_blank') {{easypay.title}}

                    div.col-xs.ta-left-box.left-box
                        span.icon-more(@click="changeMoreTriggerOn()" id="btnMoreIcon")
                        transition( name="bounce"
                        enter-active-class="drop-down-show"
                        leave-active-class="drop-down-hide")
                            span.drop-down.pull-left(v-click-outside="closeDropDownFromOutside" v-if="this.$store.state.app.singleEasypayMoreTrigger == easypay.entity_id")
                                span.close-drop-down.drop-down-item(v-ripple="" @click="changeMoreTriggerOff()")
                                router-link.drop-down-item.transaction-icon(v-ripple="" tag="span" v-bind:to="{ name: 'transaction.index', params: { type:'easypay', id: easypay.entity_id}}") {{$i18n.t('common.transactions')}}
                                router-link.drop-down-item.edit(v-ripple="" tag="span" v-bind:to="{ name: 'easypay.edit', params: { public_id: easypay.entity_id} }") {{$i18n.t('common.edit')}}
                                span.drop-down-item.eye(v-ripple="" @click="showHtmlVisible = true" ) {{$i18n.t('easypay.showLinkLocal')}}
                                span.drop-down-item.delete(v-ripple="" @click="confirmVisible = true") {{$i18n.t('common.delete')}}

                        span.header-link.overflow-visible.color-link(v-if="this.$store.state.app.singleEasypayMoreTrigger != easypay.entity_id" @click="showHtmlVisible = true") {{$i18n.t('easypay.showLinkLocal')}}

            div.middle-xs.body
                div.row.box-row
                    div.col-xs.ta-right
                        span.label {{$i18n.t('easypay.amount')}}

                    div.col-xs.ta-left
                        span.text-value.persian-num {{easypay.price | numberFormat }} {{$i18n.t('transaction.toman')}}

                div.row.box-row
                    div.ta-right
                        span.label {{$i18n.t('easypay.depositTo')}}

                    div.col-xs.ta-left.no-margin
                        span.tag-deposit-to.pull-left
                            div.logo(v-if="easypay.purse == 1")
                            span.purse-color(v-else v-bind:class="'color-' + easypay.purse")
                            span {{easypay.purse_name}}

                div.row.box-row
                    div.right
                        span.label {{$i18n.t('easypay.limit')}}

                    div.col-xs.ta-left
                        span.text-value.persian-num(v-if="easypay.limit") {{easypay.limit }}
                        span.text-value(v-else) {{$i18n.t('easypay.noLimit')}}


        confirm(v-if="confirmVisible" v-on:confirmed="deleteEasypay()" v-on:closeModal="closeModal")
            span(slot="title") {{$i18n.t('easypay.deleteEasypay')}}
            div.ta-right(slot="message")
                div.row.no-margin
                    div.col-xs-12 {{$i18n.t('coupon.deleteSure')}}  {{$i18n.t('easypay.easypay')}} " {{easypay.title}} " {{$i18n.t('coupon.areYouSure')}}
                    div.col-xs-12 {{$i18n.t('coupon.irreversible')}}

            span(slot="messageDanger") {{$i18n.t('common.cancel')}}
            span(slot="messageSuccess") {{$i18n.t('easypay.yesDeleteIt')}}

        <!--Show Html Code  -->
        show-html(v-if="showHtmlVisible" v-on:closeModal="closeModal" v-bind:entity="easypay.public_id")

</template>

<script>
    import confirm from '../../partials/confirm.vue';
    import showHtml from './show_html_code.vue';

    export default {
        name: 'pages-easypay-partials-singleEasypay',
        data(){
            return {
                confirmVisible: false,
                showHtmlVisible: false,
                confirm: false,
            }
        },
        props: ['easypay'],
        methods: {
            clipboardMessage() {
                store.commit('flashMessage', {
                    text: 'Copied',
                    type: 'success',
                    timeout: '1500'
                });
            },
            changeMoreTriggerOn() {
                this.$store.state.app.singleEasypayMoreTrigger = this.easypay.entity_id;
            },
            changeMoreTriggerOff() {
                this.$store.state.app.singleEasypayMoreTrigger = null;

                this.visibleMoreOptions = false;
            },
            closeDropDownFromOutside() {
                let vm = this;
                document.addEventListener('click', function (e) {
                    if (e.target.id !== 'btnMoreIcon') {
                        vm.$store.state.app.singleEasypayMoreTrigger = null;
                    }
                }, false);
            },
            closeModal(){
                this.confirmVisible = false;
                this.showHtmlVisible = false;
                store.commit('clearValidationErrors');
            },
            deleteEasypay() {
                this.confirm = true;
                if (this.confirm) {
                    let params = {
                        easypay_id: this.easypay.entity_id
                    };

                    this.$store.state.http.requests['easypay.getShow'].remove(params).then(
                        () => {
                            let easypayIndex = _.findIndex(this.$store.state.paginator.paginator.EasypayList.data,
                                {'entity_id': this.easypay.entity_id});
                            this.$store.state.paginator.paginator.EasypayList.data.splice(easypayIndex, 1);
                            this.$store.state.paginator.update++;

                            store.commit('flashMessage', {
                                text: 'EasypayDeletedLocal',
                                important: false,
                                type: 'success'
                            });
                        },
                        (response) => {
                            store.commit('flashMessage', {
                                text: response.data.meta.error_type,
                                important: false,
                                type: 'danger'
                            });
                        }
                    )
                }
            }
        },
        components: {
            confirm,
            'show-html': showHtml
        }
    }
</script>
