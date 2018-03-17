<template lang="pug">
    modal.request-zarin-card(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('card.requestZarinCardTitle') }}
        div(slot="content")
            div(v-if="user.cards.length == 0")
                div.font-s-18
                    span {{ $i18n.t('card.noActiveCard') }}

                div.row.m-t-25.m-b-10
                    div.col-xs.nav-buttons.ta-center
                        router-link.btn.success(tag="button" v-bind:to="{ name: 'card.index'}") {{$i18n.t('card.addNewBankAccount')}}

            form(v-else autocomplete="on" onsubmit="event.preventDefault();")
                div.body
                    div.row.no-margin
                        purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(@click.native="removeErrors('purse_number')" v-focus="" v-validate="{ rules: {required: true}}" name="purse_number" v-model="purse_number" v-bind:data-vv-as="$i18n.t('user.purse')" v-on:select="selectedPurse" placeholder="انتخاب کیف‌پول" :class="{'input-danger': errors.has('purse_number')}" tabindex="5")
                        div.ta-right(v-if="validation('purse_number')")
                            span.text-danger {{ errors.first('purse_number') }}

                    p.user-information-description.ta-right {{ $i18n.t('card.requestZarinCardDescriptionOfUserInformation') }}

                    loading(v-if="!isLoadedAddress")
                    selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-else v-validate="{ rules: {required: true}}" name="address_id" v-model="address_id" v-bind:data-vv-as="$i18n.t('user.userAddress')" :class="{'input-danger': errors.has('address_id')}" v-on:select="selectAddress" v-bind:data="addresses" :placeholder="$i18n.t('user.userAddress')")
                    div.ta-right(v-if="validation('address_id')")
                        span.text-danger {{ errors.first('address_id') }}

                    div.user-information-box.ta-right
                        div {{ $i18n.t('user.firstName') }} : {{ user.name }}
                        div {{ $i18n.t('user.userAddress') }} : {{ addressTitle }}
                        div.persian-num {{ $i18n.t('user.postal') }} : {{ addressPostalCode }}
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
    import selectbox from '../../partials/selectbox.vue';
    import loading from '../../../pages/partials/loading.vue';

    export default {
        name: "request-zarin-card",
        data() {
            return {
                requesting: false,
                isGettingCouponCost: true,
                acceptInformation: false,

                purse_number: null,
                fullAddresses: {},
                addresses: {},
                isLoadedAddress: false,
                address_id: null,
                addressTitle: null,
                addressPostalCode: null,
                coupon: {},
            }
        },
        computed: {
            user(){
                return this.$store.state.auth.user;
            },
        },
        created() {
            this.getAddresses();

            this.getCouponData();
        },
        methods: {
            /**
             * Validation
             * @param name
             */
            validateForm() {
                this.$validator.validateAll({
                    purse_number: this.purse_number,
                    address_id: this.address_id,
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
            getAddresses() {
                let vm = this;
                this.$store.state.http.requests['user.postAddress'].get().then(
                    (response) => {
                        if (response.data.data.length) {
                            vm.fullAddresses = response.data.data;
                            vm.addresses = response.data.data.map(function (address) {
                                return {
                                    'title': address.address,
                                    'value': address.entity_id
                                }
                            });
                        }
                        vm.isLoadedAddress = true;
                    },
                    (response) => {
                        store.commit('flashMessage', {
                            text: response.data.meta.error_type,
                            important: false,
                            type: 'danger'
                        });
                    }
                );
            },
            goAddAddress() {
                this.$router.push({name: 'user.addAddress'})
            },
            selectedPurse(purseId) {
                this.purse_number = purseId;
            },
            selectAddress(addressId) {
                let vm = this;
                this.address_id = addressId;

                let addressIndex = _.findIndex(vm.fullAddresses, function (address) {
                    return address.entity_id === addressId;
                });

                vm.addressTitle = vm.fullAddresses[addressIndex].title;
                vm.addressPostalCode = vm.fullAddresses[addressIndex].postal_code;
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
                    address_id: this.address_id,
                    coupon: this.coupon.coupon,
                };

                this.$store.state.http.requests['zarincard.postRequestIssue']
                    .save(zarinCardDate)
                    .then(
                        () => {
                            this.requesting = false;

                            store.commit('flashMessage', {
                                text: 'ZarinCardRequestSuccessLocal',
                                timeout: 10000,
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
            selectbox,
            loading
        }
    }
</script>