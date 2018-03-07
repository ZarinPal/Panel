<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-4.col-md-6.col-sm-12.col-xs-12
                p.page-title {{ $i18n.t('common.easypay') }}
                p.page-description {{ $i18n.t('common.easypayDescription') }}

            div.col-lg-8.col-md-6.col-sm-12.col-xs-12
                router-link.btn.success.pull-left(tag="button" v-bind:to="{ name: 'easypay.create'}")
                    span.icon-add-circle
                    span.text {{ $i18n.t('easypay.createEasypay') }}
                button.btn.success(@click="visibleRequestPersonalLink = true" v-if="!user.username")
                    span.icon-add-circle
                    span.text {{ $i18n.t('user.requestPersonalLinkTitle') }}
                a.btn.simple(:href="preLink + user.username" target='_blank' v-if="user.username")
                    span.btn-label لینک شخصی شما:
                    span.btn-label.color-link   {{shortPreLink + user.username}}





        div.row
            div.col-xs
                div.section
                    div.box
                        div.body.search-box
                            div.row
                                span.icon-search
                                span.search-title {{ $i18n.t('easypay.searchEasypay') }}
                                span.break
                                    <!--Search Form-->
                            div.row
                                form.row.search-padding(onsubmit="event.preventDefault();")
                                    div.col-lg-8.col-md-8.col-sm-8.col-xs-12
                                        input(v-model="searchOptions.title" type="text" :placeholder="$i18n.t('easypay.title')")
                                        div.break
                                    div.col-lg-4.col-md-4.col-sm-4.col-xs-12.search-box-buttons
                                        button.btn.info.pull-right(v-ripple="" @click="search()")
                                            span {{ $i18n.t('common.search') }}

        <!--easypays-->
        div.row
            singleEasypay(v-for="easypay in easypays.data" v-bind:key="easypay.public_id" v-bind:easypay="easypay")

        div.ta-center(v-if="easypays.status")
            loading
        div.ta-center(v-if="!this.$store.state.paginator.paginator.EasypayList.resource.resource && easypays.data.length")
            span.txt-nothing-to-show {{ $i18n.t('common.thereIsNoOtherItemToDisplay') }}

        div.row(v-if="!easypays.status && !easypays.data.length")
            div.col-xs.ta-center
                span.txt-nothing-to-show  {{ $i18n.t('common.nothingToShow') }}

        <!--Personal link-->
        personal-link(v-if="visibleRequestPersonalLink" v-on:closeModal="closeModal")
</template>

<script>
    import singleEasypay from './partials/single-easypay.vue';
    import loading from '../../pages/partials/loading.vue';
    import personalLink from '../../pages/easypay/partials/personal_link.vue';

    export default {
        name: 'easypay-index',
        data() {
            return {
                searchOptions: {
                    title: ''
                },
                preLink: 'https://Zarinp.al/@',
                shortPreLink: 'Zarinp.al/@',
                visibleRequestPersonalLink: false,
            }
        },
        computed: {
            user(){
                return this.$store.state.auth.user;
            },
            easypays() {
                return {
                    data: this.$store.state.paginator.paginator.EasypayList.data,
                    status: this.$store.state.paginator.paginator.EasypayList.isLoading,
                    update: this.$store.state.paginator.update,
                };
            }
        },
        created() {
            this.showPersonalLink();

            this.search();

            let vm = this;
            window.onscroll = function () {
                if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight
                    && !vm.$store.state.paginator.paginator.EasypayList.isLoading) {
                    vm.$store.dispatch(
                        'paginator/next',
                        {
                            params: vm.searchOptions,
                            requestName: "EasypayList",
                        }
                    );
                }
            };
        },
        methods: {
            closeModal(){
                this.visibleRequestPersonalLink = false;
            },
            search() {
                this.getEasypays();
            },
            getEasypays() {
                let vm = this;
                this.$store.dispatch(
                    'paginator/make',
                    {
                        vm,
                        resource: vm.$store.state.http.requests['easypay.getList'],
                        requestName: "EasypayList",
                        params: vm.searchOptions,
                    }
                );
            },
            showPersonalLink() {
                if (this.$route.params.visiblePersonalLink == 'Yes') {
                    this.visibleRequestPersonalLink = true;
                }
            },
        },
        components: {
            singleEasypay,
            loading,
            'personal-link': personalLink
        }
    }
</script>
