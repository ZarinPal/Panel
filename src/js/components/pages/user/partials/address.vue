<template lang="pug">
    transition(name="fade"
    enter-active-class="fade-in"
    leave-active-class="fade-out")

        div.nav-address
            div.nav-address-title(@mouseover="visibleCloseIcon = true" @mouseleave="visibleCloseIcon = false")
                transition(name="fade"
                enter-active-class="fade-in"
                leave-active-class="fade-out")
                    span.close-address(@click="deleteAddress" v-if="addressId > 1 && visibleCloseIcon")

                span.address-title(v-if="addressId > 1" ) {{$i18n.t('user.addressTitle') + ' ' + addressId | persianNumbers}}
            div.row.z-row
                div.col-lg-4.col-md-4.col-sm-4.col-xs-12
                    span.input-icon.icon-title
                    input(:class="{'input-danger': validationErrors['addresses.'+addressId+'.title']}" type="text" v-model="address.title" @input="updateAddress" placeholder="عنوان")
                    div.ta-right(v-if="validationErrors['addresses.'+addressId+'.title']")
                        span.text-danger {{ $i18n.t(validationErrors['addresses.'+addressId+'.title']) }}

                div.col-lg-4.col-md-4.col-sm-4.col-xs-12
                    span.input-icon.icon-tel
                    input(v-validate="{type: 'number', size:14}" :class="{'input-danger': validationErrors['addresses.'+addressId+'.landline']}" type="text" v-model="address.landline" @input="updateAddress" placeholder="شماره تلفن (ثابت)")
                    div.ta-right(v-if="validationErrors['addresses.'+addressId+'.landline']")
                        span.text-danger {{ $i18n.t(validationErrors['addresses.'+addressId+'.landline']) }}

                div.col-lg-4.col-md-4.col-sm-4.col-xs-12
                    span.input-icon.icon-postal-code
                    input(v-validate="{type: 'number', size:10}" :class="{'input-danger': validationErrors['addresses.'+addressId+'.postal_code']}" type="text" v-model="address.postal_code"  @input="updateAddress" placeholder="کد پستی")
                    div.ta-right(v-if="validationErrors['addresses.'+addressId+'.postal_code']")
                        span.text-danger {{ $i18n.t(validationErrors['addresses.'+addressId+'.postal_code'])}}

            div.row.z-row
                div.col-lg-9.col-md-9.col-sm-12.col-xs-12
                    input.dir-ltr(:class="{'input-danger': validationErrors['addresses.'+addressId+'.address']}" type="text" v-model="address.address"  @input="updateAddress" placeholder="آدرس")
                    div.ta-right(v-if="validationErrors['addresses.'+addressId+'.address']")
                        span.text-danger {{ $i18n.t(validationErrors['addresses.'+addressId+'.address']) }}

                div.col-lg-3.col-md-3.col-sm-12.col-xs-12(@click="visibleMap = true")
                    div.btn-show-location(:class="{'input-danger': validationErrors['addresses.'+addressId+'.geo_location']}") {{ $i18n.t('user.positionOnTheMap') }}
                        span.icon-location
                    div.ta-right(v-if="validationErrors['addresses.'+addressId+'.geo_location']")
                        span.text-danger {{ $i18n.t(validationErrors['addresses.'+addressId+'.geo_location']) }}


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
                visibleCloseIcon: false,
                visibleMap: false,
                closeModalContent: true,
                address: {
                    address: null,
                    landline: null,
                    postal_code: null,
                    geo_location: null,
                    title: null
                }
            }
        },
        computed:{
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
        },
        created() {

        },
        methods: {
            /*** get location data from map component ***/
            locationData(location) {
                this.address.geo_location = location.geoLocation;
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
                this.$emit('deleteAddress', {index: this.addressId, landline: this.address.landline});
            },
            closeModal(){
                this.updateAddress();
                this.visibleMap = false;
            },
        },
        components:{
            'google-map': map,
        }
    }
</script>