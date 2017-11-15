<template lang="pug">
    div(v-bind:class="{'small-sidebar hidden-sidebar': isSmallSidebar, 'normal-sidebar hidden-sidebar': !isSmallSidebar, 'mobile-sidebar': isMobileSidebar}")
        span.close-mobile-sidebar(@click="toggleMobileSidebar()")
        div.side-content.sticky-sidebar(v-sticky="")

            div.user-info
                router-link(tag="span" v-bind:to="{ name: 'user.addAddress'}" title="پروفایل")
                    div.user-image
                        span(v-if="!this.$store.state.app.smallSidebar")
                            userProgress.hand(v-if="user.user_progress" v-bind:avatar="user.avatar" v-bind:user_progress="user.user_progress")
                        img.hand(v-else :src="user.avatar")
                    p.user-name {{user.name}}

                zpId(v-bind:data="user")

                router-link.to-silver-level-link(tag="div" v-if="user.level < 2" v-bind:to="{ name: 'user.levelUp'}")
                    span {{ $i18n.t('common.UpgradeToSilverLevel') }}

                ul
                    span(v-for="(tab, index) in tabs")
                        router-link(v-if="userHasAccess(tab.accessLevel) >= 0" @click.native="toggleMobileSidebar(false, index)" v-ripple="" tag="li" v-bind:to="{ name: tab.link}")
                            div
                                i(:class="tab.icon")
                                span.item-label {{ $i18n.t(tab.titleTransKey) }}

                div.clear-both

</template>


<script>
    import dropDown from './sidebar-dropdown.vue';
    import userProgress from './user-progress.vue';
    import zpId from './zp-id.vue';
    export default {
        name: 'sidebar',
        data() {
            return {
                getPurseBalanceTimer: 10,
                tabs: {
                    home: {
                        link: 'home.index',
                        icon: 'icon-zp-dashboard',
                        titleTransKey: 'panel.home',
                        accessLevel: [-1, 0, 1, 2, 3]
                    },
                    webservice: {
                        link: 'webservice.index',
                        icon: 'icon-zp-web-service',
                        titleTransKey: 'panel.webservice',
                        accessLevel: [2, 3]
                    },
                    card: {
                        link: 'card.index',
                        icon: 'icon-zp-card',
                        titleTransKey: 'panel.card',
                        accessLevel: [1, 2, 3]
                    },
                    easypay: {
                        link: 'easypay.index',
                        icon: 'icon-zp-easy-pay',
                        titleTransKey: 'panel.easypay',
                        accessLevel: [1, 2, 3]
                    },
                    coupon: {
                        link: 'coupon.index',
                        icon: 'icon-zp-copouns',
                        titleTransKey: 'panel.coupon',
                        accessLevel: [2, 3]
                    },
                    ticket: {
                        link: 'ticket.index',
                        icon: 'icon-zp-tickets',
                        titleTransKey: 'panel.ticket',
                        accessLevel: [-1, 0, 1, 2, 3]
                    }
                },
            }
        },
        mounted(){
            this.detectWidth();
            window.addEventListener("resize", this.detectWidth());
        },
        computed: {
            isSmallSidebar(){
                return this.$store.state.app.smallSidebar;
            },
            isMobileSidebar(){
                return this.$store.state.app.showMobileSidebar;
            },
            user(){
                return this.$store.state.auth.user;
            },
            tabSelected() {
                return this.$store.state.app.selectedTab;
            }
        },
        methods: {
            userHasAccess(tabLevels) {
                return _.indexOf(tabLevels, this.user.level);
            },
            toggleMobileSidebar(condition = null, tabData = null){
                this.$store.commit('app/toggleMobileSidebar', condition);

                if (tabData) {
                    this.$store.commit('app/changeTabData', tabData)
                }

                //reload purse balance
                if (this.$route.name === 'home.index') {
                    let requestTimeDiff = Math.abs(Date.now() - this.$store.state.timer.getPurseBalanceTime) / 100;
                    if (requestTimeDiff > this.getPurseBalanceTimer) {
                        this.$store.state.auth.updatePurseListener++;
                        this.$store.dispatch('auth/fetchPurseBalance');
                        this.$store.state.timer.getPurseBalanceTime = Date.now();
                    }
                }

                //reload cards
                if (this.$route.name === 'card.index') {
                    this.reloadData('CardList', 'card.index');
                }

                // reload tickets
                if (this.$route.name === 'ticket.index') {
                    this.reloadData('TicketList', 'ticket.index');
                }
            },
            detectWidth(){
                if (window.innerWidth <= 768) {
                    this.toggleMobileSidebar(false);
                }
            },
            reloadData(dataListName, dataUrlName) {
                let vm = this;
                this.$store.dispatch(
                    'paginator/make',
                    {
                        vm,
                        resource: vm.$store.state.http.requests[dataUrlName],
                        params: vm.searchOptions,
                        requestName: dataListName
                    }
                );
            }
        },
        components: {
            dropDown,
            userProgress,
            zpId
        }

    }

</script>