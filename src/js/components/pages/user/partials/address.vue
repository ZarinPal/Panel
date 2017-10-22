<template lang="pug">
    transition(name="fade"
    enter-active-class="fade-in"
    leave-active-class="fade-out")

        div.nav-address(@mouseover="visibleCloseIcon = true" @mouseleave="visibleCloseIcon = false")
            div.nav-address-title
                transition(name="fade"
                enter-active-class="fade-in"
                leave-active-class="fade-out")
                    span.close-address(@click="confirmVisible = true" v-if="addressId > 1 && visibleCloseIcon")

                span.address-title(v-if="addressId > 1" ) {{$i18n.t('user.addressTitle') + ' ' + addressId | persianNumbers}}
            div.row.z-row

                div.col-lg-4.col-md-4.col-sm-4.col-xs-12
                    input(v-validate="'required|max:255'" v-bind:data-vv-as="$i18n.t('user.addressTitlePlaceholder')"  :class="{'input-danger': errors.has('addresses.'+ (addressId -1) + '.title')}" type="text" v-model="address.title" :name="'addresses.'+ (addressId -1) +'.title'" @input="updateAddress" :placeholder="$i18n.t('user.addressTitlePlaceholder')")
                    div.ta-right(v-if="validation('addresses.'+ (addressId -1) +'.title')")
                        span.text-danger {{ errors.first('addresses.'+ (addressId -1) +'.title') }}


                div.col-lg-4.col-md-4.col-sm-4.col-xs-12
                    span.input-icon.icon-tel
                    input(v-validate="{ rules: {required: true, numeric: true, regex: /^0[1-8][0-9]{3,10}$/} }" v-bind:data-vv-as="$i18n.t('user.addressLandlinePlaceholder')" :class="{'input-danger': errors.has('addresses.'+ (addressId -1) + '.landline')}" type="text" v-model="address.landline" :name="'addresses.'+ (addressId -1) +'.landline'" @input="updateAddress" :placeholder="$i18n.t('user.addressLandlinePlaceholder')")
                    div.ta-right(v-if="validation('addresses.'+ (addressId -1) +'.landline')")
                        span.text-danger {{ errors.first('addresses.'+ (addressId -1) +'.landline') }}


                div.col-lg-4.col-md-4.col-sm-4.col-xs-12
                    span.input-icon.icon-postal-code
                    input(v-validate="{ rules: {required: true, numeric: true} }" v-bind:data-vv-as="$i18n.t('user.addressPostalCodePlaceholder')" :class="{'input-danger': errors.has('addresses.'+ (addressId -1) + '.postal_code')}" type="text" maxlength="10" v-model="address.postal_code" :name="'addresses.'+ (addressId -1) +'.postal_code'" @input="updateAddress" :placeholder="$i18n.t('user.addressPostalCodePlaceholder')")
                    div.ta-right(v-if="validation('addresses.'+ (addressId -1) +'.postal_code')")
                        span.text-danger {{ errors.first('addresses.'+ (addressId -1) + '.postal_code') }}

            div.row.z-row
                div.col-lg-12.col-md-12.col-sm-12.col-xs-12
                    input(v-validate="'required|max:255'" v-bind:data-vv-as="$i18n.t('user.addressPlaceholder')" :class="{'input-danger': errors.has('addresses.'+ (addressId -1) + '.address')}" type="text" v-model="address.address" :name="'addresses.'+ (addressId -1) +'.address'" @input="updateAddress" :placeholder="$i18n.t('user.addressPlaceholder')")
                    div.ta-right(v-if="validation('addresses.'+ (addressId -1) +'.address')")
                        span.text-danger {{ errors.first('addresses.'+ (addressId -1) +'.address') }}


                <!--div.col-lg-3.col-md-3.col-sm-12.col-xs-12(@click="visibleMap = true")-->
                    <!--div.btn-show-location(:class="{'input-danger': validationErrors['addresses.'+ (addressId -1) +'.geo_location'], 'has-geo-location': address.geo_location}")-->
                        <!--span(v-if="!address.geo_location") {{ $i18n.t('user.positionOnTheMap') }}-->
                        <!--span(v-else) {{address.geo_location | persianNumbers}}-->

                        <!--span.input-icon.icon-location-->
                    div.ta-right(v-if="validationErrors['addresses.'+ (addressId -1) +'.geo_location']")
                        span.text-danger {{ $i18n.t(validationErrors['addresses.'+ (addressId -1) +'.geo_location']) }}

            <!--Show google map to select location-->
            google-map(v-if="visibleMap" v-on:locationData="locationData" v-on:closeModal="closeModal()")

            <!--Delete confirm-->
            confirm.row(v-if="confirmVisible" v-on:confirmed="deleteAddress()" v-on:closeModal="closeModal")
                span(slot="title") {{$i18n.t('user.deleteAddress')}}
                div.ta-right(slot="message")
                    div {{$i18n.t('common.doYouDelete')}}

                span(slot="messageDanger") {{$i18n.t('common.cancel')}}
                span(slot="messageSuccess") {{$i18n.t('easypay.yesDeleteIt')}}
</template>


<script>
    import map from './map.vue';
    import confirm from '../../partials/confirm.vue';

    export default {
        name: 'address',
        data() {
            return {
                visibleCloseIcon: false,
                visibleMap: false,
                closeModalContent: true,
                address: {
                    address: null,
                    landline: null,
                    postal_code: null,
                    geo_location: null,
                    title: null
                },
                confirmVisible: false,
                confirm: false,
            }
        },
        props: ['addressId', 'singleAddress'],
        computed:{
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
        },
        created() {
            this.initAddress();
        },
        methods: {
            validation(name) {
                if(this.$store.state.alert.validationErrors[name]) {
                    this.errors.clear();
                    this.errors.add(name, this.$store.state.alert.validationErrors[name], 'api');
                    this.$store.state.alert.validationErrors[name] = false;
                }
                return this.errors.has(name);
            },
            initAddress() {
                if(this.singleAddress) {
                    this.address.address = this.singleAddress.address;
                    this.address.landline = this.singleAddress.landline;
                    this.address.postal_code = this.singleAddress.postal_code;
                    this.address.geo_location = this.singleAddress.geo_location;
                    this.address.title = this.singleAddress.title;
                }
            },
            /*** get location data from map component ***/
            locationData(location) {
                this.address.geo_location = location.geoLocation;
//                this.address.address = location.address;
            },
            /*** Send data to parent ***/
            updateAddress() {
                let data = {
                    index: this.addressId,
                    address: this.address,
                };

                this.$emit('updateAddress', data);
            },
            deleteAddress() {
                this.$emit('deleteAddress', {index: this.addressId, landline: this.address.landline});
            },
            closeModal(){
                this.updateAddress();
                this.visibleMap = false;
                this.confirmVisible = false;
            },
        },
        components:{
            'google-map': map,
            confirm
        }
    }
</script>