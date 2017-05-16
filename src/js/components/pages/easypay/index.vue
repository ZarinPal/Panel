<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('common.easypay') }}
                p.page-description {{ $i18n.t('common.easypayDescription') }}

            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                router-link.btn.success(tag="button" v-bind:to="{ name: 'easypay.create'}")
                    span.icon-add-circle
                    span.text {{ $i18n.t('easypay.createEasypay') }}


        div.row
            singleEasypay(v-for="easypay in easypays" v-bind:key="easypay.public_id" v-bind:easypay="easypay")

        div.row(v-if="!easypays.length")
            div.col-xs.ta-center
                span.txt-nothing-to-show  {{ $i18n.t('common.nothingToShow') }}

</template>

<script>
    import singleEasypay from './partials/single-easypay.vue';
    export default {
        name: 'easypay-index',
        created(){
            this.$store.dispatch(
                'paginator/make',
                this.$store.state.http.requests['easypay.getList'].get()
            );

        },
        computed:{
            user(){
                return this.$store.state.auth.user;
            },
            easypays(){
                return this.$store.state.auth.user.easypays;
            }
        },
        components: {
            singleEasypay
        }
    }
</script>
