<template lang="pug">
    modal.card(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('card.addAccountTitle') }}
        div(slot="content")
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
                    input.input.ta-left(type="text" v-model="iban"  placeholder= "شماره شبا" maxlength="24")
                div.no-margin.first-label
                    span IR
            div.ta-right(v-if="validationErrors.iban")
                span.text-danger {{ $i18n.t(validationErrors.iban) }}

            div(v-if="isLegal == 0")
                div.row
                    input.ta-left(:class="{'input-danger': validationErrors.pan}" type="text" v-model="pan" placeholder="شماره کارت" maxlength="19" id="pan" @keyup="cardNumberFormat('pan')")
                    div.ta-right(v-if="validationErrors.pan")
                        span.text-danger {{ $i18n.t(validationErrors.pan) }}

                div.row.no-margin
                    div.col-lg-6.col-md-4.col-xs-12.ta-right.nav-expiration-label
                        span.label.expiration-label {{ $i18n.t('card.expiredDate') }}:
                    div.col-lg-6.col-md-8.col-xs-12.no-margin
                        div.row.nav-expiration-input
                            div.col-xs.no-margin
                                span.label {{$i18n.t('card.month')}}:
                                input#month(type="text" v-model="month" placeholder="00" maxlength="2" @keyup="changeMonthFocus")
                            div.col-xs.no-margin
                                span.label {{$i18n.t('card.year')}}:
                                input#year(type="text" v-model="year" placeholder="0000" maxlength="4" @keyup="changeYearFocus")

            div.row
                div.col-xs.no-margin
                    button.btn.success.pull-left(v-ripple="" @click="createCard") {{$i18n.t('card.createCard')}}
                        svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                            circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")


</template>


<script>
    import modal from '../../partials/modal.vue';

    export default {
        name: 'pages-card-partials-create',
        data() {
            return {
                loading: false,
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
                text = this[inputId].replace(/[^\d]/g, "");
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
                this.loading = true;
                if(this.isLegal == 1) {
                    this.pan = '';
                    this.year = '';
                    this.month = '';
                }

                let formatedPan = this.pan.split('-').join('');

                let expiredAt = this.jalaliToGregorian(this.year, this.month, 30);

                let cardData = {
                    iban : 'IR' + this.iban,
                    pan : formatedPan,
                    isLegal : this.isLegal,
                    expired_at : expiredAt,
                };

                this.$store.state.http.requests['card.getList'].save(cardData).then(
                    ()=> {
                        this.closeModal();
                    },
                    (response) => {
                        this.loading = false;
                        store.commit('setValidationErrors',response.data.validation_errors);
                    }
                )
            },
            jalaliToGregorian(year, month, day) {
                let jalali = year + '/' + month + '/' + day;
                let gregorian = moment(jalali, 'jYYYY/jM/jD');
                gregorian = gregorian._i;
                return gregorian.substr(0, gregorian.length-3);
            },
            changeMonthFocus(event) {
                let target = event.srcElement;
                let maxLength = parseInt(target.attributes["maxlength"].value);
                let myLength = target.value.length;

                if (myLength >= maxLength) {
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
        },
        components: {
            modal
        }
    }
</script>
