<template lang="pug">
    ul.dropdown
        li(@click="isOpen = true")
            span {{selectBoxTitle}}
            span.arrow
        ul(v-if="isOpen")
            li(v-for="item in data" @click="selectItem(item)") {{item.title}}
</template>


<script>
export default {
    name: 'selectbox',
    props: [
        'placeholder',
        'data',
        'selected'
    ],
    data() {
        return {
            selectBoxTitle: this.selected,
            isOpen: false,
        }
    },
    created() {
        if (this.placeholder) {
            this.selectBoxTitle = this.placeholder;
        }
    },
    methods: {
        selectItem(item) {
            this.selectBoxTitle = item.title;
            this.isOpen = false;
            this.$emit('select', item.value);
        }
    }
}

</script>