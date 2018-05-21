<template lang="pug">
  div.full-height
    navbar

    div.zp-container.row
      sidebar

      div.col-xs.main-content
        div.breadcrumb(:class="$route.meta.additionalClass")
          p.hidden-xs.breadcrumb-title.pointer(v-for="breadcrumb in readBreadcrumb" :class="$route.meta.additionalClass")
            router-link.breadcrumb-separator( tag="span" v-bind:to="breadcrumb.route" )  {{breadcrumb.name}}

        <!--button.success.pull-left(v-back="") back-->
        router-view(v-if="$store.state.auth.check")

    div.clear-both
</template>

<script>
  import navbar from '../pages/partials/navbar.vue';
  import sidebar from '../pages/partials/sidebar.vue';
  import loading from '../pages/partials/loading.vue';

  export default {
    name: 'panel',
    beforeRouteUpdate (to, from, next) {
      if (this.$store.state.auth.check
          && !this.checkUserLevel(to.meta.accessLevel, this)) {
        this.$router.push(
            {name: 'home.index', query: {error: 'suspend', path: from.name}});
      }
      next();
    },
    computed: {
      readBreadcrumb() {
        let crumbs = [];
        for (let i = 0; i < this.$route.matched.length; i++) {
          if (this.$route.matched[i].meta && this.$route.matched[i].meta.breadcrumb) {
            for (let j = 0; j < this.$route.matched[i].meta.breadcrumb.length; j++) {
              let breadcrumb = this.$route.matched[i].meta.breadcrumb[j];
              crumbs.push(
                  {
                    name: breadcrumb.crumbName?breadcrumb.crumbName:breadcrumb,
                    route: this.routerLinkHandler(this.$route.matched[i],breadcrumb),
                  },
              );
            }
          }
        }
        return crumbs;
      },
      refererId() {
        return this.$store.state.app.refererId;
      }
    },
    created(){
      let body = document.getElementById('body');
      body.classList.remove("no-scroll");

      this.$store.commit('app/loading');
      let vm = this;
      this.$store.dispatch('auth/fetch', (isOk) => {
        if (isOk && !vm.checkUserLevel(vm.$route.meta.accessLevel, vm)) {
          vm.$router.push({
            name: 'home.index',
            query: {error: 'suspend', path: vm.$route.name}
          });
        }
      });

//            if (this.refererId) {
//                store.commit('flashMessage', {
//                    text: 'BackToReferrer',
//                    type: 'danger',
//                    important: true
//                });
//            }
    },
    methods: {
      routerLinkHandler(route,breadcrumb) {
        if (breadcrumb.routeName) {
          return {
            name: breadcrumb.routeName,
            params: {},
          };
        }else if (route.instances.default) {
          return {
            name: route.instances.default.$route.name,
            params: route.instances.default.$route.params,
          };
        }
        return {};
      },
      checkUserLevel(acceptedLevels, vm) {
        let levels = {
          '0': 'suspend',
          '1': 'basic',
          '2': 'basic',
          '3': 'silver',
          '4': 'gold',
        };

        let userLevel = (vm.$store.state.auth.user.level + 1).toString();
        if (!acceptedLevels || !acceptedLevels.length ||
            userLevel === 1) return true;
        return _.indexOf(acceptedLevels, levels[userLevel]) !== -1;
      },
    },
    components: {
      navbar,
      sidebar,
      loading,
    }
  }

</script>