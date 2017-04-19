<template lang="pug">
    ul.dropdown
        li(@click="isOpen = true")
            span(v-html="selectBoxTitle")
            span.arrow
        ul(v-if="isOpen")
            li(v-for="item in data" @click="selectItem(item)" v-html="item.title")
</template>


<script>
export default {
    name: 'selectbox',
    props: [
        'placeholder',
        'data',
        'selected',
        'selectedItem'
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
//        if (this.selectedItem) {
//            this.selectItem(selectedItem);
//        }
    },
    methods: {
        selectItem(item) {
//            alert(item);
            this.selectBoxTitle = item.title;
            this.isOpen = false;
            this.$emit('select', item.value);
        }
    }
}

</script>