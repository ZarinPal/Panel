<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                p.page-title {{ $i18n.t('user.addNewAddress') }}
                p.page-description {{ $i18n.t('user.addNewAddressDescription') }}

        form(autocomplete="on" onsubmit="event.preventDefault();")
            div.row.section.nav-add-address
                div.box.full-width
                    div.address-box(id="addressBox")
                        <!--address dom-->
                        span(v-for="address in addressCount")
                            address-book.address-book(:id="address" v-bind:addressId="address" v-on:updateAddress="updateAddress" v-on:deleteAddress="deleteAddress")

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

    export default {
        name: 'editProfile',
        data() {
            return {
                loading: false,
                addressCount: 1,
                address: {}
            }
        },
        computed:{
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
        },
        methods: {
//            getAddresses() {
//                this.$store.state.http.requests['user.postAddress'].get().then(
//                    (response)=> {
//                        this.getAddressesData = response.data.data;
//                        this.addressCount = response.data.data.length;
//                        this.isLoadedAddress = true;
//                    },
//                    (response) => {
//                        store.commit('flashMessage',{
//                            text: response.data.meta.error_message,
//                            important: false,
//                            type: 'danger'
//                        });
//                    }
//                );
//            },
            addNewAddress() {
                this.addressCount++;
            },
            //update from address child on input change not request to api
            updateAddress(address) {
                this.address[address.index] = address.address;
            },
            deleteAddress(address) {
                this.$store.state.http.requests['user.getAddress'].delete({landline: address.landline}).then(
                    ()=> {
                        delete this.address[address.index];
                        let elem = document.getElementById(address.index);
                        return elem.parentNode.removeChild(elem);
                    },
                    (response) => {
                        store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            important: false,
                            type: 'danger'
                        });
                    }
                );
            },
            postUserAddress() {
                this.$store.state.http.requests['user.postAddress'].save({'addresses': this.address}).then(
                    ()=> {
                        store.commit('flashMessage',{
                            text: 'your address added success',
                            important: false,
                            type: 'success'
                        });
                        this.loading = false;
                        this.$router.push({name: 'home.index'})
                    },
                    (response) => {
                        store.commit('setValidationErrors',response.data.validation_errors);
                        store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            important: false,
                            type: 'danger'
                        });
                        this.loading = false;
                    }
                );
            },
        },
        components:{
            'address-book': addressBook
        }
    }
</script>