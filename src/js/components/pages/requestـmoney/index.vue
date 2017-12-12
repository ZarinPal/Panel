<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('common.dangiDongi') }}
                p.page-description {{ $i18n.t('common.dangiDongiDescription') }}

            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                router-link.btn.default.pull-left(tag="button" v-bind:to="{ name: 'home.index'} ") {{ $i18n.t('common.returnToDashboard') }}

        div.ta-center(v-if="isRequest")
            loading

        div.request-money-index(v-bind:class="{'inactive-index': isRequest}")
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
                            <!--span.request-button.zarin-friends دوستان زرین‌پالی-->
                            span.request-button(@click="visibleNewRequestMoney = true") دنگی دُنگی جدید


                div.blur-container
                    img.user-profile-background(:src="user.avatar")


            div.col-lg-12.col-md-12.col-sm-12.col-xs-12.nav-menu
                ul.no-margin
                    li(:class="{'active': whichTab == 'requests'}" @click="changeTab('requests')") درخواست‌ها
                    li(:class="{'active': whichTab == 'debt'}" @click="changeTab('debt')") بدهی


            <!--Requests and debts-->
            div.nav-request-money
                div.nav-requests(v-if="whichTab == 'requests' && demands.data.length")
                    singleDemand.hand(v-for="demand in demands.data" v-bind:key="demand.entity_id" v-bind:demand="demand")

                div.row(v-if="!demands.status && !demands.data.length && whichTab == 'requests'")
                    div.col-xs.ta-center
                        span.txt-nothing-to-show  {{ $i18n.t('common.nothingToShow') }}

                div.ta-center(v-if="whichTab == 'requests' && demands.status")
                    loading

                div.nav-debts(v-if="whichTab == 'debt' && debts.data.length")
                    singleDebt.hand(v-for="debt in debts.data" v-bind:key="debt.entity_id" v-bind:debt="debt" v-on:changeRequestMode="changeRequestMode")

                div.row(v-if="!debts.status && !debts.data.length && whichTab == 'debt'")
                    div.col-xs.ta-center
                        span.txt-nothing-to-show  {{ $i18n.t('common.nothingToShow') }}

                div.ta-center(v-if="whichTab == 'debt' && debts.status")
                    loading

        <!--New request money modal-->
        newRequestMoney(v-if="visibleNewRequestMoney" v-on:closeModal="closeModal()" v-on:requestSuccessMessage="requestSuccessMessage()" v-on:getDemand="getDemand()")

        <!--Confirmation of request success-->
        confirm(v-if="visibleRequestSuccess" v-on:closeModal="closeModal")
            span(slot="title") {{$i18n.t('requestMoney.newRequestMoney')}}
            div.ta-right(slot="message")
                div {{$i18n.t('requestMoney.requestSuccessMessage')}}

            span(slot="messageDanger") {{$i18n.t('requestMoney.ok')}}

</template>

<script>
    import singleDemand from './partials/single_demand.vue';
    import singleDebt from './partials/single_debt.vue';
    import loading from '../../pages/partials/loading.vue';
    import newRequestMoney from './partials/new_request_money.vue';
    import confirm from '../partials/confirm.vue';

    export default {
        name: 'request-money-index',
        data() {
            return {
                whichTab: 'requests',
                visibleNewRequestMoney: false,
                isRequest: false,
                visibleRequestSuccess: false,
            }
        },
        computed: {
            user(){
                return this.$store.state.auth.user;
            },
            demands(){
                if (this.$store.state.paginator.paginator.DemandList) {
                    return {
                        data: this.$store.state.paginator.paginator.DemandList.data,
                        update: this.$store.state.paginator.update,
                        status: this.$store.state.paginator.paginator.DemandList.isLoading,
                    }
                } else {
                    return {
                        data: '',
                        update: this.$store.state.paginator.update,
                        status: true,
                    }
                }
            },
            debts() {
                if (this.$store.state.paginator.paginator.DebtList) {
                    return {
                        data: this.$store.state.paginator.paginator.DebtList.data,
                        update: this.$store.state.paginator.update,
                        status: this.$store.state.paginator.paginator.DebtList.isLoading,
                    }
                } else {
                    return {
                        data: '',
                        status: true,
                        update: this.$store.state.paginator.update,
                    };
                }

            },
        },
        created() {
            /*** Show debt list on click notifications ***/
            if (this.$route.params.type === 'debt') {
                this.whichTab = 'debt';
                this.getDebt();
            }

            //check is request money paid or not
            this.checkRequestPay();

            if (this.whichTab === 'requests') {
                this.getDemand();
            }

            /*** Load more on scroll ***/
            this.loadMore();
        },
        methods: {
            changeTab(value) {
                this.whichTab = value;
                if (value === 'requests') {
                    if (!this.demands.data) {
                        this.getDemand();
                    }
                } else if (value === 'debt') {
                    if (!('DebtList' in this.$store.state.paginator.paginator)) {
                        this.getDebt();
                    }
                }
            },
            getDemand() {
                let vm = this;
                vm.$store.dispatch(
                    'paginator/make',
                    {
                        vm,
                        resource: vm.$store.state.http.requests['requestMoney.getDemand'],
                        requestName: 'DemandList'
                    },
                );
            },
            getDebt() {
                let vm = this;
                vm.$store.dispatch(
                    'paginator/make',
                    {
                        vm,
                        resource: vm.$store.state.http.requests['requestMoney.getDebt'],
                        requestName: 'DebtList'
                    }
                );
            },
            loadMore() {
                let vm = this;
                window.onscroll = function (ev) {
                    if (vm.whichTab === 'requests') {
                        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight
                            && !vm.demands.status) {
                            vm.$store.dispatch(
                                'paginator/next',
                                {
                                    requestName: 'DemandList'
                                }
                            );
                        }
                    } else {
                        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight
                            && !vm.debts.status) {
                            vm.$store.dispatch(
                                'paginator/next',
                                {
                                    requestName: 'DebtList'
                                }
                            );
                        }
                    }
                };
            },
            closeModal(){
                this.visibleNewRequestMoney = false;
                this.visibleRequestSuccess = false;
                store.commit('clearValidationErrors');
            },
            changeRequestMode() {
                this.isRequest = !this.isRequest;
            },
            requestSuccessMessage() {
                this.visibleRequestSuccess = true;
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
            checkRequestPay() {
                let status = this.getParameterByName('Status');
                let authority = parseInt(this.getParameterByName('Authority'));
                if (status || authority) {
                    if (status === 'OK') {
                        store.commit('flashMessage', {
                            text: 'request money paid',
                            type: 'success',
                            important: true
                        });
                        this.$router.push({
                            name: 'transaction.index',
                            params: {id: '1', type: 'purse', transactionId: authority}
                        });
                    } else {
                        this.message = 'request money not paid';
                        store.commit('flashMessage', {
                            text: this.message,
                            type: 'danger',
                            important: true
                        });
                        this.$router.push({name: 'requestMoney.index'});
                    }
                }
            }
        },
        components: {
            singleDemand,
            singleDebt,
            loading,
            newRequestMoney,
            confirm
        },
    }
</script>