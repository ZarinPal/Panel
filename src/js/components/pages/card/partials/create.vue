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

                                div.row.input-group.no-margin(:class="{'input-danger': validationErrors.iban}")
                                    div.col-xs.no-margin
                                        input.input.ta-left(type="text" v-model="iban"  placeholder= "شماره شبا" maxlength="27"  id="iban" @keyup="cardNumberFormat('iban')")
                                    div.no-margin.first-label
                                        span IR

                                span.text-danger(v-if="validationErrors.iban") {{ $i18n.t(validationErrors.iban) }}

                                div(v-if="isLegal == 0")
                                    div.row
                                        input.ta-left(:class="{'input-danger': validationErrors.pan}" type="text" v-model="pan" placeholder="شماره کارت" maxlength="19" id="pan" @keyup="cardNumberFormat('pan')")
                                        span.text-danger(v-if="validationErrors.pan") {{ $i18n.t(validationErrors.pan) }}

                                    div.row.no-margin
                                        div.col-lg-6.col-md-4.col-xs-12.ta-right.nav-expiration-label
                                            span.label.expiration-label {{ $i18n.t('card.expiredDate') }}:
                                        div.col-lg-6.col-md-8.col-xs-12.no-margin
                                            div.row.nav-expiration-input
                                                div.col-xs.no-margin
                                                    span.label {{$i18n.t('card.month')}}:
                                                    input#month(type="number" v-model="month" placeholder="00" maxlength="2" @keyup="changeMonthFocus")
                                                div.col-xs.no-margin
                                                    span.label {{$i18n.t('card.year')}}:
                                                    input#year(type="number" v-model="year" placeholder="0000" maxlength="4" @keyup="changeYearFocus")

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
                iban: '',
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
            },
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
        },
        mounted() {
            this.closeModalContent = false
        },
        methods: {
            cardNumberFormat(inputId) {
                let text = document.getElementById(inputId).value;
                let result = [];
//                if(dataType == 'integer') {
                    text = this[inputId].replace(/[^\d]/g, "");
//                }
                while (text.length > 4) {
                    result.push(text.substring(0, 4));
                    text = text.substring(4);
                }
                if (this[inputId].length > 0) result.push(text);
                this[inputId] = result.join("-");
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

                let formatedPan = this.pan.split('-').join('');
                let formatedIban = this.iban.split('-').join('');

                let expiredAt = '';
                if(this.year && this.month) {
                    expiredAt = this.year + '-' + this.month;
                }

                let cardData = {
                    iban : 'IR' + formatedIban,
                    pan : formatedPan,
                    isLegal : this.isLegal,
                    expired_at : expiredAt,
                };

                this.$store.state.http.requests['card.getList'].save(cardData).then(
                    ()=> {
                        this.closeModal();
                    },
                    (response) => {
                        store.commit('setValidationErrors',response.data.validation_errors);
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

            },
        }
    }

</script>
