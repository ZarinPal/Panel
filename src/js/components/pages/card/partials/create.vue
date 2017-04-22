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
                                div.row.nav-account-type(v-if="user.company_info")
                                    div.col-lg-6.col-md-4.col-sm-12.col-xs-12.ta-right.account-label
                                        span.label {{$i18n.t('card.accountType')}}:
                                    div.col-lg-6.col-md-8.col-sm-12.col-xs-12
                                        div.row
                                            div.col-xs.ta-center
                                                input(v-model="isLegal" name="optional" value="0" type="radio" id="rdoًReal")
                                                label(for="rdoًReal")
                                                    span
                                                    |{{ $i18n.t('card.real')}}

                                            div.col-xs.ta-center
                                                input(v-model="isLegal" value="1" name="optional" type="radio" id="rdoLegal")
                                                label(for="rdoLegal")
                                                    span
                                                    |{{ $i18n.t('card.legal')}}



                                div.row
                                    input.ta-left(type="text" v-model="iban" placeholder="شماره شبا" maxlength="26")

                                div(v-if="isLegal == 0")
                                    div.row
                                        input.ta-left(type="text" v-model="pan" placeholder="شماره کارت" maxlength="19" id="pan" @keyup="cardNumberFormat()")

                                    div.row.no-margin
                                        div.col-lg-6.col-md-4.col-xs-12.ta-right.nav-expiration-label
                                            span.label.expiration-label {{ $i18n.t('card.expiredDate') }}:
                                        div.col-lg-6.col-md-8.col-xs-12.no-margin
                                            div.row.nav-expiration-input
                                                div.col-xs.no-margin
                                                    span.label {{$i18n.t('card.month')}}:
                                                    input#month(type="number" v-model="month" placeholder="۰۰" maxlength="2" @keyup="changeMonthFocus")
                                                div.col-xs.no-margin
                                                    span.label {{$i18n.t('card.year')}}:
                                                    input#year(type="number" v-model="year" placeholder="۰۰۰۰" maxlength="4" @keyup="changeYearFocus")

                                div.row
                                    div.col-xs.no-margin
                                        button.btn.success.pull-left(v-ripple="" @click="createCard") {{$i18n.t('card.createCard')}}

</template>


<script>
    export default {
        name: 'pages-card-partials-create',
        data() {
            return {
                closeModalContent: false,
                iban: 'IR',
                pan: '',
                year: '',
                month: '',
                isLegal: '0',
                yearFocus: false
            }
        },
        props:['card'],
        computed:{
            user(){
                return this.$store.state.auth.user;
            }
        },
        mounted() {
            this.closeModalContent = false
        },
        methods: {
            cardNumberFormat() {
                let text = document.getElementById("pan").value;
                let result = [];
                text = this.pan.replace(/[^\d]/g, "");
                while (text.length > 4 && text.length <= 16) {
                    result.push(text.substring(0, 4));
                    text = text.substring(4);
                }
                if (this.pan.length > 0) result.push(text);
                this.pan = result.join("-");
            },
            closeModal() {
                this.$emit('closeModal')
            },
            createCard() {
                if(this.isLegal == 1) {
                    this.pan = '';
                    this.year = '';
                    this.month = '';
                }

                let cardData = {
                    iban : this.iban,
                    pan : this.pan,
                    isLegal : this.isLegal,
                    expired_at : this.year + '-' + this.month,
                };

                this.$store.state.http.requests['card.getList'].save(cardData).then(
                    ()=> {
                        this.$router.push({name: 'card.index'})
                    },
                    (response) => {
                        store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            type: 'danger'
                        });
                    }
                )
            },
            changeMonthFocus(event) {
                let target = event.srcElement;
                let maxLength = parseInt(target.attributes["maxlength"].value);
                let myLength = target.value.length;

                if (myLength >= maxLength) {
                    target.value = '';
                    document.getElementById("year").focus();
                }
            },
            changeYearFocus(event) {
                let target = event.srcElement;
                let maxLength = parseInt(target.attributes["maxlength"].value);
                let myLength = target.value.length;

                if (myLength >= maxLength) {
                    document.getElementById("month").focus();
                }

            }
        }
    }

</script>
