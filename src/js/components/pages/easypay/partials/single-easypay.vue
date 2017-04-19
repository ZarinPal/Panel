<template lang="pug">
div.col-xs-12.col-sm-12.col-md-6.col-lg-6.section
    div.box
        div.top-xs.header
            div.row
                div.right-box
                    p
                        span.green-small-circle(@click="confirmVisible = true")
                        span.header-title {{easypay.title}}

                div.col-xs.ta-left-box
                    router-link.header-link(tag="span" v-bind:to="{ name: 'auth.register'}") https://zarinp.al/{{easypay.public_id}}

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
                        img(v-if="easypay.purse == 1" src="assets/img/zarin-logo.png")
                        span.purse-color(v-else v-bind:class="'color-' + easypay.purse")
                        span {{easypay.purse_name}}

            div.row.box-row
                div.right
                    span.label {{$i18n.t('easypay.limit')}}

                div.col-xs.ta-left
                    span.text-value(v-if="easypay.limit") {{easypay.limit}}
                    span.text-value(v-else) {{$i18n.t('easypay.noLimit')}}

            br
        div.bottom-xs.box-footer
            div.row
                div.col-xs-4.no-margin
                    router-link.transaction(tag="span" v-bind:to="{ name: 'transaction.index', params: { type:'easypay', id: easypay.entity_id}}") تراکنش ها
                div.col-xs-4.no-margin
                    router-link.edit(tag="span" v-bind:to="{ name: 'easypay.edit', params: { public_id: easypay.entity_id} }") {{$i18n.t('common.edit')}}
                div.col-xs-4.no-margin
                    span.delete {{$i18n.t('common.delete')}}

    confirm(v-if="confirmVisible" v-on:confirm="confirm()" v-on:closeModal="closeModal()")

</template>

<script>
    import confirm from '../../partials/confirm.vue';

    export default {
        name: 'pages-easypay-partials-singleEasypay',
        data(){
            return {
                confirmVisible: false,
                confirm: true,
            }
        },
        props: ['easypay'],
        methods: {
            sayHello(){
                alert('hello');
            },
            closeModal(){
                this.confirmVisible = false;
            },
            confirm(){
                this.confirm = true;
                alert(this.confirm);
            },
            deleteEasypay() {
                alert('deleted');
                return;

//                let params = {
//                    easypay_id: this.easypay.entity_id
//                };
//
//                this.$store.state.http.requests['easypay.getShow'].remove(params).then(
//                    () => {
//                        this.$router.push({name: 'easypay.index'})
//                    },
//                    (response) => {
//                        store.commit('flashMessage', {
//                            text: response.data.meta.error_message,
//                            important: false,
//                            type: 'danger'
//                        });
//                    }
//                )
            }
        },
        components: {
//            confirm,
            confirm: {
                props: {
                    class: String,
                    sureClass: String,
                    func: {
                        type: Function,
                        required: true
                    }
                },

                data: function() {
                    return {
                        confirm: false
                    };
                },
            }
        }
    }
</script>
