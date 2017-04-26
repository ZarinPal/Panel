<template lang="pug">
    transition(name="fade"
    enter-active-class="fade-in"
    leave-active-class="fade-out")
        div.modal.add-fund(v-on:click.self="closeModal()")
            transition(name="zoom"
            enter-active-class="zoom-in"
            leave-active-class="zoom-out")
                div.row.center-xs(v-if="!closeModalContent" v-on:click.self="closeModal()")
                    div.col-lg-5.col-md-5.col-sm-10.col-xs-10.content
                        div.header
                            span.icon-close(@click="closeModal()")
                            span.title {{ $i18n.t('purse.addFund') }}

                        div.body
                            div.contains

                                div.row
                                    span افزایش حساب کیف پول {{purse.name}}
                                div.row
                                    input(type="text" v-model="amount" placeholder="مبلغ")
                                div.row
                                    input(type="text" v-model="cardId" placeholder="شماره کارت" maxlength="19" id="cardId" @keyup="cardNumberFormat('cardId')")

                                div.row
                                    div.col-xs.no-margin
                                        button.btn.success.pull-left(v-ripple="" @click="addFund") {{$i18n.t('purse.addFund')}}

</template>


<script>
    export default {
        name: 'home-purse-addFund',
        data() {
            return {
                closeModalContent: false,
//                purse: purse.purse,
                amount: '',
                cardId: '',
                redirectUrl: ''
            }
        },
        props: ['purse'],
        mounted(){
            this.closeModalContent = false
        },
        computed:{

        },
        methods: {
            closeModal() {
                this.$emit('closeModal')
            },
            addFund() {
                let formatedCardId = this.cardId.split('-').join('');
                let addFundData = {
                    purse: this.purse.purse,
                    amount: this.amount,
                    card_id: formatedCardId,
                    redirect_url: this.redirectUrl
                };

                this.$store.state.http.requests['checkout.postAddFund'].save(addFundData).then(
                    ()=> {
                        this.reload();
                    },
                    (response) => {
                        this.$store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            important: false,
                            type: 'danger'
                        });
                    }
                )
            },
            reload() {
                location.reload();
            },
            cardNumberFormat(inputId) {
                let text = document.getElementById(inputId).value;
                let result = [];
                text = this[inputId].replace(/[^\d]/g, "");
                while (text.length > 4) {
                    result.push(text.substring(0, 4));
                    text = text.substring(4);
                }
                if (this[inputId].length > 0) result.push(text);
                this[inputId] = result.join("-");
            },
        },
    }

</script>
