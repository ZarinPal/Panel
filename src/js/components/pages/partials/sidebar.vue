<template lang="pug">
    div(v-bind:class="{'small-sidebar hidden-sidebar': isSmallSidebar, 'normal-sidebar hidden-sidebar': !isSmallSidebar, 'mobile-sidebar': isMobileSidebar}")
        span.close-mobile-sidebar(@click="toggleMobileSidebar()")
        div.side-content.sticky-sidebar(v-sticky="")

            div.user-info
                router-link(tag="span" v-bind:to="{ name: 'user.addAddress'}" title="پروفایل")
                    div.user-image
                        span(v-if="!this.$store.state.app.smallSidebar")
                            userProgress.hand(v-if="user.user_progress" v-bind:avatar="'https:'+user.avatar" v-bind:user_progress="user.user_progress")
                        img.hand(v-else v-bind:src="'https:' + user.avatar")
                    p.user-name {{user.name}}

                zpId(v-bind:data="user")

                ul
                    router-link(@click.native="toggleMobileSidebar(false, 'home')" v-ripple="" tag="li" v-bind:to="{ name: 'home.index'}" v-bind:class="{'active-sidebar-item': tabSelected == 'home'}" :title="$i18n.t('panel.home')")
                        div
                            i.icon-zp-dashboard
                            span.item-label {{ $i18n.t('panel.home') }}

                    router-link(@click.native="toggleMobileSidebar(false, 'webservice')" v-ripple="" tag="li" v-bind:to="{ name: 'webservice.index'}" v-bind:class="{'active-sidebar-item': tabSelected == 'webservice'}" :title="$i18n.t('panel.webservice')")
                        div
                            i.icon-zp-web-service
                            span.item-label {{ $i18n.t('panel.webservice') }}

                    router-link(@click.native="toggleMobileSidebar(false, 'card')" v-ripple="" tag="li" v-bind:to="{ name: 'card.index'}" v-bind:class="{'active-sidebar-item': tabSelected == 'card'}" :title="$i18n.t('panel.card')")
                        div
                            i.icon-zp-card
                            span.item-label {{ $i18n.t('panel.card') }}

                    router-link(@click.native="toggleMobileSidebar(false, 'easypay')" v-ripple="" tag="li" v-bind:to="{ name: 'easypay.index'}"  v-bind:class="{'active-sidebar-item': tabSelected == 'easypay'}" :title="$i18n.t('panel.easypay')")
                        div
                            i.icon-zp-easy-pay
                            span.item-label {{ $i18n.t('panel.easypay') }}

                    router-link(@click.native="toggleMobileSidebar(false, 'coupon')" v-ripple="" tag="li" v-bind:to="{ name: 'coupon.index'}" v-bind:class="{'active-sidebar-item': tabSelected == 'coupon'}" :title="$i18n.t('panel.coupon')")
                        div
                            i.icon-zp-copouns
                            span.item-label {{ $i18n.t('panel.coupon') }}

                    router-link(@click.native="toggleMobileSidebar(false, 'ticket')" v-ripple="" tag="li" v-bind:to="{ name: 'ticket.index'}"  v-bind:class="{'active-sidebar-item': tabSelected == 'ticket'}" :title="$i18n.t('panel.ticket')")
                        div
                            i.icon-zp-tickets
                            span.item-label {{ $i18n.t('panel.ticket') }}

                            span.unread-ticket-count(v-if="this.$store.state.auth.user.ticket_summary.unread > 0") {{ this.$store.state.auth.user.ticket_summary.unread | persianNumbers}}

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
        toggleMobileSidebar(condition = null, tabData = null){
            this.$store.commit('app/toggleMobileSidebar', condition);

            if (tabData){
                this.$store.commit('app/changeTabData', tabData)
            }

            //reload purse balance
            if (this.$route.name === 'home.index') {

                let requestTimeDiff = Math.abs(Date.now() - this.$store.state.timer.getPurseBalanceTime) / 1000;
                if(requestTimeDiff > this.getPurseBalanceTimer) {
                    this.$store.state.auth.updatePurseListener++;
                    console.log('have request purse balance');
                    this.$store.dispatch('auth/fetchPurseBalance');
                    this.$store.state.timer.getPurseBalanceTime = Date.now();
                }
            }
        },
        detectWidth(){
            if (window.innerWidth <= 768) {
                this.toggleMobileSidebar(false);
            }
        },
    },
    components:{
        dropDown,
        userProgress,
        zpId
    }

}

</script>