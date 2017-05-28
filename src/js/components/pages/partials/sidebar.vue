<template lang="pug">
    div(v-bind:class="{'small-sidebar hidden-sidebar': isSmallSidebar, 'normal-sidebar hidden-sidebar': !isSmallSidebar, 'mobile-sidebar': isMobileSidebar}")
        span.close-mobile-sidebar(@click="toggleMobileSidebar()")
        div.side-content.sticky-sidebar(v-sticky="")

            div.user-info
                div.user-image
                    span(v-if="!this.$store.state.app.smallSidebar")
                        userProgress(v-if="user.user_progress" v-bind:avatar="'https:'+user.avatar" v-bind:user_progress="user.user_progress")
                    img(v-else v-bind:src="'https:' + user.avatar")
                p.user-name {{user.name}}

                div.nav-zp-id(v-bind:class="{'nav-zp-gold': user.level == '3', 'nav-zp-silver': user.level == '2' }")
                    span ZP. {{user.public_id}}
                    span.zp-id-color(v-bind:class="{'zp-id-gold': user.level == '3', 'zp-id-silver': user.level == '2' }")
                        small.icon-zarinpal
                        span(v-if="user.level == '3'") {{$i18n.t('user.user_level_3')}}
                        span(v-else-if="user.level == '2'") {{$i18n.t('user.user_level_2')}}
                        span(v-else-if="user.level == '1'") {{$i18n.t('user.user_level_1')}}

                ul
                    router-link(@click.native="toggleMobileSidebar()" v-ripple="" tag="li" v-bind:to="{ name: 'home.index'}" title="پیشخوان")
                        div
                            i.icon-zp-dashboard
                            span.item-label پیشخوان

                    router-link(@click.native="toggleMobileSidebar()" v-ripple="" tag="li" v-bind:to="{ name: 'webservice.index'}" title="درگاه های پرداخت")
                        div
                            i.icon-zp-web-service
                            span.item-label درگاه های پرداخت

                    router-link(@click.native="toggleMobileSidebar()" v-ripple="" tag="li" v-bind:to="{ name: 'card.index'}" title="حساب های بانکی")
                        div
                            i.icon-zp-card
                            span.item-label حساب های بانکی

                    router-link(@click.native="toggleMobileSidebar()" v-ripple="" tag="li" v-bind:to="{ name: 'easypay.index'}" title="آسان پرداخت")
                        div
                            i.icon-zp-easy-pay
                            span.item-label آسان پرداخت

                    router-link(@click.native="toggleMobileSidebar()" v-ripple="" tag="li" v-bind:to="{ name: 'coupon.index'}" title="کپن ها")
                        div
                            i.icon-zp-copouns
                            span.item-label کوپن های تخفیف

                    router-link(@click.native="toggleMobileSidebar()" v-ripple="" tag="li" v-bind:to="{ name: 'ticket.index'}" title="تیکت ها")
                        div
                            i.icon-zp-tickets
                            span.item-label تیکت ها

                div.clear-both
</template>


<script>
import dropDown from './sidebar-dropdown.vue';
import userProgress from './user-progress.vue';
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
        userProgress
    }

}

</script>