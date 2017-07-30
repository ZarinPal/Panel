<style>
    #map{
        height: 200px;
        width: 100%;
    }
</style>
<template lang="pug">
    div.inner-content
        div#map
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
                geoLocation: null
            }
        },
        created() {

        },
        methods: {
            initMap() {
                let map, infoWindow;
                let vm = this;
                map = new google.maps.Map(document.getElementById('map'), {
                    center: {lat: -34.397, lng: 150.644},
                    zoom: 15
                });
                infoWindow = new google.maps.InfoWindow;



                // Try HTML5 geolocation.
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        let pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };

                        vm.geoLocation = position.coords.latitude + ',' + position.coords.longitude;

                        let geocoder = new google.maps.Geocoder;
                        //get current location address
                        vm.geocodeLatLng(geocoder, map, infoWindow, vm.geoLocation);

                        infoWindow.setPosition(pos);
                        infoWindow.setContent('Location found.');
                        infoWindow.open(map);
                        map.setCenter(pos);

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
            /*** Get location Address by getCode***/
            geocodeLatLng(geocoder, map, infowindow, geoLocation) {
                let vm = this;
                let latlngStr = geoLocation.split(',', 2);
                let latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
                geocoder.geocode({'location': latlng}, function (results, status) {
                    if (status === 'OK') {
                        if (results[1]) {
                            map.setZoom(11);
                            let marker = new google.maps.Marker({
                                position: latlng,
                                map: map
                            });
                            /*** Address text ***/
                            vm.address = results[1].formatted_address;
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
        },
        mounted() {
            let tag = document.createElement("script");
            tag.src = "https://maps.googleapis.com/maps/api/js?language=fa&key=AIzaSyB7X9nJn_ArXOJsGIYiuY4pvrqAVFk_GK4";
            document.getElementsByTagName("head")[0].appendChild(tag);
            let vm = this;
            tag.onload = () => {
                vm.initMap();
            };
        }

    }
</script>


