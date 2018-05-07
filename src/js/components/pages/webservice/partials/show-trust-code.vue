<template lang="pug">
    modal(v-on:closeModal="closeModal()")
        span(slot="title") {{$i18n.t('webservice.showTrustLogo')}}
        div(slot="content")

            div.col-xs.nav-page-header
                div.row
                    p.page-description {{ $i18n.t('webservice.trustLogoDescription') }}

            div.col-xs
                div.row.no-margin
                    textarea(id="TrustCodeLogo" v-model="message" @focus="selectCode" readonly)
                    div.ta-right(v-if="validation('content')")
                        span.text-danger {{ errors.first('content') }}


            div.col-xs.xs-ta-center
                button.btn.btn-gradient-radius(tag="button"    @click="clipboardMessage" v-clipboard='message' v-bind:data-clipboard-text="message")
                    span.btn-label.top-0 {{ $i18n.t('webservice.codeCopy') }}


</template>


<script>
  import modal from '../../partials/modal.vue';
  import loading from '../../partials/loading.vue';

  export default {
    name: 'show-trust-logo',
    data() {
      return {
        message: '<script src="' + 'https://cdn.zarinpal.com/trustlogo/v1/trustlogo.js" ' + 'type="' +
        'text/javascript">' + '</' + 'script>',
      }
    },
    methods: {
      closeModal() {
        this.$emit('closeModal');
      },
      clipboardMessage(event) {
        store.commit('flashMessage', {
          text: 'Copied',
          type: 'success',
          timeout: '1500'
        });
      },
      selectCode() {
        document.getElementById('TrustCodeLogo').select();
      }
    },
    components: {
      modal,
      loading
    }
  };
</script>