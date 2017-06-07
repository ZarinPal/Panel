<template lang="pug">
    ul.dropdown(v-click-outside="closeDropDown")
        li(@click="isOpen = true")
            span(v-html="selectBoxTitle")
            span.arrow
        ul(v-if="isOpen")
            li(v-ripple="" v-for="item in data" @click="selectItem(item)" v-html="item.title")
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