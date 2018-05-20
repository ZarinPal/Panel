<template lang="pug">
  div.inner-content
    div.row.nav-page-header
      div.col-lg-6.col-md-6.col-sm-12.col-xs-12
        p.page-title {{ $i18n.t('user.showTokens') }}
        p.page-description {{ $i18n.t('user.showTokensDescription') }}

    div.row.section.nav-add-address
      div.box.full-width
        div.address-box(id="addressBox" v-if="isLoadedAddress")
          div.row.transaction-fields-title
            div.col-xs-1
              span #
            div.col-xs
              span محل
            div.col-xs
              span آی پی
            div.col-xs
              span اخرین مشاهده
            div.col-xs-1
              span حذف
          span(v-for="(address,key) in addresses")
            singleToken.address-book(v-bind:singleAddress="address" v-bind:id="address.id" v-on:getAddresses="getAddresses" v-on:updateAddress="updateAddress" v-on:deleteAddress="deleteAddress")

        div.ta-center(v-else)
          loading


</template>

<script>
  import singleToken from './single_tokens.vue';
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
        this.$store.state.http.requests['oauth.userTokens'].get().then(
            (response) => {
              if (response.data.data.length) {
                this.addresses = response.data.data;
                let addressCounter = 1;
                _.forEach(this.addresses, function(address) {
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
                text: response.data.meta.error_type,
                important: false,
                type: 'danger'
              });
            }
        );
      },
      addNewAddress() {
        this.addresses.push({
          id: this.addresses.length + 1001,
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
            function(originalsAddress) {
              return originalsAddress.id === address.id;
            }
        );
        this.addresses[addressIndex] = address;
      },
      deleteAddress(address) {
        if (address.entity_id) {
          this.$store.state.http.requests['user.getAddress'].delete(
              {id: address.entity_id}).then(
              () => {
                let elem = document.getElementById(address.id);
                elem.parentNode.removeChild(elem);
                _.remove(this.addresses, function(singleAddress) {
                  return singleAddress.id == address.id;
                });
              },
              (response) => {
                store.commit('flashMessage', {
                  text: response.data.meta.error_type,
                  important: false,
                  type: 'danger'
                });
              }
          );
        } else {
          let elem = document.getElementById(address.id);
          elem.parentNode.removeChild(elem);

          _.remove(this.addresses, function(singleAddress) {
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

        this.$store.state.http.requests['user.postAddress'].save(
            {'addresses': addresses}).then(
            () => {
              store.commit('flashMessage', {
                text: 'UserAddressAddedSuccessLocal',
                important: false,
                type: 'success'
              });
              this.loading = false;

              //this run in user level up
              this.$emit('incrementUserLevelUpStep');

              // this.$router.push({name: 'home.index'})
            },
            (response) => {
              store.commit('setValidationErrors',
                  response.data.validation_errors);
              store.commit('flashMessage', {
                text: response.data.meta.error_type,
                important: false,
                type: 'danger'
              });
              this.loading = false;
            }
        );
      },
    },
    components: {
      'singleToken': singleToken,
      confirm,
      loading
    }
  }
</script>