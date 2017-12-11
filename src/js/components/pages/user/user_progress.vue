<template lang="pug">
    div.inner-content.nav-user-setting
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('user.userProgress') }}
                p.page-description {{ $i18n.t('user.userProgressDescription') }}


            div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section.create-webservice
                div.box.ta-center
                    div
                        img.user-avatar(:src="user.avatar")
                    div
                        span.user-name(v-if="userProgress") {{userProgress.points | persianNumbers}} {{ $i18n.t('user.percentOfComplate') }}


        div.row.section
            div.col-lg-4(v-for="(progress, progressKey) in userProgress" v-if="progressKey !== 'points'")
                div.box.box-style
                    i.icon-zp-dashboard.text-style
                    span.text-style {{ $i18n.t('user.progress.' + progressKey) }}({{ progress.point }}%)
                    span.done-prog(v-if="progress.check")
                        span.pull-left.text-style انجام شده
                    span.pending-prog(v-else)
                        span.pull-left.text-style در انتظار




</template>


<script>
    export default {
        name: 'user-show-progress',
        computed: {
            userProgress(){
                return this.$store.state.auth.user.user_progress;
            },
            user(){
                return this.$store.state.auth.user;
            }
        }
    }
</script>