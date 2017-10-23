<template lang="pug">
    transition(name="fade"
    enter-active-class="fade-in"
    leave-active-class="fade-out")
        div.alert-container
            div(v-bind:class="'alert alert-'+message.type"
            role="alert"
            v-for="message in messagesToShow"
            transition="fade") {{message.handleShowEvent()}}
                span.close(v-show="message.important" @click="message.remove()") &times;
                i(v-bind:class="'icon-ic_'+message.type+'_black_24px'")
                | {{ $i18n.t('flash.' + kebabCase(message.text)) }}
</template>


<script>
    export default{
        name: 'flash-message',
        computed: {
            messagesToShow () {
                return store.state.alert.messages.filter(function (message) {
                    return message.show;
                })
            }
        },
        methods: {
            kebabCase(value) {
                return _.kebabCase(value);
            }
        }
    }
</script>