<template lang="pug">
    modal.confirm(v-on:closeModal="closeModal()")
        span(slot="title")
            span {{ $i18n.t('common.accessLevelLimitTitle') }}
        div.content(slot="content")
            span سطح دسترسی شما مجاز نمی باشد

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
        components:{
            modal
        }
    }

</script>
