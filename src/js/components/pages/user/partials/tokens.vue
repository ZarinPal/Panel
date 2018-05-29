<template lang="pug">
  div.inner-content
    div.row.nav-page-header
      div.col-lg-6.col-md-6.col-sm-12.col-xs-12
        p.page-title {{ $i18n.t('user.showTokens') }}
        p.page-description {{ $i18n.t('user.showTokensDescription') }}

    div.row.section.nav-tokens-box
      div.box.full-width
        div.nav-tokens.tokens-box(id="tokensBox" v-if="isLoadedtokens")
          div(v-for="(tokens,key) in tokens")
            singleToken(v-bind:singleTokens="tokens" v-bind:id="tokens.id" v-on:gettokens="gettokens" v-on:deleteTokens="deleteTokens")

        div.ta-center(v-else)
          loading


</template>

<script>
  import singleToken from './single_tokens.vue';
  import loading from '../../partials/loading.vue';

  export default {
    name: 'tokens',
    data() {
      return {
        loading: false,
        tokens: [],
        isLoadedtokens: false,
      }
    },
    computed: {
      validationErrors() {
        return this.$store.state.alert.validationErrors;
      },
    },
    created() {
      store.commit('clearValidationErrors');
      this.gettokens();
    },
    methods: {
      gettokens() {
        this.$store.state.http.requests['oauth.userTokens'].get().then(
            (response) => {
              if (response.data.data.length) {
                this.tokens = response.data.data;
                this.tokens = _.orderBy(this.tokens,
                    ['is_current_session', 'last_seen'], ['desc', 'desc']);
                let tokensCounter = 1;
                _.forEach(this.tokens, function(tokens) {
                  tokens.id = tokensCounter++;
                });
              }
              this.isLoadedtokens = true;
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

      deleteTokens(tokens) {
        if (tokens.entity_id) {
          let elem = document.getElementById(tokens.id);
          elem.parentNode.classList.add('inactive-step');
          this.$store.state.http.requests['oauth.revokeAccessToken'].delete(
              {token_id: tokens.entity_id}).then(
              () => {

                elem.parentNode.removeChild(elem);
                _.remove(this.tokens, function(singleTokens) {
                  return singleTokens.id == tokens.id;
                });
              },
              (response) => {
                elem.parentNode.classList.remove('inactive-step');
                store.commit('flashMessage', {
                  text: response.data.meta.error_type,
                  important: false,
                  type: 'danger'
                });
              }
          );
        } else {
          let elem = document.getElementById(tokens.id);
          elem.parentNode.removeChild(elem);
          _.remove(this.tokens, function(singleTokens) {
            return singleTokens.id == tokens.id;
          });
        }
      },
    },
    components: {
      'singleToken': singleToken,
      confirm,
      loading
    }
  }
</script>