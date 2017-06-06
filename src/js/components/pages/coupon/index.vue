<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('common.coupons') }}
                p.page-description {{$i18n.t('coupon.couponsDescription')}}

            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                router-link.btn.success(tag="button" v-bind:to="{ name: 'coupon.create'}")
                    span.icon-add-circle
                    span.text {{ $i18n.t('coupon.createCoupon') }}

        div.row
            singleCoupon(v-for="coupon in coupons" v-bind:key="coupon.entity_id" v-bind:coupon="coupon")

        div.row
            div.col-xs.ta-center
                loading(v-if="loading")
                span.txt-nothing-to-show(v-if="!loading && !coupons.length")  {{ $i18n.t('common.nothingToShow') }}

</template>

<script>
    import singleCoupon from './partials/single-coupon.vue';
    import loading from '../../pages/partials/loading.vue';

    export default {
        name: 'coupon-index',
        data(){
            return{
                loading:true,
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
                    this.loading = false;
                    this.coupons = response.data.data;
                },()=>{
                    this.loading = false;
                }
            );
        },
        methods: {

        },
        components: {
            singleCoupon,
            loading
        }
    }
</script>
