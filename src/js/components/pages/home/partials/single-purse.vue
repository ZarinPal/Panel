<template lang="pug">
    div.col-xs-12.col-sm-12.col-md-6.col-lg-4.section
        div.box.single-purse
            div.top-xs.header
                div.row
                    div.col-xs.right-box
                        p(v-if="this.$store.state.app.singlePurseMoreTrigger != purse.purse")
                            span.wallet-color(v-bind:class="'color-' + purse.purse")

                            span(v-if="purse.purse == 1")
                                span.header-title {{ purse.name }}

                            span(v-else-if="purse.purse == 99")
                                span.header-title {{ purse.name }}

                            span(v-else)
                                span.header-title.hand(v-if="!isEditingPurseName" @click="toggleEditPurse($event)") {{ purse.name }}

                            span.nav-edit-wallet(v-if="isEditingPurseName")
                                form(autocomplete="on" onsubmit="event.preventDefault();")
                                    input.txt-wallet-name(:class="{'input-danger': validationErrors.name}" :id="'txtPurseName-' + purse.purse" onfocus="this.select();" v-bind:value="purse.name" v-model="newPurseName")

                                    button.save(@click="send()") {{ $i18n.t('common.save') }}
                                    span.cancel(@click="toggleEditPurse()") {{ $i18n.t('common.cancel') }}

                            div.ta-right(v-if="validationErrors.name")
                                span.text-danger {{ $i18n.t(validationErrors.name) }}



                    div.left-box
                        <!--span.icon-more.circle-hover(@click="changeMoreTriggerOn()" id="btnMoreIcon")-->
                        transition( name="bounce"
                                    enter-active-class="drop-down-show"
                                    leave-active-class="drop-down-hide")
                            span.drop-down(v-click-outside="closeDropDownFromOutside" v-if="this.$store.state.app.singlePurseMoreTrigger == purse.purse")
                                span.close-drop-down.drop-down-item(v-ripple="" @click="changeMoreTriggerOff()")
                                span.drop-down-item.add-fund(v-ripple="" @click="visibleAddFund = true") {{ $i18n.t('purse.addFund') }}
                                span.drop-down-item.ptop(v-ripple="" @click="visiblePtop = true") {{ $i18n.t('purse.moneyTransfer') }}
                                span.drop-down-item.withdraw(v-ripple="" @click="visibleWithdraw = true") {{ $i18n.t('transaction.withdraw') }}
                                <!--router-link.drop-down-item.report(v-ripple="" v-bind:to="{ name: 'report.index', params: { id:purse.purse, type:'purse'}}") {{ $i18n.t('report.title') }}-->


            div.middle-xs.body.single-purse-body.ta-center
                router-link(tag="li" v-bind:to="{ name: 'transaction.index', params: {type: 'purse', id: purse.purse} }")
                    div.nav-balance
                        div.txt-balance {{ $i18n.t('common.balance') }}

                        div.balance-amount(v-if="purse.balance") {{balance.balance | numberFormat | persianNumbers }}
                        div.balance-amount(v-else) -
                        div.nav-show-chart
                            <!--span.chart-icon-->
                            <!--span {{ $i18n.t('common.showChart')}}-->

            router-link.bottom-xs.footer.single-purse-footer(tag="div" v-bind:to="{ name: 'transaction.index', params: {type: 'purse', id: purse.purse} }")
                div.row
                    div.col-lg-4.col-md-4.col-sm-4.col-xs-4.segment
                        span.txt-daily-balance.iransans-light ورودی
                        span.amount(v-if="purse.balance") {{balance.today_income  | numberFormat | persianNumbers }}
                        span.amount(v-else) -

                    div.col-lg-4.col-md-4.col-sm-4.col-xs-4.segment.no-right-margin
                        span.txt-daily-balance.iransans-light خروجی
                        span.amount(v-if="purse.balance") {{balance.today_outcome  | numberFormat | persianNumbers }}
                        span.amount(v-else) -


                    div.col-lg-4.col-md-4.col-sm-4.col-xs-4.segment.no-right-margin
                        span.txt-daily-balance.iransans-light درحال خروج
                        span.amount(v-if="purse.balance") {{balance.total_to_exit  | numberFormat | persianNumbers }}
                        span.amount(v-else) -

        addFund(v-if="visibleAddFund" v-on:closeModal="closeModal()" v-bind:purse="purse")
        pTop(v-if="visiblePtop" v-on:closeModal="closeModal()" v-bind:purse="purse")
        withdraw(v-if="visibleWithdraw" v-on:closeModal="closeModal()" v-bind:purse="purse")

</template>

<script>
    import addFund from '../partials/add-fund.vue';
    import pTop from '../partials/ptop.vue';
    import withdraw from '../partials/withdraw.vue';
    import validation from '../../../../lib/validation';

    export default {
        name: 'pages-home-partials-singlePurse',
        data() {
            return {
                isLoaded: false,
                isEditingPurseName: false,
                newPurseName: this.purse.name,
                visibleAddFund: false,
                visiblePtop: false,
                visibleWithdraw: false,
            }
        },
        props: ['purse', 'update', 'balance'],
        computed: {
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
        },
        created(){
            store.commit('clearValidationErrors');
        },
        methods: {
            changeMoreTriggerOn() {
                this.$store.state.app.singlePurseMoreTrigger = this.purse.purse;
                this.isEditingPurseName = false;
            },
            changeMoreTriggerOff() {
                this.$store.state.app.singlePurseMoreTrigger = null;
            },
            closeModal(){
                this.visibleAddFund = false;
                this.visiblePtop = false;
                this.visibleWithdraw = false;
                store.commit('clearValidationErrors');
            },
            changePurseName(){
                let vm = this;
                let purseIndex = _.findIndex(this.$store.state.auth.user.purses, function(purse) {
                    return purse.purse === vm.purse.purse
                });
                this.$store.state.auth.user.purses[purseIndex].name
                    = this.purse.name
                    = this.newPurseName;
            },
            toggleEditPurse(){
                this.isEditingPurseName = !this.isEditingPurseName;
                this.$store.state.app.singlePurseMoreTrigger = null;

                let vm = this;
                setTimeout(function () {
                    let txtPurseName = document.getElementById('txtPurseName-' + vm.purse.purse);
                    if (txtPurseName) {
                        txtPurseName.select();
                    }
                }, 50);
                store.commit('clearValidationErrors');
            },
            send() {
                let sendContent = {
                    name: this.newPurseName
                };

                this.$store.state.http.requests['purse.postEdit']
                    .update({'purse_number': this.purse.purse}, sendContent)
                    .then(() => {
                        this.changePurseName();
                        this.toggleEditPurse();
                    },
                    (response) => {
                        store.commit('setValidationErrors',response.data.validation_errors);
                        store.commit('flashMessage', {
                            text: response.data.meta.error_message,
                            type: 'danger'
                        });
                        this.toggleEditPurse();
                    }
                );
            },
            closeDropDownFromOutside() {
                let vm = this;
                document.addEventListener('click', function(e) {
                    if(e.target.id !== 'btnMoreIcon') {
                        vm.$store.state.app.singlePurseMoreTrigger = null;
                    }
                }, false);
            }
        },
        components:{
            addFund,
            pTop,
            withdraw,
        }
    }
</script>
