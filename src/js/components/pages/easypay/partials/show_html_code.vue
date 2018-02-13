<template lang="pug">
    modal(v-on:closeModal="closeModal()")
        span(slot="title") {{$i18n.t('easypay.showLinkLocal')}}
        div(slot="content")
            div.middle-xs.body
                div.row.box-row
                    div.col-xs.ta-right
                        span.label {{ $i18n.t('webservice.webserviceCode') }}

                    div.col-xs.ta-left.no-margin
                        div.row.label-group.pull-left
                            div.col-xs.text.merchant-code
                                input.txt-webservice-id(:id="'txtWebserviceId-'" onfocus="this.select();" v-bind:value="entity" readonly="readonly")
                            div.icon.copy(@click="clipboardMessage(entity)" v-clipboard="entity" v-bind:data-clipboard-text="entity")



</template>


<script>
    import modal from '../../partials/modal.vue';
    import loading from '../../partials/loading.vue';

    export default {
        name: 'show-html',
        data() {
            return {
                preLink: 'https://Zarinp.al/@',
            }
        },
        props: ['entity'],
        computed: {
            user() {
                return this.$store.state.auth.user;
            }
        },
        methods: {
            closeModal() {
                this.$emit('closeModal');
            },
        },
        components: {
            modal,
            loading
        }
    };
</script>