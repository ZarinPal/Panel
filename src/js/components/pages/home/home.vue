<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('common.purses') }}
                p.page-description {{ $i18n.t('common.pursesDescription') }}

            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                button.btn.success(v-if="user.purses.length < purseLimit" @click="visibleCreatePurse = true")
                    span.icon-add-circle
                    span.text {{ $i18n.t('common.createPurse') }}

        div.row
            singlePurse(v-for="purse in user.purses" v-bind:key="purse.purse" v-bind:purse="purse" v-bind:showMore="showMore")

        createPurse(v-if="visibleCreatePurse" v-on:closeModal="closeModal()")

</template>

<script>
    import singlePurse from './partials/single-purse.vue';
    import createPurse from './partials/create.vue';
    import modal from '../partials/modal.vue';

    export default {
        name:'pages-home',
        data(){
            return{
                visibleCreatePurse: false,
                visibleShowMore: false,
                message: [],
                purseLimit: 10,
            }
        },
        props: ['more', 'showMore'],
        computed:{
            user(){
                return this.$store.state.auth.user;
            }
        },
        created(){
            this.checkAddFund();
            if(this.$route.params.createPurse === 'Yes') {
                this.visibleCreatePurse = true;
            }

        },
        methods: {
            closeModal(){
                this.visibleCreatePurse = false;
                store.commit('clearValidationErrors');
            },
            getParameterByName(name, url) {
                if (!url) url = window.location.href;
                name = name.replace(/[\[\]]/g, "\\$&");
                let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            },
            checkAddFund() {
                let status = this.getParameterByName('Status');
                let authority = parseInt(this.getParameterByName('Authority'));
                if(status || authority) {
                    if(status === 'OK') {
                        this.message = 'add fund success';

                        store.commit('flashMessage', {
                            text: this.message,
                            type: 'success',
                            important: true
                        });
                        this.$router.push({name: 'transaction.index', params: {id: '1', type: 'purse', transactionId: authority}});
                    } else {
                        this.message = 'add fund failed';
                        store.commit('flashMessage', {
                            text: this.message,
                            type: 'danger',
                            important: true
                        });
                        this.$router.push({name: 'home.index'});
                    }
                }
            }
        },
        components:{
            singlePurse,
            createPurse,
            modal
        }
    }
</script>
