<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('common.purses') }}
                p.page-description {{ $i18n.t('common.pursesDescription') }}

            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                span.btn.btn-success(@click="visibleCreatePurse = true")
                    span.icon-add-circle
                    span.text {{ $i18n.t('common.createPurse') }}

        div.row
            singlePurse(v-for="purse in user.purses" v-bind:purse="purse")


        createPurse(v-if="visibleCreatePurse" v-on:closeModal="closeModal()")

</template>

<script>
    import singlePurse from './partials/single-purse.vue';
    import createPurse from './partials/create.vue';

    export default {
        name:'pages-home',
        data(){
            return{
                visibleCreatePurse: false,
            }
        },
        computed:{
            user(){
                return this.$store.state.auth.user;
            }
        },
        methods: {
            closeModal(){
                this.visibleCreatePurse = false;
            }
        },
        components:{
            singlePurse,
            createPurse
        }
    }
</script>
