<template lang="pug">
  modal.confirm(v-on:closeModal="closeModal()")
    span(slot="title")
      slot(name="title")
    div.content(slot="content")
      slot(name="message")
      div.ta-left.buttons.xs-ta-center
        button.btn(v-if="hasMessageDanger" v-ripple="" @click="closeModal()")
          slot(name="messageDanger")
        button.btn.success(v-if="hasMessageSuccess" v-ripple="" @click="confirmed()")
          slot(name="messageSuccess")
</template>

<script>
  import modal from './modal.vue';

  export default {
    name: 'pages-partials-confirm',
    data() {
      return {
        closeModalContent: false,
      }
    },
    props: [
      'keepConfirmedOpen'
    ],
    computed: {
      hasMessageDanger() {
        return this.$slots.messageDanger;
      },
      hasMessageSuccess() {
        return this.$slots.messageSuccess;
      },
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
        if (!this.keepConfirmedOpen) {
          this.closeModal();
        }

      }
    },
    components: {
      modal
    }
  }

</script>
