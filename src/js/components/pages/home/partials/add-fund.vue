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
                                div(v-if="activeCards")
                                    div.row
                                        span افزایش حساب کیف پول {{purse.name}}
                                    div.row
                                        input(type="number" v-model="amount" placeholder="مبلغ")
                                    div.row
                                        selectbox.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectCard" v-bind:data="activeCards" placeholder="انتخاب حساب بانکی")

                                    div.row
                                        div.col-xs.no-margin
                                            button.btn.success.pull-left(v-ripple="" @click="addFund") {{$i18n.t('purse.addFund')}}

                                div.nav-not-active-card(v-else)
                                    p.header {{ $i18n.t('common.zarinpal') }}
                                    p.description {{ $i18n.t('purse.addFundNotActiveCard') }}

</template>


<script>
    import selectbox from '../../partials/selectbox.vue';

    export default {
        name: 'home-purse-addFund',
        data() {
            return {
                closeModalContent: false,
                amount: '',
                cardId: '',
                redirectUrl:encodeURI(
                'https://' + window.location.hostname + '/'
                + this.$router.resolve({name: 'home.finishAddFund'}).href),
            }
        },
        props: ['purse'],
        mounted(){
            this.closeModalContent = false
        },
        computed:{
            activeCards() {
                let activeCards = [];

                _.forEach(this.$store.state.auth.user.cards, function(card) {
                    if(card.status == "Active") {
                        activeCards.unshift({
                            'title' : '<img src="assets/img/banks/' + card.issuer.slug  + '.png" class="bank-logo"></img>' + card.issuer.name + '<span class="pull-left">' + card.pan +  '</span>',
                            'value' : card.entity_id,
                        });
                    }
                });
                return activeCards;
            }
        },
        methods: {
            closeModal() {
                this.$emit('closeModal')
            },
            addFund() {
                let addFundData = {
                    purse: this.purse.purse,
                    amount: this.amount,
                    card_id: this.cardId,
                    redirect_url: this.redirectUrl
                };
                this.$store.state.http.requests['checkout.postAddFund'].save(addFundData).then(
                    (response)=> {

                        let vm = this;
                        let purseIndex = _.findIndex(this.$store.state.auth.user.purses, function(purse) {
                            return purse.purse === vm.purse.purse
                        });

                        let balance = this.$store.state.auth.user.purses[purseIndex].balance;
                        let newBalance = this.amount + balance;
                        this.$store.state.auth.user.purses[purseIndex].balance = newBalance;


                        let addFundWindow = window.open(
                            'https://www.zarinpal.com/pg/StartPay/' + response.data.data.authority + '/ZarinGate',
                            'شارژ کیف‌پول'
                        );
                        addFundWindow.onbeforeunload = ()=>{
                            store.commit('flashMessage', {
                                text: 'کیف پول مورد نظر شارژ شد',
                                type: 'success',
                            });
                        };
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
            selectCard(cardId) {
                this.cardId = cardId;
            }
        },
        components: {
            selectbox
        }
    }

</script>
