<template lang="pug">
    transition(name="fade"
    enter-active-class="fade-in"
    leave-active-class="fade-out")
        div.modal.create-purse(v-on:click.self="closeModal()")
            transition(name="zoom"
            enter-active-class="zoom-in"
            leave-active-class="zoom-out")
                div.row.center-xs(v-if="!confirmVisible" v-on:click.self="closeModal()")
                    div.col-lg-5.col-md-5.col-sm-10.col-xs-10.content
                        div.header
                            span.icon-close(@click="closeModal()")
                            span.title {{ $i18n.t('purse.addPurseTitle') }}

                        div.body
                            div.contains



                                div.row
                                    div.col-xs.no-margin
                                        button.btn.success.pull-left(v-ripple="" @click.prevent="func()") yes

</template>


<script>
    export default {
        name: 'pages-partials-confirm',
        data() {
            return {
                confirmVisible: false,
                confrim: false
            }
        },
        props: {
            func: {
                type: Function,
                required: true
            }
        },
        methods: {
            closeModal() {
                this.$emit('closeModal');
            },
            confirm() {
                this.$emit('confirm');
            }
        },
    }

</script>
