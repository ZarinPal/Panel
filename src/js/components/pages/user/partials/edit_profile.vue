<style>
    #map{
        height: 400px;
        width: 100%;
    }
</style>
<template lang="pug">
    div.inner-content
        div#map

        input(type="text" v-model="address" placeholder="آدرس")
        input(type="text" v-model="title" placeholder="عنوان")
        input(type="text" v-model="landLine" placeholder="شماره تلفن (ثابت)")
        input(type="text" v-model="postalCode" placeholder="کد پستی")


        div.row.nav-button
            div.col-xs
                button.btn.success.pull-left(v-ripple="" @click="postUserAddress" tabindex="9") {{$i18n.t('user.updateSetting')}}
                    svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                        circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

</template>


<script>
    export default {
        name: 'editProfile',
        data() {
            return {
                loading: false,
                address: null,
                landLine: null,
                postalCode: null,
                geoLocation: null,
                title: null
            }
        },
        created() {


        },
        mounted() {
            let tag = document.createElement("script");
            tag.src = "https://maps.googleapis.com/maps/api/js?language=fa&key=AIzaSyB7X9nJn_ArXOJsGIYiuY4pvrqAVFk_GK4";
            document.getElementsByTagName("head")[0].appendChild(tag);
            let vm = this;
            tag.onload = () => {
                vm.initMap();
            };
        },
        methods: {
            initMap() {
                let map, infoWindow;
                let vm = this;
                map = new google.maps.Map(document.getElementById('map'), {
                    center: {lat: -34.397, lng: 150.644},
                });
                infoWindow = new google.maps.InfoWindow;

                // Try HTML5 geolocation.
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        let pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };

                        //set current location to variable
                        vm.geoLocation = position.coords.latitude + ',' + position.coords.longitude;

                        let geocoder = new google.maps.Geocoder;

                        //get current location address
                        vm.geocodeLatLng(geocoder, map, infoWindow, vm.geoLocation);

                        infoWindow.setContent('جستجوی آدرس');
                        map.setCenter(pos);

                        /*** Change marker position ***/
                        google.maps.event.addListener(map, "click", function (position) {
                            //get selected location address
                            vm.geocodeLatLng(geocoder, map, infoWindow, position.latLng.lat() + ',' + position.latLng.lng());

                            //update current location
                            vm.geoLocation = position.latLng.lat() + ',' + position.latLng.lng();
                        });

                    }, () => {
                        this.handleLocationError(true, infoWindow, map.getCenter());
                    });
                } else {
                    // Browser doesn't support Geolocation
                    this.thishandleLocationError(false, infoWindow, map.getCenter());
                }
            },
            handleLocationError(browserHasGeolocation, infoWindow, pos) {
                infoWindow.setPosition(pos);
                infoWindow.setContent(browserHasGeolocation ?
                    'Error: The Geolocation service failed.' :
                    'Error: Your browser doesn\'t support geolocation.');
                infoWindow.open(map);
            },
            /*** Get location Address by geoLocation***/
            geocodeLatLng(geocoder, map, infowindow, geoLocation) {
                let vm = this;
                let latlngStr = geoLocation.split(',', 2);
                let latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};

                let marker = new google.maps.Marker({
                    position: latlng,
                    map: map
                });

                geocoder.geocode({'location': latlng}, function (results, status) {
                    if (status === 'OK') {
                        if (results[1]) {
                            map.setZoom(15);

                            marker.setMap(null);
                            marker.setPosition(latlng);

                            /*** Address text ***/
                            vm.address = vm.rightToLeftAddress(results[1].formatted_address);
                            infowindow.setContent(results[1].formatted_address);
                            infowindow.open(map, marker);
                        } else {
                            window.alert('No results found');
                        }
                    } else {
                        window.alert('Geocoder failed due to: ' + status);
                    }
                });
             },
            postUserAddress() {
                let userData = {
                    address: this.address,
                    landline: this.landLine,
                    postal_code: this.postalCode,
                    geo_location: this.geoLocation,
                    title: this.title
                };

                this.$store.state.http.requests['user.postAddress'].save(userData).then(
                    ()=> {
                        this.loading = false;
                        this.$router.push({name: 'user.index'})
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
            rightToLeftAddress(address) {
                return address.split("،").reverse().join("-")
            }
        },
    }
</script>