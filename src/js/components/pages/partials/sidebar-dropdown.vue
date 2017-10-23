<template lang="pug">
    li(v-bind:title="label" v-bind:class="{'opened-dropdown': isOpen}")
        div(@click="isOpen = !isOpen")
            span.dot-hidden(v-bind:class="{'dot-show': isOpen}")
            i(v-bind:class="icon")
            span.item-label {{ label }}
            span.item-arrow
        transition(name="slide"
        enter-active-class="slide-enter-active"
        leave-active-class="slide-leave-active")
            slot(v-if="isOpen")
</template>


<script>
    export default {
        name: 'sidebarDropDown',
        props: [
            'label',
            'icon'
        ],
        data(){
            return {
                isOpen: false,
            }
        }
    }

</script>