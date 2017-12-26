<template lang="pug">
    div.inner-content.nav-user-setting
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                p.page-title {{ $i18n.t('user.userProgress') }}
                p.page-description {{ $i18n.t('user.userProgressDescription') }}
            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                router-link.btn.default.pull-left(tag="button" v-bind:to="{ name: 'home.index'} ") {{ $i18n.t('common.returnToDashboard') }}

            div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section.create-webservice
                div.box.ta-center
                    div.avatar-bg
                        img.user-avatar(:src="user.avatar")
                    div
                        span.user-name.persian-num(v-if="userProgress") {{userProgress.points }} {{ $i18n.t('user.percentOfComplate') }}

        <!--Boxes-->
        div.row.section
            div.col-lg-4.col-md-6.col-xs-12(v-for="(progress, progressKey) in userProgress" v-if="progressKey !== 'points'")
                div.box.box-style(v-if="progressKey == 'botTelegram'")
                    a(href="https://t.me/zarinpalrobot" target="blank")
                        i.icon-zp-progressKey.text-style
                        span.text-style {{ $i18n.t('user.progress.' + progressKey) }}
                        span.done-prog(v-if="progress.check")
                            span.pull-left.text-style انجام شده
                        span.pending-prog(v-else)
                            span.pull-left.text-style در انتظار
                        span.priority.persian-num %{{progress.point}}+

                div.box.box-style.hand(v-else @click="redirect(progressKey)")
                    i.icon-zp-progressKey.text-style
                    span.text-style.persian-num {{ $i18n.t('user.progress.' + progressKey) }}
                    span.done-prog(v-if="progress.check")
                        span.pull-left.text-style انجام‌شده
                    span.pending-prog(v-else)
                        span.pull-left.text-style در انتظار
                    span.priority.persian-num %{{progress.point}}+

            referrer(v-if="visibleReferrer" v-on:closeModal="closeModal()")
            get-email(v-if="visibleGetEmailFromUser" v-on:closeModal="closeModal()")

</template>


<script>
    import referrer from "./referrer";
    import getEmail from "./get_email.vue";
    export default {
        name: 'user-show-progress',
        data() {
            return {
                visibleReferrer: false,
                visibleGetEmailFromUser: false,
            }
        },
        computed: {
            userProgress(){
                return this.$store.state.auth.user.user_progress;
            },
            user(){
                return this.$store.state.auth.user;
            }
        },
        methods: {
            closeModal() {
                this.visibleReferrer = false;
                this.visibleGetEmailFromUser = false;
            },
            redirect(progressKey) {
                switch(progressKey) {
                    case 'mobile':
                        this.visibleGetEmailFromUser = true;
                        break;
                    case 'referrer':
                        this.visibleReferrer = true;
                        break;
                    case 'ssn':
                        this.$router.push({name: 'user.levelUp'});
                        break;
                    case 'card':
                        this.$router.push({name: 'card.index'});
                        break;
                    case 'addresses':
                        this.$router.push({name: 'user.addAddress'});
                        break;
                    case 'username':
                        this.$router.push({name: 'easypay.index'});
                        break;
                    case 'email':
                        this.visibleGetEmailFromUser = true;
                        break;
                }
            }
        },
        components: {
            referrer,
            getEmail
        }
    }
</script>