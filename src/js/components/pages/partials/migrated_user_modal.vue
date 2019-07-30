<template lang="pug">
  modal.confirm(v-on:closeModal="closeModal()")
    span(slot="title")
      span {{ $i18n.t('common.migratedUserTitle') }}
    div.content(slot="content")
      span {{errorContent}}
      br
      br
      a.btn.success(href="https://next.zarinpal.com" target="_blank")
        span.text {{ $i18n.t('common.goToNewPanel') }}
</template>

<script>
    import modal from './modal.vue';

    export default {
        name: 'pages-partials-migrated-user-modal',
        data() {
            return {
                closeModalContent: false,
            }
        },
        computed: {
            user() {
                return this.$store.state.auth.user;
            },
            errorContent() {

                return 'حساب کاربری شما به نسخه Next (نسخه پرداخت یاری) زرین‌پال منتقل‌شده است.' +
                    ' توجه داشته باشید که در این پنل تنها امکان ثبت تسویه‌حساب کیف‌پول،ارسال تیکت و مشاهده تراکنش‌‌هایی که پیش از انتقال به پنل Next انجام شده است میسر می‌باشد و برای مشاهده تمامی تراکنش‌های شما به پنل پرداخت‌یاری به آدرس https://next.zarinpal.com مراجعه نمایید.';


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
