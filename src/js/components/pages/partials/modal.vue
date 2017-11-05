<template lang="pug">
    div
        transition(name="fade"
        enter-active-class="fade-in"
        leave-active-class="fade-out")
            div.modal(v-on:click.self="closeModal()")

        div.modal-content-father.scrollbar(v-on:click.self="closeModal()")
            transition(name="zoom"
            enter-active-class="zoom-in"
            leave-active-class="zoom-out")
                div.row.center-xs.middle-xs.modal-content(v-if="!closeModalContent" v-on:click.self="closeModal()")
                    div.col-lg-5.col-md-5.col-sm-12.col-xs-12
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
            //say store modal is opened
            this.$store.commit('app/changeModalStatus', true);
            let body = document.getElementById('body');

            body.classList.remove("no-scroll");
            if(this.$store.state.app.isOpenModal) {
                body.className += " no-scroll";
            } else {
                body.classList.remove("no-scroll");
            }

            this.closeModalContent = false
        },
        methods: {
            closeModal() {
                //remove body no-scroll class
                this.$store.commit('app/changeModalStatus', false);
                let body = document.getElementById('body');
                body.classList.remove("no-scroll");

                this.$emit('closeModal');
            }
        }
    }
</script>
