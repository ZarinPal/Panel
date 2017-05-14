<template lang="pug">
    transition(name="fade"
    enter-active-class="fade-in"
    leave-active-class="fade-out")
        div.modal.card(v-on:click.self="closeModal()")
            transition(name="zoom"
            enter-active-class="zoom-in"
            leave-active-class="zoom-out")
                div.row.center-xs(v-if="!closeModalContent" v-on:click.self="closeModal()")
                    div.col-lg-5.col-md-5.col-sm-10.col-xs-10.content
                        div.header
                            span.icon-close(@click="closeModal()")
                            span.title confirm
                        div.body
                            div.contains
                                h1 are you sure?


                                div.row
                                    div.col-xs.no-margin
                                        button.btn.success(v-ripple="" @click="confirmed()") Yes
                                        button.btn.success(v-ripple="" @click="closeModal()") No

</template>


<script>
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
        }
    }

</script>
