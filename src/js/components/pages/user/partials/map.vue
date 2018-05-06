<style>
    #map {
        height: 400px;
        width: 100%;
    }
</style>
<template lang="pug">
    div.nav-map
        transition(name="fade"
        enter-active-class="fade-in"
        leave-active-class="fade-out")
            div.modal(v-on:click.self="closeModal()")

        div.modal-content-father
            transition(name="zoom"
            enter-active-class="zoom-in"
            leave-active-class="zoom-out")
                div.row.center-xs.modal-content(v-if="!closeModalContent")
                    div.col-lg-11.col-md-11.col-sm-12.col-xs-12
                        span.icon-big-close(@click="closeModal()")
                        div.body
                            div.contains
                                div#map


</template>


<script>
    export default {
        name: 'map',
        data() {
            return {
                address: null,
                geoLocation: null,
                closeModalContent: true,
            }
        },
        created() {


        },
        mounted() {
            //Close modal
            this.closeModalContent = false;


            let vm = this;
            //Load google map script tag
            let tag = document.createElement("script");
            tag.src = "https://maps.googleapis.com/maps/api/js?language=fa&key=AIzaSyB7X9nJn_ArXOJsGIYiuY4pvrqAVFk_GK4";
            document.getElementsByTagName("head")[0].appendChild(tag);
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
//                            vm.address = vm.rightToLeftAddress(results[0].formatted_address);
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
            rightToLeftAddress(address) {
                return address.split("،").reverse().join("-");
            },
            closeModal() {
                this.$emit('closeModal');
                let locationData = {
                    address: this.address,
                    geoLocation: this.geoLocation
                };
                this.$emit('locationData', locationData);
            }
        },
    }
</script>