<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                p.page-title {{ $i18n.t('coupon.createCoupon') }}
                p.page-description {{ $i18n.t('coupon.createCouponDescription') }}

            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                router-link.btn.success.pull-left(tag="button" v-bind:to="{ name: 'user.notificationSetting'} ") {{ $i18n.t('user.notificationSetting') }}
                router-link.btn.success.pull-left(tag="button" v-bind:to="{ name: 'user.editProfile'} ") {{ $i18n.t('user.addNewAddress') }}

            div.row.section.nav-add-address
                div.box.full-width

</template>



<script>
    export default {
        name: 'user-index',
        data() {
            return {
                loading: false,
            }
        },
        created() {

        },
        methods: {

        },
    }
</script>