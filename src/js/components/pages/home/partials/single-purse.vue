<template lang="pug">
    div.col-xs-12.col-sm-12.col-md-6.col-lg-4.section
        div.box
            div.top-xs.header
                div.row
                    div.col-xs.right-box
                        p
                            span.wallet-color(v-bind:class="'color-' + purse.purse")

                            span(v-if="purse.purse == 1")
                                span.header-title {{ purse.name }}

                            span(v-else-if="purse.purse == 99")
                                span.header-title {{ purse.name }}

                            span(v-else)
                                span.header-title(v-if="!isEditingPurseName" @click="toggleEditPurse()") {{ purse.name }}

                            span.nav-edit-wallet(v-show="isEditingPurseName")
                                input.txt-wallet-name(v-bind:value="purse.name" v-model="newPurseName")
                                span.save(@click="send()") {{ $i18n.t('common.save') }}
                                span.cancel(@click="toggleEditPurse()") {{ $i18n.t('common.cancel') }}


                    div.left-box
                        span.icon-more.circle-hover(@click="changeMoreTriggerOn()")
                        transition( name="bounce"
                                    enter-active-class="drop-down-show"
                                    leave-active-class="drop-down-hide")
                            span.drop-down(v-if="this.$store.state.app.singlePurseMoreTrigger == purse.purse")
                                span.close-drop-down.drop-down-item(@click="changeMoreTriggerOff()")
                                span.drop-down-item.add-fund(@click="visibleAddFund = true") {{ $i18n.t('purse.addFund') }}
                                router-link.drop-down-item.transaction(v-bind:to="{ name: 'transaction.index', params: { id:purse.purse, type:'purse', page:1 }}") {{ $i18n.t('transaction.title') }}
                                span.drop-down-item.add-fund(@click="visiblePtop = true") {{ $i18n.t('purse.moneyTransfer') }}


            div.middle-xs.body
                router-link(tag="li" v-bind:to="{ name: 'transaction.index', params: {type: 'purse', id: purse.purse} }")
                    div.nav-balance
                        div.txt-balance {{ $i18n.t('common.balance') }}

                        div.balance-amount {{purse.balance.balance | numberFormat | persianNumbers }}
                        div.nav-show-chart
                            <!--span.chart-icon-->
                            <!--span {{ $i18n.t('common.showChart')}}-->

            div.bottom-xs.footer
                div.row
                    div.col-lg-4.col-md-4.col-sm-4.col-xs-4.segment
                        span.icon-input-trans
                        span.amount {{purse.balance.today_income  | numberFormat | persianNumbers }}

                    div.col-lg-4.col-md-4.col-sm-4.col-xs-4.segment
                        span.icon-output-trans
                        span.amount  {{purse.balance.today_outcome  | numberFormat | persianNumbers }}

                    div.col-lg-4.col-md-4.col-sm-4.col-xs-4.segment
                        span.icon-moving-trans
                        span.amount  {{purse.balance.total_to_exit  | numberFormat | persianNumbers }}


        addFund(v-if="visibleAddFund" v-on:closeModal="closeModal()" v-bind:purse="purse")
        pTop(v-if="visiblePtop" v-on:closeModal="closeModal()" v-bind:purse="purse")

</template>

<script>
    import addFund from '../partials/add-fund.vue';
    import pTop from '../partials/ptop.vue';

    export default {
        name: 'pages-home-partials-singlePurse',
        data(){
            return {
                isLoaded: false,
                showOptions: false,
                isEditingPurseName: false,
                newPurseName: this.purse.name,
                visibleAddFund: false,
                visiblePtop: false,
            }
        },
        props: ['purse'],
        methods: {
            changeMoreTriggerOn() {
                this.$store.state.app.singlePurseMoreTrigger = this.purse.purse
            },
            changeMoreTriggerOff() {
                this.$store.state.app.singlePurseMoreTrigger = ''
            },
            closeModal(){
                this.visibleAddFund = false;
                this.visiblePtop = false;
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
            },
            send(){
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
                        store.commit('flashMessage', {
                            text: response.data.meta.error_message,
                            type: 'danger'
                        });
                        this.toggleEditPurse();
                    }
                );
            },
        },
        components:{
            addFund,
            pTop
        }
    }
</script>
