<template lang="pug">
    span
        transition(name="fade"
        enter-active-class="fade-in"
        leave-active-class="fade-out")
            div.nav-profile-dropdown(id="navProfileDropdown")
                div.head
                    img.avatar(:src="user.avatar")
                    span.name {{user.name}}
                    span.zp-id {{user.mobile | persianNumbers}}
                div.body
                    router-link.items(v-ripple="" tag='div' v-bind:to="{ name: 'user.addAddress'}")
                        span.icon.location {{$i18n.t('user.addNewAddress')}}
                    router-link.items(v-ripple="" tag='div' v-bind:to="{ name: 'user.notificationSetting'}")
                        span.icon.notif {{$i18n.t('user.notificationSetting')}}

                    div.divider
                    div.items(v-ripple="" @click="confirmVisible = true")
                        span.icon.logout {{$i18n.t('common.logout')}}

        <!--Logout confirm dialog-->
        confirm(v-if="confirmVisible" v-on:confirmed="logout()" v-on:closeModal="closeModal")
            span(slot="title") {{$i18n.t('common.logout')}}
            div.ta-right(slot="message")
                div آیا خارج می شوید؟

            span(slot="messageDanger") {{$i18n.t('common.cancel')}}
            span(slot="messageSuccess") بله، خارج می شوم
</template>


<script>
    import confirm from '../confirm.vue';

    export default {
        name: 'profile-drop-down',
        data() {
            return {
                confirmVisible: false,
                confirm: false,
            }
        },
        computed: {
            user() {
                return this.$store.state.auth.user;
            }
        },
        methods: {
            closeModal(){
                this.confirmVisible = false;
            },
            logout(){
                this.confirm = true;
                if(this.confirm) {
                    this.$store.dispatch('auth/logout',this);
                }
            },
        },
        components: {
        confirm,
    }
    };
</script>