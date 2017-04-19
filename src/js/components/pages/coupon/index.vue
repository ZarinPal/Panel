<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('common.coupons') }}
                p.page-description {{$i18n.t('coupon.couponsDescription')}}

            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                router-link.btn.btn-success(tag="span" v-bind:to="{ name: 'coupon.create'}")
                    span.icon-add-circle
                    span.text {{ $i18n.t('coupon.createCoupon') }}

        div.row
            singleCoupon(v-for="coupon in coupons" v-bind:coupon="coupon")

</template>

<script>
    import singleCoupon from './partials/single-coupon.vue';

    export default {
        name: 'coupon-index',
        data(){
            return{
                coupons: '',
            }
        },
        computed:{
            user(){
                return this.$store.state.auth.user;
            },
        },
        beforeCreate() {
            this.$store.state.http.requests['coupon.getIndex'].get().then(
                (response) => {
                    this.coupons = response.data.data;
                }
            );
        },
        methods: {

        },
        components: {
            singleCoupon
        }
    }
</script>
