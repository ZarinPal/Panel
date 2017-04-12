// app.vue
<style>
</style>

<template lang="pug">
    nav(v-if="paginateResource.meta")
        button(@click="loadMore" v-bind:disabled="is_loading" v-if="paginateResource.meta.pagination.links.next") load more
</template>

<script>
    export default {
        name: 'pagination',
        data(){
            return {
                paginateResource: {},
                is_loading: true,
                resource: null,
                page: 0
            }
        },
        mounted(){
            this.$on('updateResource', this.updateResource);
        },
        watch: {
            resource(){
                this.updateResource(this.resource);
            }
        },
        methods: {
            updateResource(resource){
                this.resource = resource;
                this.page = 0;
                this.loadMore();
            },
            loadMore(){
                this.page++;
                this.ajaxGet(this.page);
            },
            ajaxGet(page){
                this.is_loading = true;
                let vm = this;
                this.resource.get({page: page}).then(data => {
                    vm.paginateResource = data.data;
                    vm.paginateResource.data.forEach(function (item) {
                        vm.$emit('addItem', item);
                    });
                    vm.is_loading = false;
                });
            },
        }
    }
</script>
