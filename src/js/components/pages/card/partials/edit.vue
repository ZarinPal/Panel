<template lang="pug">
    modal.card(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('card.editAccountTitle') }}
        div(slot="content")
            form(autocomplete="on" onsubmit="event.preventDefault();")
                div.row
                    div.col-xs.ta-right
                        div.card-logo(:class="'logo-' + card.issuer.slug.toLowerCase()")
                        span.label.bank-name {{card.issuer.name}}

                div.row
                    div.col-xs.ta-right
                        span.label {{$i18n.t('card.iban') | persianNumbers}}:
                    div.col-xs.ta-left
                        span.label {{card.iban}}

                div.row
                    input.ta-left.dir-ltr(v-focus="" v-validate="{ rules: {required: true, max: 19}}" maxlength="19" v-bind:data-vv-as="$i18n.t('card.pan')" :class="{'input-danger': errors.has('pan')}" type="text" v-model="pan" name="pan" :placeholder="$i18n.t('card.pan')" id="pan" @keyup="cardNumberFormat()")
                    div.ta-right(v-if="validation('pan')")
                        span.text-danger {{ errors.first('pan') }}

                div.row.no-margin
                    div.col-lg-6.col-md-4.col-xs-12.ta-right.nav-expiration-label
                        span.label.expiration-label {{ $i18n.t('card.expiredDate') }}:
                    div.col-lg-6.col-md-8.col-xs-12.no-margin
                        div.row.nav-expiration-input
                            div.col-xs.no-margin
                                span.label {{$i18n.t('card.month')}}:
                                input#month(v-validate="{ rules: {required: true, numeric: true, max_value: 12}}" v-bind:data-vv-as="$i18n.t('card.month')" :class="{'input-danger': errors.has('month')}" type="text" v-model="month" name="month" :placeholder= "$i18n.t('card.month')" maxlength="2" @keyup="changeMonthFocus")
                            div.col-xs.no-margin
                                span.label {{$i18n.t('card.year')}}:
                                input#year(v-validate="{ rules: {required: true, numeric: true}}" v-bind:data-vv-as="$i18n.t('card.year')" :class="{'input-danger': errors.has('year')}" type="text" v-model="year" name="year" :placeholder= "$i18n.t('card.year')"  maxlength="4" @keyup="changeYearFocus")

                        div.ta-right
                            div.text-danger(v-if="validation('year')") {{ errors.first('year') }}
                            div.text-danger(v-if="validation('month')") {{ errors.first('month') }}


                div.row
                    div.col-xs.no-margin
                        button.btn.success.pull-left(v-ripple="" @click="validateForm") {{$i18n.t('common.save')}}
                            svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

</template>


<script>
    import modal from '../../partials/modal.vue';

    export default {
        name: 'pages-card-partials-edit',
        data() {
            return {
                loading: false,
                closeModalContent: true,
                pan: '',
                month: '',
                year: '',
            }
        },
        props: ['card'],
        mounted(){
            this.closeModalContent = false;
        },
        computed: {
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            }
        },
        created(){
//            this.pan = this.card.pan;
            store.commit('clearValidationErrors');
            let jalaliExpiredDate = moment(this.card.expired_at, 'YYYY-MM-DD').format('jYYYY-jMM-jDD');
            this.year = moment(jalaliExpiredDate).year();
            this.month = jalaliExpiredDate.substr(5, 2);
        },
        methods: {
            validation(name) {
                if (this.$store.state.alert.validationErrors[name]) {
                    this.errors.add(
                        name,
                        this.$validator.dictionary.container.fa.messages[this.$store.state.alert.validationErrors[name].rule](
                            this.$validator.fields.find(name).el.getAttribute('data-vv-as'),
                            this.$store.state.alert.validationErrors[name].params
                        ),
                        'api'
                    );
                    this.$store.state.alert.validationErrors[name] = false;
                }
                return this.errors.has(name);
            },
            validateForm() {
                this.$validator.validateAll({
                    pan: this.pan,
                    year: this.year,
                    month: this.month
                }).then((result) => {
                    if (result) {
                        this.editCard();
                    }
                });
            },
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
                this.$emit('closeModal');
                store.commit('clearValidationErrors');
            },
            editCard() {
                this.loading = true;

                if (this.year > 3150 || this.month > 12) {
                    store.commit('flashMessage', {
                        text: 'invalid-date',
                        type: 'danger'
                    });
                    this.loading = false;
                    return;
                }

                let params = {
                    cardId: this.card.entity_id
                };

                let formatedPan = this.pan.split('-').join('');
                let expiredAt = this.jalaliToGregorian(this.year, this.month);
                let cardData = {
                    pan: formatedPan,
                    expired_at: expiredAt,
                };

                this.$store.state.http.requests['card.getShow'].update(params, cardData).then(
                    () => {
                        this.changeCardState();
                        this.loading = false;
                        this.closeModal();
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
            changeCardState(){
                let vm = this;
                let cardIndex = _.findIndex(this.$store.state.auth.user.cards, function (card) {
                    return card.entity_id === vm.card.entity_id;
                });

                let expiredAt = this.jalaliToGregorian(this.year, this.month);
                this.$store.state.auth.user.cards[cardIndex].expired_at = expiredAt;
                this.$store.state.auth.user.cards[cardIndex].pan = this.pan;
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
                    setTimeout(() => {
                        document.getElementById("year").focus()
                    }, 10);
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
        },
        components: {
            modal
        }
    }

</script>