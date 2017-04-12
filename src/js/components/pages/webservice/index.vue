<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $t('common.webservices') }}
                p.page-description {{ $t('webservice.webserviceDescription') }}

            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                router-link.btn.btn-success(tag="span" v-bind:to="{ name: 'webservice.create'}")
                    span.icon-add-circle
                    span.text {{ $t('common.createWebservice') }}

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
