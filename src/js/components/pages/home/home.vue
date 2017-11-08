<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                p.page-title {{ $i18n.t('common.purses') }}
                p.page-description {{ $i18n.t('common.pursesDescription') }}

            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                <!--button.btn.success(v-if="purses.data.length < purseLimit" @click="visibleCreatePurse = true")-->
                <!--span.icon-add-circle-->
                <!--span.text {{ $i18n.t('common.createPurse') }}-->

        div.nav-top-buttons.row
            div.col-lg-9.col-md-9.col-sm-12.col-xs-12.xs-ta-center.sm-ta-center
                button.btn-gradient-radius(v-if="userHasAccess([2, 3]) >= 0" v-ripple="" @click="visibleWithdraw = !visibleWithdraw")
                    i.btn-icon.withdraw
                    span.btn-label تسویه حساب

                router-link.btn-gradient-radius(v-if="userHasAccess([1, 2, 3]) >= 0" v-ripple="" tag="button" v-bind:to="{ name: 'requestMoney.index'}")
                    i.btn-icon.request-money
                    span.btn-label {{ $i18n.t('common.dangiDongi') }}

                button.btn-gradient-radius(v-if="userHasAccess([1, 2, 3]) >= 0" v-ripple="" @click="visibleAddFund = !visibleAddFund")
                    i.btn-icon.add-fund
                    span.btn-label {{ $i18n.t('purse.addFund') }}

                button.btn-gradient-radius(v-if="userHasAccess([2, 3]) >= 0" v-ripple="" @click="visiblePtop = !visiblePtop")
                    i.btn-icon.ptop
                    span.btn-label {{ $i18n.t('purse.moneyTransfer') }}

                button.btn-gradient-radius.zarin-card(v-if="!haveZarinCard" v-ripple="" @click="visibleRequestZarinCard = !visibleRequestZarinCard")
                    i.btn-icon
                    span.btn-label {{ $i18n.t('card.requestZarinCardTitle') }}


            div.col-lg-3.col-md-3.col-sm-12.col-xs-12.ta-left.xs-ta-center.sm-ta-center
                button.btn.success(v-if="purses.data.length < purseLimit" @click="visibleCreatePurse = true")
                    span.icon-add-circle
                    span.text {{ $i18n.t('common.createPurse') }}

        div.row
            singlePurse(v-for="purse in purses.data" v-bind:balance="purse.balance" v-bind:key="purse.purse" v-bind:update="purses.update" v-bind:purse="purse" v-bind:showMore="showMore")

        createPurse(v-if="visibleCreatePurse" v-on:closeModal="closeModal()")
        addFund(v-if="visibleAddFund" v-on:closeModal="closeModal()")
        pTop(v-if="visiblePtop" v-on:closeModal="closeModal()")
        withdraw(v-if="visibleWithdraw" v-on:closeModal="closeModal()")
        zarin-card(v-if="visibleRequestZarinCard" v-on:closeModal="closeModal()")

        <!--Show modal to say user dont have access to this page-->
        access-level(v-if="visibleUserAccessModal" v-on:closeModal="closeModal()")
</template>

<script>
    import singlePurse from './partials/single-purse.vue';
    import createPurse from './partials/create.vue';
    import modal from '../partials/modal.vue';
    import addFund from './partials/add-fund.vue';
    import pTop from './partials/ptop.vue';
    import withdraw from './partials/withdraw.vue';
    import accessLevel from '../partials/access_level_modal';
    import zarinCard from './zarin_card/request';

    export default {
        name: 'pages-home',
        data(){
            return {
                visibleCreatePurse: false,
                visibleShowMore: false,
                visibleAddFund: false,
                visiblePtop: false,
                visibleWithdraw: false,
                visibleUserAccessModal: false,
                visibleRequestZarinCard: false,

                message: [],
                purseLimit: 10,
            }
        },
        props: ['more', 'showMore'],
        watch: {
            '$route' () {
                this.showAccessLevelModal();
            }
        },
        computed: {
            purses(){
                if (this.$store.state.auth.user.purses.length == 0) {
                    return {
                        data: [],
                        update: 0
                    }
                }

                return {
                    data: this.$store.state.auth.user.purses,
                    update: this.$store.state.auth.updatePurseListener
                }
            },
            haveZarinCard() {
                let zarinCards = {};
                zarinCards =  _.find(this.$store.state.auth.user.cards, function(card) {
                    return card.issuer.slug === 'ZarinCard';
                });
                return typeof zarinCards !== 'undefined';
            }
        },
        created(){
            this.showAccessLevelModal();

            //Check if add fund authority is exists, show message
            this.checkAddFund();
            if (this.$route.params.createPurse === 'Yes') {
                this.visibleCreatePurse = true;
            }
        },
        methods: {
            userHasAccess(validLevels) {
                return _.indexOf(validLevels, this.$store.state.auth.user.level);
            },
            closeModal(){
                this.visibleCreatePurse = false;
                this.visibleAddFund = false;
                this.visiblePtop = false;
                this.visibleWithdraw = false;
                this.visibleRequestZarinCard = false;

                if (this.$route.query.error === 'suspend') {
                    this.visibleUserAccessModal = false;
                }

                store.commit('clearValidationErrors');
            },
            showAccessLevelModal() {
                if (this.$route.query.error === 'suspend') {
                    this.visibleUserAccessModal = true;
                }
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
                if (status || authority) {
                    if (status === 'OK') {
                        this.message = 'add fund success';

                        store.commit('flashMessage', {
                            text: this.message,
                            type: 'success',
                            important: true
                        });
                        this.$router.push({
                            name: 'transaction.index',
                            params: {id: '1', type: 'purse', transactionId: authority}
                        });
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
            },
        },
        components: {
            singlePurse,
            createPurse,
            addFund,
            pTop,
            withdraw,
            modal,
            'access-level': accessLevel,
            'zarin-card': zarinCard
        }
    }
</script>
