<template lang="pug">
    div(v-bind:class="{'small-sidebar hidden-sidebar': isSmallSidebar, 'normal-sidebar hidden-sidebar': !isSmallSidebar, 'mobile-sidebar': isMobileSidebar}")
        span.close-mobile-sidebar(@click="toggleMobileSidebar()")
        div.side-content.sticky-sidebar(v-sticky)

            div.user-info
                div.user-image
                    userProgress(v-if="user.user_progress" v-bind:avatar="user.avatar" v-bind:user_progress="user.user_progress")
                p.user-name {{user.name}}

                div.nav-zp-id(v-bind:class="{'nav-zp-gold': user.level == 'gold', 'nav-zp-silver': user.level == 'silver' }")
                    span ZP. {{user.public_id}}
                    span.zp-id-color(v-bind:class="{'zp-id-gold': user.level == 'gold', 'zp-id-silver': user.level == 'silver' }")
                        img(src="assets/img/zarin-black-logo.png")
                        span(v-if="user.level == 'gold'") {{$t('user.user_level_3')}}
                        span(v-else-if="user.level == 'silver'") {{$t('user.user_level_2')}}

                ul
                    router-link(v-ripple tag="li" v-bind:to="{ name: 'home.index'}" title="پیشخوان")
                        div
                            i.icon-ic_flash_on_black_48px
                            span.item-label پیشخوان

                    router-link(v-ripple tag="li" v-bind:to="{ name: 'webservice.index'}" title="درگاه های پرداخت")
                        div
                            i.icon-ic_flash_on_black_48px
                            span.item-label درگاه های پرداخت

                    router-link(v-ripple tag="li" v-bind:to="{ name: 'card.index'}" title="حساب های بانکی")
                        div
                            i.icon-ic_flash_on_black_48px
                            span.item-label حساب های بانکی

                    router-link(v-ripple tag="li" v-bind:to="{ name: 'easypay.index'}" title="آسان پرداخت")
                        div
                            i.icon-ic_flash_on_black_48px
                            span.item-label آسان پرداخت

                    router-link(v-ripple tag="li" v-bind:to="{ name: 'coupon.index'}" title="کپن ها")
                        div
                            i.icon-ic_flash_on_black_48px
                            span.item-label کوپن های تخفیف

                    router-link(v-ripple tag="li" v-bind:to="{ name: 'ticket.index'}" title="تیکت ها")
                        div
                            i.icon-ic_flash_on_black_48px
                            span.item-label تیکت ها

                    <!--Dropdown Example-->
                    <!--dropDown(label='تیکت ها' icon='icon-ic_flash_on_black_48px')-->
                        <!--ul.submenu-->
                            <!--router-link(tag="li" v-bind:to="{ name: 'ticket.index'}" title="تیکت ها")-->
                                <!--span تیکت ها-->


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