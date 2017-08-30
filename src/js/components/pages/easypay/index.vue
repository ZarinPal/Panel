<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                p.page-title {{ $i18n.t('common.easypay') }}
                p.page-description {{ $i18n.t('common.easypayDescription') }}

            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                router-link.btn.success(tag="button" v-bind:to="{ name: 'easypay.create'}")
                    span.icon-add-circle
                    span.text {{ $i18n.t('easypay.createEasypay') }}


        div.row
            singleEasypay(v-for="easypay in easypays" v-bind:key="easypay.public_id" v-bind:easypay="easypay")

        div.row(v-if="!easypays.length")
            div.col-xs.ta-center
                span.txt-nothing-to-show  {{ $i18n.t('common.nothingToShow') }}

</template>

<script>
    import singleEasypay from './partials/single-easypay.vue';
    export default {
        name: 'easypay-index',
        data() {
            return {
                loadEasypaysFromPaginator: false,
            }
        },
        computed:{
            user(){
                return this.$store.state.auth.user;
            },
            easypays(){
                if(!this.loadEasypaysFromPaginator) {
                    return this.$store.state.auth.user.easypays;
                }
            }
        },
        created() {
//            let vm = this;
//
//            window.onscroll = function(ev) {
//                if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight
//                    && !vm.$store.state.paginator.paginator.EasypayList.isLoading) {
//                    vm.$store.dispatch(
//                        'paginator/next',
//                        {
//                            requestName: "EasypayList"
//                        }
//                    );
//                }
//            };
        },
        components: {
            singleEasypay
        }
    }
</script>
