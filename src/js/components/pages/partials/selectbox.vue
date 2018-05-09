<template lang="pug">
    ul.dropdown#dropDown(v-click-outside="closeDropDown")
        li.title(@focus="isActive = true" @click="openDropDown")
            div.row.no-margin(v-html="selectBoxTitle")
            span.arrow
        ul#itemSection(v-show="isOpen && data")
            span(v-for="item in data")
                li.row.dropdown-item-row.disable(v-if="item && item.disable == 1" v-html="item.title")
                li.row.dropdown-item-row(v-else-if="item && item.disable !== 1" @click="selectItem(item)" v-ripple="" v-html="item.title")

            div.ta-center.loading
                loading(v-if="moreDataDetails.status" v-bind:width="20" v-bind:height="20")
</template>

<script>
  import loading from '../partials/loading.vue';

  export default {
    name: 'selectbox',
    props: [
      'placeholder',
      'data',
      'selected',
      'loadMore'
    ],
    data() {
      return {
        selectBoxTitle: this.selected,
        isOpen: false,
        clickOutside: 0,
        clickInside: 0,
        isActive: false
      }
    },
    computed: {
      moreDataDetails() {
        let moreDataDetails = {
          status: false,
          update: 0,
        };

        if (this.$store.state.paginator.paginator[this.loadMore]) {
          moreDataDetails = {
            status: this.$store.state.paginator.paginator[this.loadMore].isLoading,
            update: this.$store.state.paginator.update,
          };
        }

        return moreDataDetails;
      }
    },
    created() {
      if (this.placeholder) {
        this.selectBoxTitle = this.placeholder;
      }

      if (this.selected) {
        let item = _.find(this.data, {'value': this.selected});
        if (typeof item === 'undefined') {
          item = {title: '', value: ''}
        }

        this.selectItem(item);
      }
    },

    mounted() {
      let vm = this;
      if (this.loadMore) {
        let selectBoxItems = this.$el.querySelector('#itemSection');
        selectBoxItems.addEventListener("scroll", function(e) {
          if (selectBoxItems.scrollHeight - selectBoxItems.scrollTop === selectBoxItems.clientHeight) {
            vm.$store.dispatch(
                'paginator/next',
                {
                  requestName: vm.loadMore
                }
            );
          }
        });
      }
    },

    methods: {
      openDropDown() {
        this.isOpen = !this.isOpen;
      },
      selectItem(item) {
        this.selectBoxTitle = item.title;
        this.isOpen = false;
        this.$emit('select', item.value);
      },
      closeDropDown: function() {
        this.isOpen = false;
      }
    },
    components: {
      loading
    }
  };

</script>