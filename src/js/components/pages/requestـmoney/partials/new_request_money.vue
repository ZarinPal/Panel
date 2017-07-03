<template lang="pug">
    modal.card(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('requestMoney.selectUsers') }}
        div(slot="content")
            div.nav-select-user
                div.row.search-box
                    span.icon-search
                    input(type="text" placeholder="جستجو")

                div.users
                    div.row.user-row(v-for="user in users")
                        div.col-lg-2.col-md-2.col-xs-3.no-margin.ta-right
                            img.avatar(src="//gravatar.com/avatar/890daede1a83cb2def69216076e29400?r=g&d=mm")
                        div.col-lg-8.col-md-8.col-xs-7.no-margin.ta-right
                            div.user-name {{user.name}}
                            div.user-zp {{user.zp}}
                        div.col-lg-2.col-md-2.col-xs-2
                            input(type="checkbox" :value="user.zp" v-model="checkUsers" :id="user.zp")
                            label(:for="user.zp")
                                span.circle-checkbox


                div.footer
                    div.row
                        div.col-xs.ta-right.no-margin
                            span.user-counter.persian-num(v-if="checkUsers.length") {{checkUsers.length + ' ' + $i18n.t('requestMoney.personSelected')}}

                        div.col-xs.no-margin
                            button.btn.success.pull-left(v-ripple="" @click="") {{$i18n.t('requestMoney.nextStep')}}
                                svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                    circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")




</template>


<script>
    import modal from '../../partials/modal.vue';

    export default {
        name: 'pages-requestMoney-partials-new',
        data() {
            return {
                loading: false,
                closeModalContent: false,
                checkUsers: [],
                users: {
                    0: {
                        'name': 'امین نظری',
                        'zp': 'zp.123456',
                    },
                    1: {
                        'name': 'امین نظری',
                        'zp': 'zp.2345',
                    },
                    2: {
                        'name': 'یاسین نظری',
                        'zp': 'zp.33666',
                    },
                    3: {
                        'name': 'محمد قفاری',
                        'zp': 'zp.56573',
                    },
                    4: {
                        'name': 'امین نظری',
                        'zp': 'zp.34345',
                    },
                }
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
            searchUser(content) {
                return _.some(this.users, _.unary(_.partialRight(_.includes, content)));
            }
        },
        components: {
            modal
        }
    }
</script>
