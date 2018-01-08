<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                p.page-title {{ $i18n.t('user.addNewAddress') }}
                p.page-description {{ $i18n.t('user.addNewAddressDescription') }}

        form(autocomplete="on" onsubmit="event.preventDefault();")
            div.row.section.nav-add-address
                div.box.full-width
                    div.address-box(id="addressBox" v-if="isLoadedAddress")
                        span(v-for="(address,key) in addresses")
                            address-book.address-book(v-bind:singleAddress="address" v-bind:id="address.id" v-on:getAddresses="getAddresses" v-on:updateAddress="updateAddress" v-on:deleteAddress="deleteAddress")

                    div.ta-center(v-else)
                        loading
                    <!--Button add new address-->
                    div.row
                        div.col-xs.ta-center
                            span.btn-add-new-address(@click="addNewAddress()")
                                span.icon-add
                                span {{$i18n.t('user.addNewAddress')}}

                    div.row.nav-button
                        div.col-xs
                            button.btn.success.pull-left(v-ripple="" @click="postUserAddress" tabindex="9") {{$i18n.t('user.updateSetting')}}
                                svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                    circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

</template>


<script>
    import addressBook from './address.vue';
    import loading from '../../partials/loading.vue';

    export default {
        name: 'addAddress',
        data() {
            return {
                loading: false,
                getAddressesData: null,
                addressCount: 1,
                addresses: [],
                isLoadedAddress: false,
            }
        },
        computed: {
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
        },
        created() {
            store.commit('clearValidationErrors');
            this.getAddresses();
        },
        methods: {
            getAddresses() {
                this.$store.state.http.requests['user.postAddress'].get().then(
                    (response) => {
                        if (response.data.data.length) {
                            this.addresses = response.data.data;
                            let addressCounter = 1;
                            _.forEach(this.addresses, function (address) {
                                address.id = addressCounter++;
                            });
                        }

                        if (!this.addresses.length) {
                            this.addNewAddress();
                        }
                        this.isLoadedAddress = true;
                    },
                    (response) => {
                        store.commit('flashMessage', {
                            text: response.data.meta.error_message,
                            important: false,
                            type: 'danger'
                        });
                    }
                );
            },
            addNewAddress() {
                this.addresses.push({
                    id: this.addresses.length + 1,
                    data: {
                        address: null,
                        landline: null,
                        postal_code: null,
                        geo_location: null,
                        title: null
                    }
                });
            },
            //update from address child on input change not request to api
            updateAddress(address) {
                let addressIndex = _.findIndex(
                    this.addresses,
                    function (originalsAddress) {
                        return originalsAddress.id === address.id;
                    }
                );
                this.addresses[addressIndex] = address;
            },
            deleteAddress(address) {
                if (address.entity_id) {
                    this.$store.state.http.requests['user.getAddress'].delete({id: address.entity_id}).then(
                        () => {
                            let elem = document.getElementById(address.id);
                            elem.parentNode.removeChild(elem);

                            _.remove(this.addresses, function (singleAddress) {
                                return singleAddress.id == address.id;
                            });
                        },
                        (response) => {
                            store.commit('flashMessage', {
                                text: response.data.meta.error_message,
                                important: false,
                                type: 'danger'
                            });
                        }
                    );
                } else {
                    let elem = document.getElementById(address.id);
                    elem.parentNode.removeChild(elem);

                    _.remove(this.addresses, function (singleAddress) {
                        return singleAddress.id == address.id;
                    });
                }
            },
            postUserAddress() {
                this.loading = true;
                let addresses = this.addresses;
                // _.forEach(addresses, function(address) {
                //     delete address.id;
                // });

                this.$store.state.http.requests['user.postAddress'].save({'addresses': addresses}).then(
                    () => {
                        store.commit('flashMessage', {
                            text: 'your address added success',
                            important: false,
                            type: 'success'
                        });
                        this.loading = false;

                        //this run in user level up
                        this.$emit('incrementUserLevelUpStep');

                        // this.$router.push({name: 'home.index'})
                    },
                    (response) => {
                        store.commit('setValidationErrors', response.data.validation_errors);
                        store.commit('flashMessage', {
                            text: response.data.meta.error_message,
                            important: false,
                            type: 'danger'
                        });
                        this.loading = false;
                    }
                );
            },
        },
        components: {
            'address-book': addressBook,
            confirm,
            loading
        }
    }
</script>