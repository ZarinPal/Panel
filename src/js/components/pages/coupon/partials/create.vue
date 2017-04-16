<template lang="pug">
    transition(name="fade"
    enter-active-class="fade-in"
    leave-active-class="fade-out")
        div.modal.coupon(v-on:click.self="closeModal()")
            transition(name="zoom"
            enter-active-class="zoom-in"
            leave-active-class="zoom-out")
                div.row.center-xs(v-if="!closeModalContent" v-on:click.self="closeModal()")
                    div.col-lg-5.col-md-5.col-sm-10.col-xs-10.content
                        div.header
                            span.icon-close(@click="closeModal()")
                            span.title {{ $i18n.t('coupon.createCoupon') }}
                        div.body
                            div.contains
                                div.row
                                    selectbox.selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectedWebservice" v-bind:data="webserviceSelection" placeholder="انتخاب وب سرویس")
                                    selectbox.selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectedEasypay" v-bind:data="easypaySelection" placeholder="انتخاب آسان پرداخت")
                                    input(type="text" placeholder="شماره کارت")

                                div.row
                                    div.col-xs.no-margin
                                        button.btn.success.pull-left(v-ripple="" @click="createCoupon") {{$i18n.t('common.save')}}

</template>


<script>
    import selectbox from '../../partials/selectbox.vue';

    export default {

        name: 'pages-coupon-partials-create',
        data() {
            return {
                closeModalContent: true,
                code: '1111',
                max_amount: '120',
                min_amount: '100',
                webservice_id: '',
                easypay_id: '86819',
                expired_at: '2021-02-20 01:01:00',
                limit: '2',
                type: 'webservice',
            }
        },
        computed:{
            webserviceSelection() {
                if(this.$store.state.auth.user.webservices) {
                    return this.$store.state.auth.user.webservices.map(function (webservice) {
                        return {
                            'title': webservice.name,
                            'value': webservice.entity_id
                        }
                    });
                }
            },
            easypaySelection() {
                if(this.$store.state.auth.user.easypays) {
                    return this.$store.state.auth.user.easypays.map(function (easypay) {
                        return {
                            'title': easypay.title,
                            'value': easypay.entity_id
                        }
                    });
                }
            }
        },
        mounted(){
            this.closeModalContent = false
        },

        methods: {
            closeModal() {
                this.$emit('closeModal')
            },
            selectedWebservice(entityId) {
                this.webservice_id = entityId;
            },
            selectedEasypay(entityId) {
                this.easypay_id = entityId;
            },
            createCoupon() {
                let couponData = {
                    code: '1111',
                    discount: {
                        max_amount: '120'
                    },
                    webservice_id: '1',
                    easypay_id: '94463',
                    expired_at: '2021-02-20 01:01:00',
                    limit: '2',
                    min_amount: '100',
                    type: 'webservice',
                };
                this.$store.state.http.requests['coupon.getIndex'].save(couponData).then(
                    ()=> {
                        this.$router.push({name: 'coupon.index'})
                    },
                    (response) => {
                        store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            type: 'danger'
                        });
                    }
                )
            }
        },
        components: {
            selectbox
        }
    }

</script>
