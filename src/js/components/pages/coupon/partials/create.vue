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
                            span.title {{ $t('coupon.createCoupon') }}
                        div.body
                            div.contains
                                div.row
                                    input(type="text" placeholder="شماره کارت")

                                div.row
                                    div.col-xs.no-margin
                                        button.btn.success.pull-left(v-ripple @click="createCoupon") {{$t('common.save')}}

</template>


<script>
    export default {
        name: 'pages-coupon-partials-create',
        data() {
            return {
                closeModalContent: true,
                code: '1111',
                max_amount: '120',
                min_amount: '100',
                webservice_id: '1',
                easypay_id: '86819',
                expired_at: '2021-02-20 01:01:00',
                limit: '2',
                type: 'webservice',
            }
        },
        mounted(){
            this.closeModalContent = false
        },
        methods: {
            closeModal() {
                this.$emit('closeModal')
            },
            createCoupon() {
                let couponData = {
                    code: '1111',
                    discount: {
                        max_amount: '120'
                    },
                    webservice_id: '1',
                    easypay_id: '86819',
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
        }
    }

</script>
