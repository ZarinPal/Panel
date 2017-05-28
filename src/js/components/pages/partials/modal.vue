<template lang="pug">
    div
        transition(name="fade"
        enter-active-class="fade-in"
        leave-active-class="fade-out")
            div.modal(v-on:click.self="closeModal()")

        div.modal-content-father(v-on:click.self="closeModal()")
            transition(name="zoom"
            enter-active-class="zoom-in"
            leave-active-class="zoom-out")
                div.row.center-xs.modal-content(v-if="!closeModalContent" v-on:click.self="closeModal()")
                    div.col-lg-5.col-md-5.col-sm-10.col-xs-10
                        div.header
                            span.icon-close(@click="closeModal()")
                            span.title
                                slot(name="title")

                        div.body
                            div.contains
                                slot(name="content")

</template>


<script>
    export default {
        name: 'pages-partials-modal',
        data() {
            return {
                closeModalContent: true
            }
        },
        mounted() {
            this.closeModalContent = false
        },
        methods: {
            closeModal() {
                this.$emit('closeModal')
            }
        }
    }
</script>
