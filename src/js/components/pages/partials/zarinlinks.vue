<template lang="pug">
    selectbox.zarinlinks.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-if="this.$store.state.auth.isLoaded" v-on:select="selectedZarinLink" v-bind:selected="defaultZarinLink" v-bind:data="zarinLinks" v-bind:loadMore="'EasypayList'" placeholder="انتخاب زرین‌لینک")
</template>

<script>
    import selectbox from './selectbox.vue';
    export default {
        name: 'zarin-link',
        props: [
            'selected',
        ],
        computed: {
            defaultZarinLink() {
                if (this.selected) {
                    return this.selected.entity_id;
                }

                return null;
            },
            zarinLinks() {
                let zarinLinks = {
                    data: this.$store.state.paginator.paginator.EasypayList.data,
                    status: this.$store.state.paginator.paginator.EasypayList.isLoading,
                    update: this.$store.state.paginator.update,
                };

                return zarinLinks.data.map(function (zarinLink) {
                    return {
                        'title': zarinLink.title,
                        'value': zarinLink.entity_id
                    }
                });
            },
        },
        created() {
            if (!this.$store.state.paginator.paginator.EasypayList) {
                this.getZarinLinks();
            } else {
                this.$store.state.paginator.paginator.EasypayList.data.unshift({entity_id: 'all', title: 'همه'});
            }
        },
        methods: {
            getZarinLinks() {
                let vm = this;
                this.$store.dispatch(
                    'paginator/make',
                    {
                        vm,
                        resource: vm.$store.state.http.requests['easypay.getList'],
                        requestName: "EasypayList",
                    }
                );

                this.$store.state.paginator.paginator.EasypayList.data.push({entity_id: 'all', title: 'همه'});

                if (this.selected) {
                    this.$store.state.paginator.paginator.EasypayList.data.push({
                        entity_id: this.selected.entity_id,
                        title: this.selected.title
                    });
                }
            },
            getMoreZarinLinks() {
                let vm = this;

                vm.$store.dispatch(
                    'paginator/next',
                    {
                        requestName: "EasypayList",
                    }
                );
            },
            selectedZarinLink(value) {
                this.$emit('select', value);
            },
        },
        components: {
            selectbox
        }
    };

</script>