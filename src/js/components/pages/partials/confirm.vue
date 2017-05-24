<template lang="pug">
    modal(v-on:closeModal="closeModal()")
        span(slot="title") title
        div(slot="content")
            h1 are you sure?
            div.row
                div.col-xs.no-margin
                    button.btn.success(v-ripple="" @click="confirmed()") Yes
                    button.btn.success(v-ripple="" @click="closeModal()") No
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
