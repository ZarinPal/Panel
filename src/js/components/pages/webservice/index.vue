<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('common.webservices') }}
                p.page-description {{ $i18n.t('webservice.webserviceDescription') }}

            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                router-link.btn.btn-success(tag="span" v-bind:to="{ name: 'webservice.create'}")
                    span.icon-add-circle
                    span.text {{ $i18n.t('common.createWebservice') }}

        div.row
            singleWebservice(v-for="webservice in user.webservices" v-bind:webservice="webservice")

</template>

<script>
    import singleWebservice from './partials/single-webservice.vue';

    export default {
        name: 'webservice-index',
        data() {
            return{

            }
        },
        computed:{
            user(){
                return this.$store.state.auth.user;
            }
        },
        methods: {

        },
        components: {
            singleWebservice,
        }
    }
</script>
