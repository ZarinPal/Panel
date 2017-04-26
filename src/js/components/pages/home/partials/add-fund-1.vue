<template lang="pug">
    transition(name="fade"
    enter-active-class="fade-in"
    leave-active-class="fade-out")
        div.modal.card(v-on:click.self="closeModal()")
            transition(name="zoom"
            enter-active-class="zoom-in"
            leave-active-class="zoom-out")
                div.row.center-xs(v-if="!closeModalContent" v-on:click.self="closeModal()")
                    div.col-lg-5.col-md-5.col-sm-10.col-xs-10.content
                        div.header
                            span.icon-close(@click="closeModal()")
                            span.title {{ $i18n.t('card.addAccountTitle') }}
                        div.body
                            div.contains


                                div.row
                                    div.col-xs.no-margin
                                        button.btn.success.pull-left(v-ripple="") {{$i18n.t('purse.addFund')}}

</template>


<script>
    export default {
        name: 'home-purse-addFund',
        data() {
            return {
//                closeModalContent: true,
//                purse: purse.purse,
//                amount: 0,
//                cardId: ''
            }
        },
        props: ['purse'],
        mounted() {
            this.closeModalContent = false
        },
        methods: {
            closeModal() {
                this.$emit('closeModal')
            },
            reload() {
//                location.reload();
            },
            addFund() {
//                let fundData = {
//                    amount : this.amount,
//                    purse : this.purse,
//                    card_id : this.cardId,
//                    redirect_url : '',
//                };
//                this.$store.state.http.requests['purse.getList'].save(fundData).then(
//                    ()=> {
//                        this.reload();
//                    },
//                    (response) => {
//                        this.$store.commit('flashMessage',{
//                            text: response.data.meta.error_message,
//                            type: 'danger'
//                        });
//                    }
//                )
            },
            moneyFormat(num) {
//                let n = num.toString(), p = n.indexOf('.');
//                return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, function($0, i){
//                    return p<0 || i<p ? ($0+',') : $0;
//                });
            }
        }
    }

</script>
