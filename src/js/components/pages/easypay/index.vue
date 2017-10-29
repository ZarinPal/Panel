<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                p.page-title {{ $i18n.t('common.easypay') }}
                p.page-description {{ $i18n.t('common.easypayDescription') }}

            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                router-link.btn.success(tag="button" v-bind:to="{ name: 'easypay.create'}")
                    span.icon-add-circle
                    span.text {{ $i18n.t('easypay.createEasypay') }}

        div.row
            singleEasypay(v-for="easypay in easypays.data" v-bind:key="easypay.public_id" v-bind:easypay="easypay")

        div.ta-center(v-if="easypays.status")
            loading

        div.ta-center(v-if="!this.$store.state.paginator.paginator.EasypayList.resource.resource && easypays.data.length")
            span.txt-nothing-to-show {{ $i18n.t('common.thereIsNoOtherItemToDisplay') }}


        div.row(v-if="!easypays.status && !easypays.data.length")
            div.col-xs.ta-center
                span.txt-nothing-to-show  {{ $i18n.t('common.nothingToShow') }}


</template>

<script>
    import singleEasypay from './partials/single-easypay.vue';
    import loading from '../../pages/partials/loading.vue';

    export default {
        name: 'easypay-index',
        computed: {
            user(){
                return this.$store.state.auth.user;
            },
            easypays(){
                return {
                    data: this.$store.state.paginator.paginator.EasypayList.data,
                    status: this.$store.state.paginator.paginator.EasypayList.isLoading,
                    update: this.$store.state.paginator.update,
                };
            }
        },
        created() {
            this.getEasypays();

            let vm = this;
            window.onscroll = function () {
                if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight
                    && !vm.$store.state.paginator.paginator.EasypayList.isLoading) {
                    vm.$store.dispatch(
                        'paginator/next',
                        {
                            requestName: "EasypayList"
                        }
                    );
                }
            };
        },
        methods: {
            getEasypays() {
                let vm = this;
                this.$store.dispatch(
                    'paginator/make',
                    {
                        vm,
                        resource: vm.$store.state.http.requests['easypay.getList'],
                        requestName: "EasypayList"
                    }
                );
            }
        },
        components: {
            singleEasypay,
            loading
        }
    }
</script>
