<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('common.dangiDongi') }}
                p.page-description {{ $i18n.t('common.dangiDongiDescription') }}

            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                button.btn.success(@click="visibleCreatePurse = true")
                    span.icon-add-circle
                    span.text {{ $i18n.t('common.createPurse') }}

        div.request-money-index

            <!--Blur background-->
            div.nav-blur-container
                div.row.blur-content.no-margin
                    div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                        div.nav-user-info
                            img.user-avatar(:src="user.avatar")
                            span.user-name {{user.name}}
                            br
                            span.user-zp-id zp.{{user.public_id | persianNumbers}}
                    div.col-lg-6.col-md-6.col-sm-12.col-xs-12.nav-left
                        div.nav-buttons
                            span.request-button.zarin-friends دوستان زرین پالی
                            span.request-button(@click="visibleNewRequestMoney = true") دنگی دونگی جدید


                img.user-profile-background(:src="user.avatar")


            div.col-lg-12.col-md-12.col-sm-12.col-xs-12.nav-menu
                ul.no-margin
                    li(:class="{'active': whichTab == 'requests'}" @click="changeTab('requests')") درخواست ها
                    li(:class="{'active': whichTab == 'debt'}" @click="changeTab('debt')") بدهی


            <!--Requests and debts-->
            div.nav-request-money
                div.nav-requests(v-if="whichTab == 'requests'")
                    singleDemand(v-for="demand in demands" v-bind:key="demand.entity_id" v-bind:demand="demand")

                    div.row(v-if="!this.$store.state.paginator.isLoading && !demands.length")
                        div.col-xs.ta-center
                            span.txt-nothing-to-show  {{ $i18n.t('common.nothingToShow') }}

                    div.ta-center(v-if="this.$store.state.paginator.isLoading")
                        loading

                div.nav-debts(v-if="whichTab == 'debt'")
                    singleDebt(v-for="debt in debts" v-bind:key="debt.entity_id" v-bind:debt="debt")

                    div.row(v-if="!this.$store.state.paginator.isLoading && !debts.length")
                        div.col-xs.ta-center
                            span.txt-nothing-to-show  {{ $i18n.t('common.nothingToShow') }}

                    div.ta-center(v-if="this.$store.state.paginator.isLoading")
                        loading



        <!--New request money modal-->
        newRequestMoney(v-if="visibleNewRequestMoney" v-on:closeModal="closeModal()")


</template>

<script>

    import singleDemand from './partials/single_demand.vue';
    import singleDebt from './partials/single_debt.vue';
    import loading from '../../pages/partials/loading.vue';
    import newRequestMoney from './partials/new_request_money.vue';



    export default {
        name: 'request-money-index',
        data() {
          return {
              whichTab: 'requests',
              visibleNewRequestMoney: false,
          }
        },
        computed: {
            user(){
                return this.$store.state.auth.user;
            },
            demands(){
                return this.$store.state.paginator.data;
            },
            debts() {
                return this.$store.state.paginator.data;
            }
        },
        created(){
//            if(this.whichTab === 'requests') {
//                this.getDemand();
//                this.loadMoreDemand();
//
//            } else if(this.whichTab === 'debt') {
//                this.getDebt();
//                this.loadMoreDebt();
//            }
        },
        methods: {
            changeTab(value) {
                this.whichTab = value
                if(this.whichTab === 'requests') {
                    this.getDemand();

                } else if(this.whichTab === 'debt') {
                    this.getDebt();
                }
            },
            getDemand() {
                let vm = this;
                vm.$store.dispatch(
                    'paginator/make',
                    {
                        vm,
                        resource: vm.$store.state.http.requests['requestMoney.getDemand']
                    }
                );
            },
            loadMoreDemand(){
                window.onscroll = function(ev) {
                    let vm = this;

                    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight
                        && !vm.$store.state.paginator.isLoading) {
                        vm.$store.dispatch(
                            'paginator/next'
                        );
                    }
                };
            },
            getDebt() {
                let vm = this;
                vm.$store.dispatch(
                    'paginator/make',
                    {
                        vm,
                        resource: vm.$store.state.http.requests['requestMoney.getDebt']
                    }
                );
            },
            loadMoreDebt() {

            },
            closeModal(){
                this.visibleNewRequestMoney = false;
                store.commit('clearValidationErrors');
            }
        },
        components: {
            singleDemand,
            singleDebt,
            loading,
            newRequestMoney
        },
    }
</script>
