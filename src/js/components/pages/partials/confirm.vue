<template lang="pug">
    modal.confirm(v-on:closeModal="closeModal()")
        span(slot="title")
            slot(name="title")
        div.content(slot="content")
            slot(name="message")
            div.ta-left.nav-buttons
                button.btn(v-ripple="" @click="closeModal()")
                    slot(name="messageDanger")
                button.btn.success(v-ripple="" @click="confirmed()")
                    slot(name="messageSuccess")
</template>


<script>
    import modal from './modal.vue';

    export default {
        name: 'pages-easypay-partials-confirm',
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
