<template lang="pug">
    modal.new-request-money(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('requestMoney.' + pageTitle) }}
        div(slot="content")
            <!--Step 1-->
            div.nav-select-user(v-if="step == 1")
                div.row.search-box
                    span.icon-search
                    input(type="text" placeholder="جستجو ...")

                div.users
                    div.row.user-row(v-for="user in users")
                        label.row(:for="user.zp")
                            div.col-lg-2.col-md-2.col-xs-3.no-margin.ta-center
                                img.avatar(:src="user.avatar")
                            div.col-lg-8.col-md-8.col-xs-8.no-margin.ta-right
                                div.user-name {{user.name}}
                                div.user-zp {{user.zp}}
                            div.col-lg-2.col-md-2.col-xs-2.no-margin.ta-left
                                input.circle-checkbox(type="checkbox" :value="user.zp" v-model="checkUsers" :id="user.zp")
                                label.checkbox-label(:for="user.zp")
                                    span.circle-checkbox

            <!--Step 2-->
            div.nav-request-type.ta-right(v-else-if="step == 2")
                div.nav-selected-avatars
                    img.avatar(v-for="(user, index) in selectedUsers" v-if="index <= 4" :src="user.avatar")
                    span.remain-user-number(v-if="checkUsers.length > 5") {{checkUsers.length - 5 |persianNumbers}}+

                div.top-text {{ $i18n.t('requestMoney.chooseOneOfTheFollowingMethods') }}

                div.method-box(:class="{'active' : requestType == 'Auto'}")
                    label.row(for="requestTypeAuto")
                        div.col-xs
                            div.title  {{ $i18n.t('requestMoney.equalDivide') }}
                            div.description  {{ $i18n.t('requestMoney.equalDivideDescription') }}
                        div
                            input(type="radio" name="requestType" id="requestTypeAuto" value="Auto" v-model="requestType" )
                            label(for="requestTypeAuto")
                                span.circle-checkbox


                div.method-box(:class="{'active' : requestType == 'Manually'}")
                    label.row(for="requestTypeManually")
                        div.col-xs
                            div.title  {{ $i18n.t('requestMoney.enterTheAmountManually') }}
                            div.description  {{ $i18n.t('requestMoney.enterTheAmountManuallyDescription') }}
                        div
                            input(type="radio" name="requestType" id="requestTypeManually" value="Manually" v-model="requestType")
                            label(for="requestTypeManually")
                                span.circle-checkbox


            <!--Step 3 Auto Division-->
            div.auto-division(v-else-if="step == 3 && requestType == 'Auto'")
                div.selected-users-avatar
                    div.avatar-container
                        img.avatar(v-for="(user, index) in selectedUsers" v-if="index <= 4" :src="user.avatar")
                        span.remain-user-number(v-if="checkUsers.length > 5") {{checkUsers.length - 5 | persianNumbers}}+

                    div.arrow

                div.nav-request-amount
                    span.amount-text {{ $i18n.t('requestMoney.amountPerPerson') }}
                    span.sum-amount {{ autoPersonAmount | numberFormat | persianNumbers }}
                    span.amount-text {{ $i18n.t('transaction.toman') }}

                div.row
                    input.amount-input(type="text" v-model="requestAmount" placeholder="مبلغ" @keyup="calcAutoRequestAmount" autofocus)

                div.row.share-in-request-text
                    input(type="checkbox" id="shareRequestChk" v-model="shareRequestWithMe" @change="calcAutoRequestAmount")
                    label(for="shareRequestChk")
                        span
                        |{{ $i18n.t('requestMoney.iAmPartOfThisRequest') }}

            <!--Step 3 Manually Division-->
            div.nav-manually-division(v-else-if="step == 3 && requestType == 'Manually'")
                div.selected-users-avatar.manually-selected-users-avatar
                    span.icon-prev(v-if="manuallyUserCounter > 0" @click="manuallyUserCounter--" title="قبلی")

                    div.avatar-container
                        img.avatar(v-for="(user, index) in selectedUsers" :src="user.avatar" v-bind:class="{'active-image' : manuallyUserCounter === index}")

                    div.arrow

                    span.icon-next(v-if="manuallyUserCounter < selectedUsers.length -1" @click="manuallyUserCounter++" title="بعدی")

                div.row
                    div.col-xs.ta-center
                        span.user-name {{selectedUsers[manuallyUserCounter].name}}

                div.row.nav-request-amount
                    div.col-xs.ta-center
                        span.amount-text {{ $i18n.t('requestMoney.sum') }}
                        span.sum-amount {{ manuallyTotalAmount | numberFormat | persianNumbers}}
                        span.amount-text {{ $i18n.t('transaction.toman') }}

                input.amount-input(type="text" placeholder="مبلغ" v-model="selectedUsers[manuallyUserCounter].amount" @keyup="calcManuallyTotalAmount" autofocus)



            <!--Step 4 description and details-->
            div.nav-final-step(v-else-if="step == 4")
                div.selected-users-avatar
                    div.avatar-container
                        img.avatar(v-for="(user, index) in selectedUsers" v-if="index <= 4" :src="user.avatar")
                        span.remain-user-number(v-if="checkUsers.length > 5") {{checkUsers.length - 5 | persianNumbers}}+


                div.nav-description
                    div.row.description-title {{$i18n.t('requestMoney.fillDescriptionToContinue')}}
                    div.row
                        input.description-input(:class="{'input-danger': validationErrors.description}" type="text" v-model="description" placeholder="توضیحات")
                        div.ta-right(v-if="validationErrors.description")
                            span.text-danger {{ $i18n.t(validationErrors.description) }}


                    div.detail-bar.ta-right
                        span {{$i18n.t('requestMoney.details')}}

                    div.row
                        div.col-xs.ta-center
                            span.total-amount(v-if="requestType == 'Auto'") {{requestAmount | numberFormat | persianNumbers}}
                            span.total-amount(v-else) {{manuallyTotalAmount | numberFormat | persianNumbers}}
                            span.total-toman {{$i18n.t('transaction.toman')}}

                    div.line
                    div.row
                        div.col-xs.ta-right
                            span.multi-person {{ $i18n.t('requestMoney.count') }}
                        div.col-xs.ta-left
                            span.multi-person {{ selectedUsers.length + ' ' + $i18n.t('requestMoney.person') | persianNumbers}}


            div.footer
                div.row
                    div.col-xs.ta-right.no-margin
                        span.prev-link-text(v-if="step > 1" @click="prevStep") {{$i18n.t('requestMoney.prevStep')}}
                        span.user-counter.persian-num(v-if="step === 1") {{checkUsers.length + ' ' + $i18n.t('requestMoney.personSelected')}}

                    div.col-xs.no-margin
                        button.btn.success.pull-left(v-ripple="" @click="nextStep" v-if="checkUsers.length && step <= 3") {{$i18n.t('requestMoney.nextStep')}}
                        button.btn.success.pull-left(v-ripple="" @click="postRequestMoney" v-if="step == 4") {{$i18n.t('requestMoney.request')}}


</template>


<script>
    import modal from '../../partials/modal.vue';

    export default {
        name: 'pages-requestMoney-partials-new',
        data() {
            return {
                loading: false,
                step: 1, //Select user, select pay method(auto, manually)
                pageTitle: 'selectUsers',
                closeModalContent: false,
                users: {
                    0: {
                        'name': 'امین نظری',
                        'zp': 'zp.123456',
                        'avatar': '//gravatar.com/avatar/890daede1a83cb2def69216076e29400?r=g&d=mm'
                    },
                    1: {
                        'name': 'امین نظری',
                        'zp': 'zp.2345',
                        'avatar': '//gravatar.com/avatar/890daede1a83cb2def69216076e29400?r=g&d=mm'
                    },
                    2: {
                        'name': 'یاسین نظری',
                        'zp': 'zp.33666',
                        'avatar': '//gravatar.com/avatar/890daede1a83cb2def69216076e29400?r=g&d=mm'
                    },
                    3: {
                        'name': 'محمد قفاری',
                        'zp': 'zp.56573',
                        'avatar': '//gravatar.com/avatar/890daede1a83cb2def69216076e29400?r=g&d=mm'
                    },
                    4: {
                        'name': 'امین نظری',
                        'zp': 'zp.34345',
                        'avatar': '//gravatar.com/avatar/890daede1a83cb2def69216076e29400?r=g&d=mm'
                    },
                    5: {
                        'name': 'کاربر آخر',
                        'zp': 'zp.45678896',
                        'avatar': '//gravatar.com/avatar/890daede1a83cb2def69216076e29400?r=g&d=mm'
                    },
                },
                checkUsers: [],
                selectedUsers: [], //filter users by checkUsers NOTE:final object for users
                requestType: 'Auto', //Auto, Manually
                requestAmount: null, //Auto total amount
                shareRequestWithMe: false,
                autoPersonAmount: 0,
                manuallyUserCounter: 0,
                manuallyTotalAmount: 0,
                description: null,
                purse: 1,

            }
        },
        props:['card'],
        computed:{
            user(){
                return this.$store.state.auth.user;
            },
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
        },
        mounted() {
            this.closeModalContent = false
        },
        created() {
            return this.searchUser('محم');
        },
        methods: {
            closeModal() {
                this.$emit('closeModal');
            },
            nextStep() {
              this.step ++;
              this.changeTitle();
                this.getSelectedUsers();
            },
            prevStep() {
                this.step --;
                this.changeTitle();
                if(this.step === 2) {
                    this.requestAmount = null;
                    this.autoPersonAmount = 0;
                }
            },
            searchUser(content) {
                return _.some(this.users, _.unary(_.partialRight(_.includes, content)));
            },
            changeTitle() {
                if(this.step === 1) {
                    this.pageTitle = 'selectUsers';
                }else if(this.step === 2) {
                    this.pageTitle = 'requestType';
                } else if(this.step === 3) {
                    this.pageTitle = 'requestType';
                }
            },
            /*** Get selected users data ***/
            getSelectedUsers() {
                if(this.step === 2){
                    let vm = this;
                    this.selectedUsers = _.filter(this.users, function(user) {
                        return vm.checkUsers.indexOf(user.zp) !== -1;
                    });
                }
            },
            /*** Calculate total amount and dealing between users auto ***/
            calcAutoRequestAmount() {
                let usersCount = this.selectedUsers.length;
                if(this.shareRequestWithMe) {
                    this.autoPersonAmount = (this.requestAmount / (usersCount + 1)).toFixed(0);
                } else {
                    this.autoPersonAmount = (this.requestAmount / usersCount).toFixed(0);
                }
            },
            /*** Sum every user manually amount ***/
            calcManuallyTotalAmount() {
                let vm = this;
                this.manuallyTotalAmount = 0;
                this.selectedUsers.forEach(function (user) {
                    if(user.amount) {
                        vm.manuallyTotalAmount = parseInt(vm.manuallyTotalAmount) + parseInt(user.amount);
                    }
                });
            },
            /*** Send request money***/
            postRequestMoney(){
                this.isLoading = true;
                let requestMoneyData = [];


                let vm = this;
                this.selectedUsers.forEach(function (user) {
                    delete user.name;
                    delete user.avatar;

                    if(vm.requestType == 'Auto') {
                        let userIndex = _.findIndex(vm.selectedUsers, function(userData) {
                            return userData.zp === user.zp;
                        });
                        vm.selectedUsers[userIndex].amount = vm.autoPersonAmount;
                    }
                });

                requestMoneyData= {
                    'debtor': this.selectedUsers,
                    'purse_number': this.purse,
                    'description': this.description
                };

                console.log(requestMoneyData);

                return;

//                this.$store.state.http.requests['requestMoney.postRequestMoney'].save(requestMoneyData).then(
//                    ()=> {
//                        this.isLoading = false;
//                        this.$router.push({name: 'requestMoney.index'})
//                    },
//                    (response) => {
//                        this.isLoading = false;
//                        store.commit('setValidationErrors',response.data.validation_errors);
//                        store.commit('flashMessage',{
//                            text: response.data.meta.error_message,
//                            important: false,
//                            type: 'danger'
//                        });
//                    }
//                );

            }
        },
        components: {
            modal
        }
    }
</script>