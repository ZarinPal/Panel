<template lang="pug">
    ul.dropdown(v-click-outside="closeDropDown")
        li.title(@focus="isActive = true" @click="openDropDown")
            div.row(v-html="selectBoxTitle")
            span.arrow
        ul(v-if="isOpen")
            span(v-for="item in data")
                li.row.dropdown-item-row.disable(v-if="item.disable && item.disable == 1" v-html="item.title")
                li.row.dropdown-item-row(v-else @click="selectItem(item)" v-ripple="" v-html="item.title")
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
                clickOutside: 0,
                clickInside: 0,
                isActive: false
            }
        },
        created() {
            if (this.placeholder) {
                this.selectBoxTitle = this.placeholder;
            }
            if (this.selected) {
                let item = _.find(this.data, {'value': this.selected});
                if (typeof item === 'undefined') {
                    item = {title: '', value: ''}
                }
                this.selectItem(item);
            }

            window.addEventListener('keyup', this.openDropDownByEnter)
        },

        methods: {
            openDropDown() {
                this.isOpen = !this.isOpen;
            },
            openDropDownByEnter(event) {
                // if(event.keyCode === 13 && !this.isActive) {
                //     this.openDropDown();
                // }
                //
                // if(event.keyCode === 9) {
                //     this.isOpen = false;
                // }
            },
            selectItem(item){
                this.selectBoxTitle = item.title;
                this.isOpen = false;
                this.$emit('select', item.value);
            },
            closeDropDown: function () {
                this.isOpen = false;
            }
        },
    };

</script>