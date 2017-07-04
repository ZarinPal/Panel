<template lang="pug">
    modal.new-request-money(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('requestMoney.' + pageTitle) }}
        div(slot="content")
            <!--Step 1-->
            div.nav-select-user(v-if="step == 1")
                div.row.search-box
                    span.icon-search
                    input(type="text" placeholder="جستجو")

                div.users
                    div.row.user-row(v-for="user in users")
                        div.col-lg-2.col-md-2.col-xs-3.no-margin.ta-center
                            img.avatar(:src="user.avatar")
                        div.col-lg-8.col-md-8.col-xs-7.no-margin.ta-right
                            div.user-name {{user.name}}
                            div.user-zp {{user.zp}}
                        div.col-lg-2.col-md-2.col-xs-2.no-margin
                            input(type="checkbox" :value="user.zp" v-model="checkUsers" :id="user.zp")
                            label(:for="user.zp")
                                span.circle-checkbox

                div.footer
                    div.row
                        div.col-xs.ta-right.no-margin
                            span.user-counter.persian-num(v-if="checkUsers.length") {{checkUsers.length + ' ' + $i18n.t('requestMoney.personSelected')}}

                        div.col-xs.no-margin
                            button.btn.success.pull-left(v-ripple="" v-if="checkUsers.length" @click="nextStep") {{$i18n.t('requestMoney.nextStep')}}

            <!--Step 2-->
            div.nav-request-type.ta-right(v-if="step == 2")
                div.nav-selected-avatars
                    img.avatar(v-for="(user, index) in checkUsers" v-if="index <= 4" :src="user.avatar")
                    span.remain-user-number(v-if="checkUsers.length > 5") {{checkUsers.length - 5 |persianNumbers}}

                div.top-text {{ $i18n.t('requestMoney.chooseOneOfTheFollowingMethods') }}
                div.row.method-box(:class="{'active' : requestType == 'Auto'}")
                    div.col-xs
                        div.title  {{ $i18n.t('requestMoney.equalDivide') }}
                        div.description  {{ $i18n.t('requestMoney.equalDivideDescription') }}
                    div
                        input(type="radio" name="requestType" id="requestTypeAuto" value="Auto" v-model="requestType" )
                        label(for="requestTypeAuto")
                            span.circle-checkbox


                div.row.method-box(:class="{'active' : requestType == 'Manually'}")
                    div.col-xs
                        div.title  {{ $i18n.t('requestMoney.enterTheAmountManually') }}
                        div.description  {{ $i18n.t('requestMoney.enterTheAmountManuallyDescription') }}
                    div
                        input(type="radio" name="requestType" id="requestTypeManually" value="Manually" v-model="requestType")
                        label(for="requestTypeManually")
                            span.circle-checkbox

                div.footer
                    div.row
                        div.col-xs.ta-right.no-margin
                            span.prev-link-text(@click="prevStep") {{$i18n.t('requestMoney.prevStep')}}

                        div.col-xs.no-margin
                            button.btn.success.pull-left(v-ripple=""  @click="nextStep") {{$i18n.t('requestMoney.nextStep')}}

</template>


<script>
    import modal from '../../partials/modal.vue';

    export default {
        name: 'pages-requestMoney-partials-new',
        data() {
            return {
                loading: false,
                step: 1,
                pageTitle: 'selectUsers',
                closeModalContent: false,
                checkUsers: [],
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
                },
                requestType: 'Auto', //Auto, Manually
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
            changeTitle() {
                if(this.step === 1) {
                    this.pageTitle = 'selectUsers';
                }else if(this.step === 2) {
                    this.pageTitle = 'requestType';

                    let selectedUserObject = {};

                    this.checkUsers.forEach(function (zpId) {
                        let vm = this;
                        selectedUserObject = _.find(this.users, function(user) {
                            return user.zp === zpId;
                        });
                    });
                    console.log(selectedUserObject);



                } else if(this.step === 3) {
                    this.pageTitle = 'requestType';
                }
            }
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
            },
            prevStep() {
                this.step --;
                this.changeTitle();
            },
            searchUser(content) {
                return _.some(this.users, _.unary(_.partialRight(_.includes, content)));
            }
        },
        components: {
            modal
        }
    }
</script>
