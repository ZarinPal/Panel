<template lang="pug">
    div.inner-content(v-if="$store.state.app.isLoaded")
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('user.connectZarinToTelegramBot') }}
                <!--p.page-description {{ $i18n.t('coupon.createCouponDescription') }}-->

            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                router-link.btn.success(v-ripple="" tag="button" v-bind:to="{ name: 'home.index', params: {createPurse: 'Yes'}}" title="ساخت کیف پول")
                    span.icon-add-circle
                    span.text {{ $i18n.t('purse.addPurse') }}

        div.row.section
            purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectedPurse" placeholder="انتخاب کیف پول")


            div.row
                div.col-xs.no-margin
                    button.btn.success.pull-left(v-ripple="" @click="postReferer") {{$i18n.t('purse.addPurse')}}
                        svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                            circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")


    div(v-else)
        div.loading.ta-center
            div.spinner



</template>

<script>
    import purse from '../partials/purses.vue';
    import loading from '../partials/loading.vue';

    export default {
        name: 'auth-referer',
        data () {
            return {
                loading: false,
                purse: null,
            }
        },
        computed:{

        },

        methods: {
            selectedPurse(purseId) {
                this.purse = purseId;
            },
            postReferer() {
                this.loading = true;
                let refererData = {
                    purse: this.purse,
                    ref_id: this.$store.state.app.refererId
                };



            }
        },
        components: {
            purse,
            loading
        }
    }

</script>