<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                p.page-title {{ $i18n.t('common.webservices') }}
                p.page-description {{ $i18n.t('webservice.webserviceDescription') }}

            div.col-lg-6.col-md-6.col-sm-12.col-xs-12.xs-ta-center
                router-link.btn.success.pull-left(tag="button" v-bind:to="{ name: 'webservice.create'}")
                    span.icon-add-circle
                    span.text {{ $i18n.t('common.createWebservice') }}

        div.row
            singleWebservice(v-for="webservice in webservices.data" v-bind:key="webservice.public_id" v-bind:webservice="webservice")

        div.row
            div.col-xs
                div.ta-center(v-if="webservices.status")
                    loading

                div.row(v-if="!webservices.status && !webservices.data.length")
                    div.col-xs.ta-center
                        span.txt-nothing-to-show  {{ $i18n.t('common.nothingToShow') }}

                div.ta-center(v-if="!this.$store.state.paginator.paginator.WebserviceList.resource.resource && webservices.data.length")
                    span.nothing-to-show-text {{ $i18n.t('common.thereIsNoOtherItemToDisplay') }}

</template>

<script>
  import singleWebservice from './partials/single-webservice.vue';
  import loading from '../../pages/partials/loading.vue';

  export default {
    name: 'webservice-index',
    computed: {
      user(){
        return this.$store.state.auth.user;
      },
      webservices() {
        return {
          data: this.$store.state.paginator.paginator.WebserviceList.data,
          status: this.$store.state.paginator.paginator.WebserviceList.isLoading,
          update: this.$store.state.paginator.update,
        };
      }
    },
    created() {
      this.getWebservices();
      let vm = this;
      window.onscroll = function() {
        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight
            && !vm.$store.state.paginator.paginator.WebserviceList.isLoading) {
          vm.$store.dispatch(
              'paginator/next',
              {
                requestName: "WebserviceList"
              }
          );
        }
      };
    },
    methods: {
      getWebservices() {
        let vm = this;
        this.$store.dispatch(
            'paginator/make',
            {
              vm,
              resource: vm.$store.state.http.requests['webservice.getIndex'],
              requestName: "WebserviceList"
            }
        );
      }
    },
    components: {
      singleWebservice,
      loading
    }
  }
</script>
