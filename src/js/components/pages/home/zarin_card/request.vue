<template lang="pug">
    modal.request-zarin-card(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('card.requestZarinCardTitle') }}
        div(slot="content")
            form(autocomplete="on" onsubmit="event.preventDefault();")
                div.body
                    div.row.no-margin
                        purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(@click.native="removeErrors('purse')" v-focus=""  v-validate="{ rules: {required: true}}" name="purse" v-bind:data-vv-as="$i18n.t('user.purse')" v-on:select="selectedPurse" placeholder="انتخاب کیف‌پول" :class="{'input-danger': errors.has('purse')}" tabindex="5")
                        div.ta-right(v-if="validation('purse')")
                            span.text-danger {{ errors.first('purse') }}

                    p.user-information-description.ta-right {{ $i18n.t('card.requestZarinCardDescriptionOfUserInformation') }}

                    div.user-information-box.ta-right
                        div {{ $i18n.t('user.firstName') }} : {{ user.name }}
                        div(v-if="user.addresses[0].address") {{ $i18n.t('user.userAddress') }} : {{ user.addresses[0].address }}
                        div.persian-num(v-if="user.addresses[0].postal_code") {{ $i18n.t('user.postal') }} : {{ user.addresses[0].postal_code }}
                        div.text-danger(v-if="!user.addresses[0].address" @click="goAddAddress") {{ $i18n.t('user.userAddress') }} : {{ $i18n.t('user.addressEmpty') }}
                        div.text-danger(v-if="!user.addresses[0].postal_code" @click="goAddAddress") {{ $i18n.t('user.postal') }} : {{ $i18n.t('user.postalCodeEmpty') }}

                    div.row.zarin-card-request-box
                        div.col-xs.right-box
                            span {{ $i18n.t('card.zarinCardPrice') }}
                        div.col-xs.left-box
                            span.cost.persian-num {{coupon.cost | numberFormat}}
                            span.toman {{ ' ' + $i18n.t('transaction.toman') }}

                    div.row.accept-information-box
                        input(type="checkbox" v-model="acceptInformation" id="chkPermission")
                        label(for="chkPermission")
                            span
                            | {{ $i18n.t('card.acceptTopInformationOfRequestZarinCard') }}


                    div.row
                        div.col-xs.nav-buttons
                            button.btn.success.pull-left(v-ripple=""  @click="validateForm" tabindex="7") {{$i18n.t('card.requestZarinCardTitle')}}
                                svg.material-spinner(v-if="requesting" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                    circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

</template>

<script>
    import modal from '../../partials/modal.vue';
    import purse from '../../partials/purses.vue';

    export default {
        name: "request-zarin-card",
        data() {
            return {
                requesting: false,
                isGettingCouponCost: true,
                acceptInformation: false,

                purse_number: null,
                coupon: {},
            }
        },
        computed: {
            user(){
                return this.$store.state.auth.user;
            },
        },
        created() {
            this.getCouponData();
        },
        methods: {
            /**
             * Validation
             * @param name
             */
            validateForm() {
                this.$validator.validateAll({
                    purse: this.purse_number,
                }).then((result) => {
                    if (result) {
                        this.setRequestZarinCard();
                    }
                });
            },
            removeErrors: function (field) {
                !!this[field] && this.errors.remove(field);
            },
            closeModal() {
                this.$emit('closeModal')
            },
            goAddAddress() {
                this.$router.push({name: 'user.addAddress'})
            },
            selectedPurse(purseId) {
                this.purse_number = purseId;
            },
            getCouponData() {
                this.$store.state.http.requests['zarincard.cost']
                    .get()
                    .then((response) => {
                            this.coupon = response.data.data;

                            this.isGettingCouponCost = false;
                        }, (response) => {
                            store.commit('setValidationErrors', response.data.validation_errors);
                            store.commit('flashMessage', {
                                text: response.data.meta.error_type,
                                type: 'danger'
                            });
                        }
                    );
            },
            setRequestZarinCard() {
                if (!this.acceptInformation) {
                    store.commit('flashMessage', {
                        text: 'ZarinCardPleaseAcceptTopInformationLocal',
                        type: 'danger'
                    });
                    return false;
                }
                this.requesting = true;

                let zarinCardDate = {
                    purse_number: this.purse_number,
                    coupon: this.coupon.coupon,
                };

                this.$store.state.http.requests['zarincard.postRequestIssue']
                    .save(zarinCardDate)
                    .then(
                        () => {
                            this.requesting = false;

                            store.commit('flashMessage', {
                                text: 'ZarinCardRequestSuccessLocal',
                                important: true,
                                type: 'success'
                            });
                            this.$router.push({name: 'card.index'})
                        }, (response) => {
                            this.requesting = false;
                            store.commit('setValidationErrors', response.data.validation_errors);
                            store.commit('flashMessage', {
                                text: response.data.meta.error_type,
                                type: 'danger'
                            });
                        }
                    )
            }
        },
        components: {
            modal,
            purse,
        }
    }
</script>