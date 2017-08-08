<template lang="pug">
    div(v-bind:class="{'small-sidebar hidden-sidebar': isSmallSidebar, 'normal-sidebar hidden-sidebar': !isSmallSidebar, 'mobile-sidebar': isMobileSidebar}")
        span.close-mobile-sidebar(@click="toggleMobileSidebar()")
        div.side-content.sticky-sidebar(v-sticky="")

            div.user-info
                router-link(tag="span" v-bind:to="{ name: 'user.addAddress'}" title="پروفایل")
                    div.user-image
                        span(v-if="!this.$store.state.app.smallSidebar")
                            userProgress(v-if="user.user_progress" v-bind:avatar="'https:'+user.avatar" v-bind:user_progress="user.user_progress")
                        img(v-else v-bind:src="'https:' + user.avatar")
                    p.user-name {{user.name}}

                zpId(v-bind:data="user")

                ul
                    router-link(@click.native="toggleMobileSidebar()" v-ripple="" tag="li" v-bind:to="{ name: 'home.index'}" :title="$i18n.t('common.dashboard')")
                        div
                            i.icon-zp-dashboard
                            span.item-label {{ $i18n.t('common.dashboard') }}

                    router-link(@click.native="toggleMobileSidebar()" v-ripple="" tag="li" v-bind:to="{ name: 'webservice.index'}" :title="$i18n.t('common.webservices')")
                        div
                            i.icon-zp-web-service
                            span.item-label {{ $i18n.t('common.webservices') }}

                    router-link(@click.native="toggleMobileSidebar()" v-ripple="" tag="li" v-bind:to="{ name: 'card.index'}" :title="$i18n.t('common.cards')")
                        div
                            i.icon-zp-card
                            span.item-label {{ $i18n.t('common.cards') }}

                    router-link(@click.native="toggleMobileSidebar()" v-ripple="" tag="li" v-bind:to="{ name: 'easypay.index'}" :title="$i18n.t('common.easypay')")
                        div
                            i.icon-zp-easy-pay
                            span.item-label {{ $i18n.t('common.easypay') }}

                    router-link(@click.native="toggleMobileSidebar()" v-ripple="" tag="li" v-bind:to="{ name: 'coupon.index'}" :title="$i18n.t('common.coupons')")
                        div
                            i.icon-zp-copouns
                            span.item-label {{ $i18n.t('common.coupons') }}

                    router-link(@click.native="toggleMobileSidebar()" v-ripple="" tag="li" v-bind:to="{ name: 'ticket.index'}" :title="$i18n.t('common.tickets')")
                        div
                            i.icon-zp-tickets
                            span.item-label {{ $i18n.t('common.tickets') }}

                            span.unread-ticket-count(v-if="this.$store.state.auth.user.ticket_summary.unread > 0") {{ this.$store.state.auth.user.ticket_summary.unread | persianNumbers}}

                div.clear-both
</template>


<script>
import dropDown from './sidebar-dropdown.vue';
import userProgress from './user-progress.vue';
import zpId from './zp-id.vue';
export default {
    name: 'sidebar',
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
        }
    },

    methods: {
        toggleMobileSidebar(condition){
            this.$store.commit('app/toggleMobileSidebar', condition);
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