<template lang="pug">
    selectbox.categories.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-if="categories" v-on:select="selectedCategory" v-bind:selected="selected" v-bind:data="categories" placeholder="انتخاب دسته‌بندی وب‌سایت")
</template>

<script>
    import selectbox from './selectbox.vue';
    export default {
        name: 'webservice-categories',
        props: [
            'selected',
        ],
        computed: {
            categories() {
                let categories = this.$store.state.app.webserviceCategories;
                let categoryParents = [];

                //make parents
                categories.forEach(function (category) {
                    if (!category.parent_id) {
                        categoryParents.push({public_id: category.public_id, title: category.title, disable: 1});
                    }
                });

                //make childs
                categories.forEach(function (category) {
                    if (category.parent_id) {
                        let parentCategoryIndex = _.findIndex(categoryParents, function (parentCategory) {
                            return parentCategory.public_id === category.parent_id;
                        });

                        let categoryChild = {public_id: category.public_id, title: category.title, disable: 0};
                        categoryParents.splice(parentCategoryIndex + 1, 0, categoryChild);
                    }
                });

                return categoryParents.map(function (category) {
                    return {
                        'title': category.title,
                        'value': category.public_id,
                        'disable': category.disable
                    }
                });
            }
        },
        methods: {
            selectedCategory(value) {
                this.$emit('select', value);
            },
        },
        components: {
            selectbox
        }
    };

</script>


