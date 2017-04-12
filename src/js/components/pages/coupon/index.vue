<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('common.coupons') }}
                p.page-description {{$i18n.t('coupon.couponsDescription')}}

            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                span.btn.btn-success(@click="visibleCreateCoupon = true")
                    span.icon-add-circle
                    span.text {{ $i18n.t('coupon.createCoupon') }}

        div.row

        createCoupon(v-if="visibleCreateCoupon" v-on:closeModal="closeModal()")

</template>

<script>
    import singleCoupon from './partials/single-coupon.vue';
    import createCoupon from './partials/create.vue';


    export default {
        name: 'coupon-index',
        data(){
            return{
                visibleCreateCoupon: false,
            }
        },
        computed:{
            user(){
                return this.$store.state.auth.user;
            },
            coupons() {
                return this.$store.state.auth.user.coupons;
            }
        },
        methods: {
            closeModal(){
                this.visibleCreateCoupon = false;
            }
        },
        components: {
            singleCoupon,
            createCoupon
        }
    }
</script>
