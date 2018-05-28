<template lang="pug">
  transition(name="fade"
  enter-active-class="fade-in"
  leave-active-class="fade-out")

    div.token-row(@mouseover="visibleCloseIcon = true" @mouseleave="visibleCloseIcon = false")
      div.row.ta-center
        div.logo-width
          div(v-bind:class="{'device-logo-active': this.tokens.is_current_session}").device-logo
            div(v-bind:class="{'panel-logo-active': this.tokens.is_current_session ,'panel-logo': this.tokens.client_identifier == 'panel-client' ||  this.tokens.client_identifier == 'payment-gateway-client','ios-logo': this.tokens.client_identifier == 'ios-client','android-logo': this.tokens.client_identifier == 'android-client','web-logo': this.tokens.client_identifier != 'android-client' && this.tokens.client_identifier != 'ios-client' && this.tokens.client_identifier != 'panel-client' &&  this.tokens.client_identifier != 'payment-gateway-client' }")
        div.col-xs
          div.ta-right
            span.device-name {{ this.tokens.client }}
          div.ta-right
            img.p-l-5.flag-icon.pull-right.nav-flag(:src="flagUrl" :title="flagCountryName")
            span.row.token-detail.p-t-10 {{ this.tokens.ip }}
              span.hidden-xs.token-detail(v-if="this.tokens.is_current_session" ) ({{$i18n.t('user.currentSession')}})
        div.col-xs.p-l-10
          div.ta-left
            span.clock-logo
            span.token-detail.hidden-xs {{$i18n.t('user.lastSeen')}}:
            span.token-detail  {{  this.tokens.last_seen | fromNow }}

          div.ta-left
            span.hand.close.p-t-10(:title="$i18n.t('user.deleteToken')" @click="confirmVisible = true" v-if="!this.tokens.is_current_session" ) {{$i18n.t('user.deleteToken')}}
            <!--span.hand.close.p-t-10(:title="$i18n.t('user.deleteAllTokens')" @click="confirmVisibleDeleteAll = true" v-if="this.tokens.is_current_session" ) {{$i18n.t('user.deleteAllTokens')}}-->




      <!--Delete confirm-->
      confirm.row(v-if="confirmVisible" v-on:confirmed="deletetokens()" v-on:closeModal="closeModal")
        span(slot="title") {{$i18n.t('user.deleteToken')}}
        div.ta-right(slot="message")
          div {{$i18n.t('common.doYouDelete')}}

        span(slot="messageDanger") {{$i18n.t('common.cancel')}}
        span(slot="messageSuccess") {{$i18n.t('easypay.yesDeleteIt')}}
</template>

<script>
  import confirm from '../../partials/confirm.vue';

  export default {
    name: 'single-tokens',
    data() {
      return {
        tokens: {},
        flagUrl: null,
        flagCountryName: null,
        confirmVisible: false,
        confirm: false,
      }
    },
    props: ['singleTokens'],
    created() {
      this.initTokens();
    },
    mounted() {
    },
    methods: {
      initTokens() {
        if (this.singleTokens) {
          this.tokens.id = this.singleTokens.id;
          this.tokens.ip = this.singleTokens.ip;
          this.findFlag(this.singleTokens.ip);
          this.tokens.client = this.singleTokens.client;
          this.tokens.is_current_session = this.singleTokens.is_current_session;
          this.tokens.client_identifier = this.singleTokens.client_identifier;
          this.tokens.last_seen = this.singleTokens.last_seen;
          this.tokens.user_agent = this.singleTokens.user_agent;
          this.tokens.entity_id = this.singleTokens.entity_id;
          this.counter++;
        }
      },
      /*** Send data to parent ***/
      deletetokens() {
        this.tokens.id = this.singleTokens.id;
        this.$emit('deletetokens', this.tokens);
      },
      closeModal() {
        //this.updatetokens();
        //this.visibleMap = false;
        this.confirmVisible = false;
        let body = document.getElementById('body');
        body.classList.remove("no-scroll");
      },
      findFlag(ip){
        this.$http.get(
            'http://geoip.nekudo.com/api/' +
            ip).then(response => {
          this.$http.get('https://restcountries.eu/rest/v2/alpha/' +
              response.body.country.code).then(secendresponse => {
            this.flagUrl = secendresponse.body.flag;
            this.flagCountryName = secendresponse.body.translations.fa;
          }, response => {
          });
        }, response => {
        });

      },
    },
    components: {
      confirm
    }
  }
</script>