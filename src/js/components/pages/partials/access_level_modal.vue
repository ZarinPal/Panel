<template lang="pug">
    modal.confirm(v-on:closeModal="closeModal()")
        span(slot="title")
            span {{ $i18n.t('common.accessLevelLimitTitle') }}
        div.content(slot="content")
            span {{errorContent}}
</template>


<script>
  import modal from './modal.vue';

  export default {
    name: 'pages-partials-access-level-modal',
    data() {
      return {
        closeModalContent: false,
      }
    },
    computed: {
      user(){
        return this.$store.state.auth.user;
      },
      errorContent(){
        if (this.$store.state.auth.user.level == -1) {
          return 'حساب کاربری شما مسدود شده و شما به این بخش دسترسی ندارید.';
        } else {
          return 'برای استفاده از خدمات کامل زرین‌پال لطفا سطح عضویت خود را به طور کاملا رایگان به نقره‌ای ارتقا دهید.';
        }

      }
    },
    mounted() {
      this.closeModalContent = false
    },

    methods: {
      closeModal() {
        this.$emit('closeModal');
      },
      confirmed() {
        this.$emit('confirmed');
        this.closeModal();
      }
    },
    components: {
      modal
    }
  }

</script>
