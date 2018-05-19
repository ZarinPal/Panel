<template lang="pug">

  transition(name="fade"
  enter-active-class="fade-in"
  leave-active-class="fade-out")
    div.nav-profile-dropdown(id="navProfileDropdown")
      div.head
        img.avatar(:src="user.avatar")
        span.name(:title="user.name") {{user.name | less}}
        span.zp-id.persian-num {{user.mobile}}
      div.body
        router-link.items(v-ripple="" tag='div' v-bind:to="{ name: 'user.addAddress'}")
          span.icon.location {{$i18n.t('user.addNewAddress')}}
        router-link.items(v-ripple="" tag='div' v-bind:to="{ name: 'user.tokens'}")
          span.icon {{$i18n.t('user.tokens')}}
        router-link.items(v-ripple="" tag='div' v-bind:to="{ name: 'user.notificationSetting'}")
          span.icon.notif {{$i18n.t('user.notificationSetting')}}

        div.divider
        div.items(id="btnLogout" v-ripple="" @click="confirmVisible = true")
          span.icon.logout {{$i18n.t('common.logout')}}

        <!--Logout confirm dialog-->
        confirm(v-if="confirmVisible" v-on:confirmed="logout()" v-on:closeModal="closeModal" :keepConfirmedOpen="true")
          span(slot="title") {{$i18n.t('common.logout')}}
          div.ta-right(slot="message")
            div(v-if="!showLoading") آیا برای خروج از زرین‌پال مطمئن هستید ؟
            div(v-if="showLoading")
              div.ta-center لطفا چند لحظه صبر کنید
                loading

          span(slot="messageDanger" ) {{$i18n.t('common.cancel')}}
          span(slot="messageSuccess") بله، خارج می‌شوم
</template>

<script>
  import confirm from '../confirm.vue';
  import loading from '../../../pages/partials/loading.vue';

  export default {
    name: 'profile-drop-down',
    data() {
      return {
        confirmVisible: false,
        confirm: false,
        showLoading: false,
      }
    },
    computed: {
      user() {
        return this.$store.state.auth.user;
      }
    },
    methods: {
      closeModal(){
        this.confirmVisible = false;
      },
      logout(){
        this.confirm = true;
        if (this.confirm) {
          this.showLoading = true;
          this.$store.dispatch('auth/logout', this);
        }
      },
    },
    components: {
      confirm,
      loading
    }
  };
</script>