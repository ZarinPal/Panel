<template lang="pug">
    modal.card(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('card.addAccountTitle') }}
        div(slot="content")
            form(autocomplete="on" onsubmit="event.preventDefault();")
                div.row.nav-account-type(v-if="user.company_info")
                    div.col-lg-6.col-md-4.col-sm-12.col-xs-12.ta-right.account-label
                        span.label {{$i18n.t('card.accountType')}}:
                    div.col-lg-6.col-md-8.col-sm-12.col-xs-12
                        div.row
                            div.col-xs.ta-center
                                input(v-model="isLegal" name="optional" value="0" type="radio" id="rdoًReal")
                                label(for="rdoًReal")
                                    span
                                    | {{ $i18n.t('card.real')}}

                            div.col-xs.ta-center
                                input(v-model="isLegal" value="1" name="optional" type="radio" id="rdoLegal")
                                label(for="rdoLegal")
                                    span
                                    | {{ $i18n.t('card.legal')}}

                div.row.input-group.no-margin(:class="{'input-danger': errors.has('iban')}")
                    div.col-xs.no-margin
                        input.input.ta-left.dir-ltr(v-focus="" v-validate="{ rules: {required: true, numeric: true, digits: 24} }" v-bind:data-vv-as="$i18n.t('card.iban')" maxlength="24" type="text" v-model="iban" name="iban" id="iban" :placeholder= "$i18n.t('card.iban')" autofocus tabindex="1")
                    div.no-margin.first-label
                        span IR

                div.ta-right(v-if="validation('iban')")
                    span.text-danger {{ errors.first('iban') }}

                div(v-if="isLegal == 0")
                    div.row
                        input.ta-left.dir-ltr(v-validate="{ rules: {required: true, regex: /^[5-6](\\d{3})(-(\\d{4})){3}/ }}" maxlength="19" v-bind:data-vv-as="$i18n.t('card.pan')" :class="{'input-danger': errors.has('pan')}" type="text" v-model="pan" name="pan" :placeholder= "$i18n.t('card.pan')" id="pan" @keyup="cardNumberFormat('pan')" tabindex="2")
                        div.ta-right(v-if="validation('pan')")
                            span.text-danger {{ errors.first('pan') }}

                    div.row.no-margin
                        div.col-lg-6.col-md-4.col-xs-12.ta-right.nav-expiration-label
                            span.label.expiration-label {{ $i18n.t('card.expiredDate') }}:
                        div.col-lg-6.col-md-8.col-xs-12.no-margin
                            div.row.nav-expiration-input
                                div.col-xs.no-margin
                                    span.label {{$i18n.t('card.month')}}:
                                    input#month(v-validate="{ rules: {required: true, numeric: true, min_value: 1 ,max_value: 12}}" v-bind:data-vv-as="$i18n.t('card.month')" :class="{'input-danger': errors.has('month')}" maxlength="2" type="text" v-model="month" name="month" :placeholder= "$i18n.t('card.month')" @keyup="changeMonthFocus")
                                div.col-xs.no-margin
                                    span.label {{$i18n.t('card.year')}}:
                                    input#year(v-validate="{ rules: {required: true, numeric: true, min_value : 1396 , max_value: 1425}}" v-bind:data-vv-as="$i18n.t('card.year')" :class="{'input-danger': errors.has('year')}" maxlength="4" type="text" v-model="year" name="year" :placeholder="$i18n.t('card.year')" @keyup="changeYearFocus")

                                div.ta-right
                                    div.text-danger(v-if="validation('year')") {{ errors.first('year') }}
                                    div.text-danger(v-if="validation('month')") {{ errors.first('month') }}





                div.row
                    div.col-xs.no-margin
                        button.btn.success.pull-left(v-ripple="" @click="validateForm") {{$i18n.t('card.createCard')}}
                            svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")


</template>


<script>
    import modal from '../../partials/modal.vue';

    export default {
        name: 'pages-card-partials-create',
        validator: null,
        data() {
            return {
                loading: false,
                closeModalContent: false,
                iban: null,
                pan: null,
                year: null,
                month: null,
                isLegal: 0,
                yearFocus: false,
            }
        },
        props: ['card'],
        computed: {
            user(){
                return this.$store.state.auth.user;
            },
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
            expiredAt() {
                let expiredAt = this.jalaliToGregorian(this.year, this.month);
                return expiredAt;
            }
        },
        created(){
            store.commit('clearValidationErrors');
        },
        mounted() {
            this.closeModalContent = false
        },
        methods: {
            validation(name) {
                if (this.$store.state.alert.validationErrors[name]) {
                    this.errors.clear();
                    this.errors.add(name, this.$store.state.alert.validationErrors[name], 'api');
                    this.$store.state.alert.validationErrors[name] = false;
                }
                return this.errors.has(name);
            },
            validateForm() {
                this.$validator.validateAll({
                    iban: this.iban,
                    pan: this.pan,
                    year: this.year,
                    month: this.month
                }).then((result) => {
                    if (result) {
                        this.createCard();
                    }
                });
            },
            cardNumberFormat(inputId) {
                let text = document.getElementById(inputId).value;
                let result = [];
                if (text) {
                    text = this[inputId].replace(/[^\d]/g, "");
                    while (text.length > 4) {
                        result.push(text.substring(0, 4));
                        text = text.substring(4);
                    }
                    if (this[inputId].length > 0) result.push(text);
                    this[inputId] = result.join("-");
                }
            },
            closeModal() {
                this.$emit('closeModal');
            },
            createCard() {
                this.loading = true;

                if (this.year > 3150 || this.month > 12) {
                    store.commit('flashMessage', {
                        text: 'invalid-date',
                        type: 'danger'
                    });
                    this.loading = false;
                    return;
                }

                if (this.isLegal === 1) {
                    this.pan = '';
                    this.year = '';
                    this.month = '';
                }


                let formatedPan = this.pan;
                if (/-/g.test(formatedPan)) {
                    formatedPan = this.pan.split('-').join('');
                }

                let expiredAt = this.jalaliToGregorian(this.year, this.month);

                let cardData = {
                    iban: 'IR' + this.iban,
                    pan: formatedPan,
                    isLegal: this.isLegal,
                    expired_at: expiredAt,
                };

                this.$store.state.http.requests['card.getList'].save(cardData).then(
                    () => {
                        this.loading = false;
                        this.$router.push({name: 'card.index'});
                    },
                    (response) => {
                        this.loading = false;
                        store.commit('setValidationErrors', response.data.validation_errors);
                        store.commit('flashMessage', {
                            text: response.data.meta.error_message,
                            type: 'danger'
                        });
                    }
                )
            },
            jalaliToGregorian(year, month, day = null) {
                let jalali = year + '/' + month + '/' + day;
                let gregorian = moment(jalali, 'jYYYY/jM/jD');
                gregorian = gregorian._i;
                return gregorian.substr(0, gregorian.length - 3);
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
