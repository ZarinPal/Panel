<template lang="pug">
div.col-xs-12.col-sm-12.col-md-6.col-lg-6.section
    div.box
        div.top-xs.header
            div.row
                div.col-xs.right-box
                    p
                        span.green-small-circle(@click="confirmVisible = true")
                        span.header-title(:title="easypay.title") {{easypay.title}}

                div.col-xs.ta-left-box
                    a.header-link(v-bind:href="'https://zarinp.al/' + easypay.public_id" target="blank") https://zarinp.al/{{easypay.public_id}}

        div.middle-xs.body
            div.row.box-row
                div.col-xs.ta-right
                    span.label {{$i18n.t('easypay.amount')}}

                div.col-xs.ta-left
                    span.text-value {{easypay.price | numberFormat | persianNumbers}} تومان


            div.row.box-row
                div.col-xs.ta-right
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
                    span.text-value(v-if="easypay.limit") {{easypay.limit | persianNumbers}}
                    span.text-value(v-else) {{$i18n.t('easypay.noLimit')}}

            br
        div.bottom-xs.box-footer
            div.row
                div.col-xs-4.no-margin
                    router-link.transaction(tag="span" v-bind:to="{ name: 'transaction.index', params: { type:'easypay', id: easypay.entity_id}}") تراکنش ها
                div.col-xs-4.no-margin
                    router-link.edit(tag="span" v-bind:to="{ name: 'easypay.edit', params: { public_id: easypay.entity_id} }") {{$i18n.t('common.edit')}}
                div.col-xs-4.no-margin
                    span.delete(@click="confirmVisible = true") {{$i18n.t('common.delete')}}

    confirm(v-if="confirmVisible" v-on:confirmed="deleteEasypay()" v-on:closeModal="closeModal")
        span(slot="title") {{$i18n.t('easypay.deleteEasypay')}}
        div.ta-right(slot="message")
            div آیا نسبت به حذف آسان پرداخت " {{easypay.title}} " اصمینان دارید؟
            div این عملیات غیر قابل بازگشت است.

        span(slot="messageDanger") {{$i18n.t('common.cancel')}}
        span(slot="messageSuccess") {{$i18n.t('easypay.yesDeleteIt')}}
</template>

<script>
    import confirm from '../../partials/confirm.vue';

    export default {
        name: 'pages-easypay-partials-singleEasypay',
        data(){
            return {
                confirmVisible: false,
                confirm: false,
            }
        },
        props: ['easypay'],
        methods: {
            clipboardMessage() {
                store.commit('flashMessage',{
                    text: 'copied',
                    type: 'success',
                    timeout: '500'
                });
            },
            closeModal(){
                this.confirmVisible = false;
                store.commit('clearValidationErrors');
            },
            deleteEasypay() {
                this.confirm = true;
                if(this.confirm) {
                    let params = {
                        easypay_id: this.easypay.entity_id
                    };

                    this.$store.state.http.requests['easypay.getShow'].remove(params).then(
                        () => {
                            let easypayId = _.findIndex(this.$store.state.auth.user.easypays, {'entity_id': this.easypay.entity_id});
                            this.$store.state.auth.user.easypays.splice(easypayId, 1);
                        },
                        (response) => {
                            store.commit('flashMessage', {
                                text: response.data.meta.error_message,
                                important: false,
                                type: 'danger'
                            });
                        }
                    )
                }
            }
        },
        components: {
            confirm
        }
    }
</script>
