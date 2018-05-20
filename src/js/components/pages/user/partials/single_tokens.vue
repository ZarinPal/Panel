<template lang="pug">
  transition(name="fade"
  enter-active-class="fade-in"
  leave-active-class="fade-out")

    div.nav-address(@mouseover="visibleCloseIcon = true" @mouseleave="visibleCloseIcon = false")
      div.nav-address-title
        transition(name="fade"
        enter-active-class="fade-in"
        leave-active-class="fade-out")


      div.row.transaction-row.ta-center

        div.col-xs-1
          span {{ this.address.id }}
        div.col-xs
          span {{ this.address.client }}
          span(v-if="this.address.is_current_session") (نشست فعلی)
        div.col-xs
          span {{ this.address.ip }}
        div.col-xs
          span {{ this.address.last_seen | fromNow }}
        div.col-xs-1
          span حذف



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
  import selectbox from '../../partials/selectbox.vue';

  export default {
    name: 'single-address',
    data() {
      return {
        address: {
          title: null,
        },
        confirmVisible: false,
        confirm: false,
      }
    },
    props: ['singleAddress'],
    created() {
      this.initAddress();
    },
    methods: {
      initAddress() {
        if (this.singleAddress) {
          this.address.id = this.singleAddress.id;
          this.address.ip = this.singleAddress.ip;
          this.address.client = this.singleAddress.client;
          this.address.is_current_session = this.singleAddress.is_current_session;
          this.address.last_seen = this.singleAddress.last_seen;
          this.address.user_agent = this.singleAddress.user_agent;
        }
      },
      /*** Send data to parent ***/
      deleteAddress() {
        this.address.id = this.singleAddress.id;
        this.$emit('deleteAddress', this.address);
      },
      closeModal() {
        this.updateAddress();
        this.visibleMap = false;
        this.confirmVisible = false;
        let body = document.getElementById('body');
        body.classList.remove("no-scroll");
      },
    },
    components: {
      confirm
    }
  }
</script>