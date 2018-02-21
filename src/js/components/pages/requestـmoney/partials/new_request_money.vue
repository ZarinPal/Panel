<template lang="pug">
    modal.new-request-money(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('requestMoney.' + pageTitle) }}
        div(slot="content")
            <!--Step 1-->
            div.nav-select-user(v-if="step == 1")
                div.row.search-box
                    span.icon-search
                    input(type="text" v-model="searchString" placeholder="جستجو ..." )

                div.users(v-if="!phoneBook.status")
                    div.row.user-row(v-for="user in phoneBook.data")
                        label.row(:for="user.public_id")
                            div.col-lg-2.col-md-2.col-xs-3.no-margin.ta-center
                                img.avatar(:src="user.avatar")
                            div.col-lg-8.col-md-8.col-xs-8.no-margin.ta-right
                                div.user-name {{user.name}}
                                div.user-zp {{'ZP.'+ user.public_id}}
                            div.col-lg-2.col-md-2.col-xs-2.no-margin.ta-left
                                input.circle-checkbox(type="checkbox" :value="user.public_id" v-model="checkUsers" :id="user.public_id")
                                label.checkbox-label(:for="user.public_id")
                                    span.circle-checkbox

                div.ta-center(v-if="phoneBook.status")
                    loading
                div.row(v-if="!phoneBook.status && !phoneBook.data.length")
                    div.col-xs.ta-center
                        span.txt-nothing-to-show  {{ $i18n.t('common.nothingToShow') }}

            <!--Step 2-->
            div.nav-request-type.ta-right(v-else-if="step == 2")
                div.nav-selected-avatars
                    img.avatar(v-for="(user, index) in selectedUsers" v-if="index <= 4" :src="user.avatar")
                    span.remain-user-number.persian-num(v-if="checkUsers.length > 5") {{checkUsers.length - 5 }}+

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
                        span.remain-user-number.persian-num(v-if="checkUsers.length > 5") {{checkUsers.length - 5}}+

                    div.arrow

                div.nav-request-amount
                    span.amount-text {{ $i18n.t('requestMoney.amountPerPerson') }}
                    span.sum-amount.persian-num {{ autoPersonAmount | numberFormat }}
                    span.amount-text {{ $i18n.t('transaction.toman') }}

                div.row
                    input.amount-input(v-validate="{type: 'numeric'}" maxlength="8" type="text" v-model="requestAmount" placeholder="مبلغ" @keyup="calcAutoRequestAmount" autofocus)

                div.row.share-in-request-text
                    input(type="checkbox" id="shareRequestChk" v-model="shareRequestWithMe" @change="calcAutoRequestAmount")
                    label(for="shareRequestChk")
                        span
                        | {{ $i18n.t('requestMoney.iAmPartOfThisRequest') }}

            <!--Step 3 Manually Division-->
            div.nav-manually-division(v-else-if="step == 3 && requestType == 'Manually'")
                div.selected-users-avatar.manually-selected-users-avatar
                    div.avatar-container
                        div.slider
                            div(v-for="(user, index) in selectedUsers")
                                img.avatar(:src="user.avatar")

                        span.icon-prev(v-if="manuallyUserCounter > 0" @click="descManuallyUserCounter" title="قبلی")
                        span.icon-next(v-if="manuallyUserCounter < selectedUsers.length -1" @click="incManuallyUserCounter" title="بعدی")



                span.user-name {{selectedUsers[manuallyUserCounter].name}}

                <!--div.row-->
                <!--div.col-xs.ta-center-->
                <!--span.user-name {{selectedUsers[manuallyUserCounter].name}}-->

                div.row.nav-request-amount
                    div.col-xs.ta-center
                        span.amount-text {{ $i18n.t('requestMoney.sum') }}
                        span.sum-amount.persian-num {{ manuallyTotalAmount | numberFormat }}
                        span.amount-text {{ $i18n.t('transaction.toman') }}

                input.amount-input(id="txtManuallyAmount" v-validate="{type: 'numeric'}" maxlength="8" type="text" placeholder="مبلغ" v-model="selectedUsers[manuallyUserCounter].amount" @keyup="calcManuallyTotalAmount" autofocus)



            <!--Step 4 description and details-->
            div.nav-final-step(v-else-if="step === 4")
                div.selected-users-static
                    span(v-for="(user, index) in selectedUsers")
                        img(v-if="index <= 4" :src="user.avatar")
                    span.remain-user-number.persian-num(v-if="checkUsers.length > 5") {{checkUsers.length - 5 }}+

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
                            span.total-amount.persian-num(v-if="requestType == 'Auto'") {{requestAmount | numberFormat }}
                            span.total-amount.persian-num(v-else) {{manuallyTotalAmount | numberFormat}}
                            span.total-toman {{$i18n.t('transaction.toman')}}

                    div.line
                    div.row
                        div.col-xs.ta-right
                            span.multi-person {{ $i18n.t('requestMoney.count') }}
                        div.col-xs.ta-left
                            span.multi-person.persian-num {{ selectedUsers.length + ' ' + $i18n.t('requestMoney.person')}}


            div.footer(v-if="phoneBook.data.length")
                div.row
                    div.col-xs.ta-right.no-margin
                        span.prev-link-text(v-if="step > 1" @click="prevStep") {{$i18n.t('requestMoney.prevStep')}}
                        span.user-counter.persian-num(v-if="step === 1") {{checkUsers.length + ' ' + $i18n.t('requestMoney.personSelected')}}

                    div.col-xs.no-margin
                        button.btn.success.pull-left(v-ripple="" @click="nextStep" v-if="step <= 3") {{$i18n.t('requestMoney.nextStep')}}
                        button.btn.success.pull-left(v-ripple="" @click="postRequestMoney" v-if="step == 4") {{$i18n.t('requestMoney.request')}}
                            svg.material-spinner(v-if="requesting" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")


</template>


<script>
    import modal from '../../partials/modal.vue';
    import loading from '../../../pages/partials/loading.vue';


    import {tns} from "tiny-slider/src/tiny-slider.module";

    export default {
        name: 'pages-requestMoney-partials-new',
        data() {
            return {
                maxAmountLimit: 10000000,
                searchString: '',
                requesting: false,
                loading: false,
                isShowSlider: false,
                step: 1, //Select user, select pay method(auto, manually)
                pageTitle: 'selectUsers',
                closeModalContent: false,
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
                slider: null,
            }
        },
        computed: {
            phoneBook() {
                let vm = this;
                let findedUsers = _.filter(this.$store.state.paginator.paginator.PhoneBook.data, function (user) {
                    let userRegex = new RegExp('\\.*' + vm.searchString + '.*\\i');
                    return userRegex.test(JSON.stringify(user));
                });

                return {
                    data: findedUsers,
                    update: this.$store.state.paginator.update,
                    status: this.$store.state.paginator.paginator.PhoneBook.isLoading
                };
            },
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
        },
        mounted() {
            this.closeModalContent = false;
        },
        created() {
            store.commit('clearValidationErrors');
            if (!this.$store.state.paginator.paginator.PhoneBook) {
                this.getPhoneBook();
            }
        },
        methods: {
            nextStep() {
                if (this.step === 1) {
                    if (this.checkUsers.length <= 0) {
                        store.commit('flashMessage', {
                            text: 'RequestMoneyCheckUsersYouWantLocal',
                            type: 'danger'
                        });
                        return;
                    }
                }

                if (this.step === 2 && this.requestType === 'Manually') {
                    let vm = this;
                    //Tiny slider
                    setTimeout(function () {
                        vm.isShowSlider = true;
                        vm.slider = tns({
                            container: document.querySelector('.slider'),
                            items: 1,
                            slideBy: "page",
                            slideByPage: false,
                            hasNav: true,
                            hasDots: true,
                            keyboard: true,
                            loop: false,
                            speed: 250,
                            controls: false,
                            autoplay: false,
                            autoplayDirection: 'forward',
                            responsive: {
                                500: 1,
                                800: 1,
                            }
                        });
                        vm.isShowSlider = true;
                    }, 100);
                }

                if (this.step === 3 && this.requestType === 'Auto') {
                    if (!this.requestAmount) {
                        store.commit('flashMessage', {
                            text: 'RequestMoneyEnterRequestAmountLocal',
                            type: 'danger'
                        });
                        return
                    }
                }

                if (this.step === 3 && this.requestType === 'Manually') {
                    document.getElementById('txtManuallyAmount').focus();

                    let users = _.filter(this.selectedUsers, function (user) {
                        return user.amount;
                    });

                    if (users) {
                        if (users.length !== this.selectedUsers.length) {
                            store.commit('flashMessage', {
                                text: 'RequestMoneyEnterAllUserAmountLocal',
                                type: 'danger'
                            });
                            return;
                        }
                    }
                }

                //ignore selection method if selected users is one person
                if (this.step === 1 && this.checkUsers.length === 1) {
                    this.step += 2;
                } else {
                    this.step++;
                }

                this.changeTitle();
                this.getSelectedUsers()
            },
            prevStep() {
                if (this.step === 3 && this.checkUsers.length === 1) {
                    this.step -= 2;
                    this.requestType = 'Auto';
                } else {
                    this.step--;
                }

                this.changeTitle();
                if (this.step === 2) {
                    this.requestAmount = null;
                    this.autoPersonAmount = 0;
                }
            },
            changeTitle() {
                if (this.step === 1) {
                    this.pageTitle = 'selectUsers';
                } else if (this.step === 2) {
                    this.pageTitle = 'requestType';
                } else if (this.step === 3) {
                    this.pageTitle = 'requestType';
                }
            },
            /*** Get selected users data ***/
            getSelectedUsers() {
                let vm = this;
                this.selectedUsers = _.filter(this.$store.state.paginator.paginator.PhoneBook.data, function (user) {
                    return vm.checkUsers.indexOf(user.public_id) !== -1;
                });
            },
            /*** Calculate total amount and dealing between users auto ***/
            calcAutoRequestAmount() {
                let usersCount = this.selectedUsers.length;
                if (this.shareRequestWithMe) {
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
                    if (user.amount) {
                        vm.manuallyTotalAmount = parseInt(vm.manuallyTotalAmount) + parseInt(user.amount);
                    }
                });
            },
            incManuallyUserCounter() {
                this.manuallyUserCounter++;
                this.slider.goTo('next');
                document.getElementById('txtManuallyAmount').focus();
            },
            descManuallyUserCounter() {
                this.manuallyUserCounter--;
                this.slider.goTo('prev');
                document.getElementById('txtManuallyAmount').focus();
            },
            /*** Send request money***/
            postRequestMoney() {
                if (!this.description) {
                    store.commit('flashMessage', {
                        text: 'RequestMoneyFillDescriptionInputLocal',
                        type: 'danger'
                    });
                    return;
                }

                /*** Check Amount***/
                if (this.requestType === 'Auto') {
                    if (this.requestAmount <= 100 || this.requestAmount > this.maxAmountLimit) {
                        store.commit('flashMessage', {
                            text: 'RequestMoneyAmountLimitLocal',
                            type: 'danger'
                        });
                        return;
                    }
                } else if (this.requestType === 'Manually') {
                    if (this.manuallyTotalAmount <= 100 || this.manuallyTotalAmount > this.maxAmountLimit) {
                        store.commit('flashMessage', {
                            text: 'RequestMoneyAmountLimitLocal',
                            type: 'danger'
                        });
                        return;
                    }
                }

                this.requesting = true;
                let requestMoneyData = [];

                let vm = this;
                let requestedUsers = this.selectedUsers;
                //make array of requested users to post to api
                this.selectedUsers.forEach(function (user, index) {
                    if (vm.requestType === 'Auto') {
                        requestedUsers[index] = {
                            amount: vm.autoPersonAmount,
                            zp: user.public_id
                        }
                    } else {
                        requestedUsers[index] = {
                            amount: user.amount,
                            zp: user.public_id
                        };
                    }
                });

                requestMoneyData = {
                    'debtor': requestedUsers,
                    'purse_number': this.purse,
                    'description': this.description
                };

                this.$store.state.http.requests['requestMoney.postRequestMoney'].save(requestMoneyData).then(
                    () => {
                        this.$router.push({name: 'requestMoney.index'});
                        this.closeModal();
                        this.getDemand();
                        this.requestSuccessMessage();
                        this.requesting = false;
                    },
                    (response) => {
                        store.commit('setValidationErrors', response.data.validation_errors);
                        store.commit('flashMessage', {
                            text: response.data.meta.error_type,
                            important: false,
                            type: 'danger'
                        });
                        this.requesting = false;
                    }
                );
            },
            closeModal() {
                this.$emit('closeModal');
            },
            getDemand() {
                this.$emit('getDemand');
            },
            requestSuccessMessage() {
                this.$emit('requestSuccessMessage');
            },
            getPhoneBook() {
                let vm = this;
                vm.$store.dispatch(
                    'paginator/make',
                    {
                        vm,
                        resource: vm.$store.state.http.requests['requestMoney.phonebook'],
                        requestName: 'PhoneBook'
                    },
                );
            }
        },
        components: {
            modal,
            loading
        }
    }
</script>