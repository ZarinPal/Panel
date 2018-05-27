<template lang="pug">
  transition(name="fade"
  enter-active-class="fade-in"
  leave-active-class="fade-out")

    div(@mouseover="visibleCloseIcon = true" @mouseleave="visibleCloseIcon = false")
      div.row.ta-center
        div.logo-width
          div(v-bind:class="{'device-logo-active': this.tokens.is_current_session}").device-logo
        div.col-xs
          div.ta-right
            span.device-name {{ this.tokens.client }}
            img.p-l-5.flag-icon(:src="flagUrl" :title="flagCountryName")
          div.ta-right
            span.row.token-detail.p-t-10 {{ this.tokens.ip }}
              span.hidden-xs(v-if="this.tokens.is_current_session" ) ({{$i18n.t('user.currentSession')}})
        div.col-xs.p-l-10
          div.ta-left
            span.token-detail {{ this.tokens.last_seen | fromNow }}
          div.ta-left
            span.hand.close(:title="$i18n.t('user.deleteTokens')" @click="confirmVisible = true" v-if="!this.tokens.is_current_session" ) {{$i18n.t('common.delete')}}
            span.token-detail.show-xs.hidden-md.hidden-lg.hidden-sm(v-if="this.tokens.is_current_session && this.tokens.is_current_session" ) ({{$i18n.t('user.currentSession')}})




      <!--Delete confirm-->
      confirm.row(v-if="confirmVisible" v-on:confirmed="deletetokens()" v-on:closeModal="closeModal")
        span(slot="title") {{$i18n.t('user.deleteTokens')}}
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
          this.tokens.last_seen = this.singleTokens.last_seen;
          this.tokens.user_agent = this.singleTokens.user_agent;
          this.tokens.entity_id = this.singleTokens.entity_id;
          this.counter++;
        }
      },
      /*** Send data to parent ***/
      deletetokens() {
        this.tokens.id = this.singleTokens.id;
        console.log(this.tokens);
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
        this.$http.get('https://api.ipdata.co/' + ip).then(response => {
          this.flagUrl = response.body.flag;
          this.flagCountryName = response.body.country_name + ' ' +
              response.body.city;
        }, response => {
        });
      },
    },
    components: {
      confirm
    }
  }
</script>