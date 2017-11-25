<template lang="pug">
    div.inner-content.nav-user-setting
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('user.notificationSetting') }}
                p.page-description {{ $i18n.t('user.notificationSettingDescription') }}


        div.row.section.nav-add-address
            div.box.full-width
                span {{userProgress}}
</template>


<script>
    export default {
        name: 'user-show-progress',
        computed: {
            userProgress(){
                return this.$store.state.auth.user.user_progress;
            }
        }
    }
</script>