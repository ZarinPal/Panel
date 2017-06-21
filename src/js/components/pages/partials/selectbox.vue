<template lang="pug">
    ul.dropdown(v-click-outside="closeDropDown")
        li.title(@click="isOpen = true")
            span(v-html="selectBoxTitle")
            span.arrow
        ul(v-if="isOpen")
            span(v-for="item in data")
                li.disable(v-if="item.disable && item.disable == 1" v-html="item.title")
                li(v-else @click="selectItem(item)" v-ripple="" v-html="item.title")
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
            a: '',
            clickOutside: 0,
            clickInside: 0,
        }
    },
    created() {
        if (this.placeholder) {
            this.selectBoxTitle = this.placeholder;
        }
        if (this.selected) {
            let item = _.find(this.data, {'value': this.selected});
            if(typeof item === 'undefined'){
                item = {title:'',value:''}
            }
            this.selectItem(item);
        }
    },

    methods: {
        selectItem(item){
            this.selectBoxTitle = item.title;
            this.isOpen = false;
            this.$emit('select', item.value);
        },
        closeDropDown: function() {
            this.isOpen = false;
        }
    },
};

</script>