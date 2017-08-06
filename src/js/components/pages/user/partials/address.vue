<template lang="pug">
    div.nav-address
        span.close-address(@click="deleteAddress" v-if="addressId > 1")
        span.address-title(v-if="addressId > 1") {{$i18n.t('user.addressTitle') + ' ' + addressId | persianNumbers}}
        div.row.z-row
            div.col-lg-4.col-md-4.col-sm-4.col-xs-12
                span.input-icon.icon-title
                input(:class="{'input-danger': validationErrors.title}" type="text" v-model="address.title" @input="updateAddress" placeholder="عنوان")
                div.ta-right(v-if="validationErrors.title")
                    span.text-danger {{ $i18n.t(validationErrors.title) }}

            div.col-lg-4.col-md-4.col-sm-4.col-xs-12
                span.input-icon.icon-tel
                input(:class="{'input-danger': validationErrors.landline}" type="text" v-model="address.landLine" @input="updateAddress" placeholder="شماره تلفن (ثابت)")
                div.ta-right(v-if="validationErrors.landline")
                    span.text-danger {{ $i18n.t(validationErrors.landline) }}

            div.col-lg-4.col-md-4.col-sm-4.col-xs-12
                span.input-icon.icon-postal-code
                input(:class="{'input-danger': validationErrors.postal_code}" type="text" v-model="address.postalCode"  @input="updateAddress" placeholder="کد پستی")
                div.ta-right(v-if="validationErrors.postal_code")
                    span.text-danger {{ $i18n.t(validationErrors.postal_code) }}

        div.row.z-row
            div.col-lg-9.col-md-9.col-sm-12.col-xs-12
                input(:class="{'input-danger': validationErrors.address}" type="text" v-model="address.address"  @input="updateAddress" placeholder="آدرس")
                div.ta-right(v-if="validationErrors.address")
                    span.text-danger {{ $i18n.t(validationErrors.address) }}

            div.col-lg-3.col-md-3.col-sm-12.col-xs-12(@click="visibleMap = true")
                div.btn-show-location {{ $i18n.t('user.positionOnTheMap') }}
                    span.icon-location


        <!--Show google map to select location-->
        google-map(v-if="visibleMap" v-on:locationData="locationData" v-on:closeModal="closeModal()")

</template>


<script>
    import map from './map.vue';

    export default {
        name: 'address',
        props: ['addressId'],
        data() {
            return {
                visibleMap: false,
                closeModalContent: true,
                address: {
                    address: null,
                    landLine: null,
                    postalCode: null,
                    geoLocation: null,
                    title: null
                }
            }
        },
        computed:{
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
        },
        methods: {
            /*** get location data from map component ***/
            locationData(location) {
                this.address.geoLocation = location.geoLocation;
                this.address.address = location.address;
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
                this.$emit('deleteAddress', {index: this.addressId});
            },
            closeModal(){
                this.visibleMap = false;
            },
        },
        components:{
            'google-map': map,
        }
    }
</script>