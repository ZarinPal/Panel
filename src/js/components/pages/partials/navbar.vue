<template lang="pug">
    div.navbar.row
        div.col-lg-5.col-sm-5.col-xs-5
            span.normal-sidebar-collapse.hidden-xs(@click="toggleSidebar()" v-ripple="")
            span.mobile-sidebar-collapse(@click="toggleMobileSidebar()")
            h4.hidden-xs.navbar-title پیشخوان

        router-link.navigation-logo.col.col-lg-2.col-sm-2.col-xs-2(tag="div" v-bind:to="{name: 'home.index'}")
            div.logo

        div.col-lg-5.col-sm-5.col-xs-5.left-box
            span.logout(@click="confirmVisible = true" title="خروج" v-ripple="")
            a.notification(v-ripple="" id="btnNotification" :class="{'disable-notification-icon' : notifications == 0}" @click="toggleNotification()" title="اعلانات")
            span.notification-lamp(v-if="notifications.length")
            span.reload.circle-hover(v-ripple="" @click="reload" title="بروز رسانی")
        transition(name="fade"
        enter-active-class="fade-in"
        leave-active-class="fade-out")
            div.nav-notification(v-click-outside="closeNotificationFromOutside" id="navNotification" v-if="this.$store.state.app.visibleNotification")
                div.content
                    div.row.header
                        div.col-xs.ta-center
                            span.notification-count(v-if="notifications.length") {{notificationCount | persianNumbers}}
                            span.zarinpal-title {{$i18n.t('common.zarinPal')}}
                        div.ta-left
                            <!--span.icon-setting-->

                    div.row.body
                        div.full-width(v-for="notification in notifications")
                            <!--Ticket-->
                            router-link.notification-box.col-lg-12.col-md-12.col-xs-12(v-ripple="" v-if="notification.type === 'ticket'" tag="div" @click="toggleNotification()" v-bind:to="{ name: 'ticket.show', params: {id: notification.id}}")
                                div.title {{notification.title | persianNumbers}}
                                div.body {{notification.body | less}}

                            <!--Transaction-->
                            router-link.notification-box.col-lg-12.col-md-12.col-xs-12(v-ripple="" v-if="notification.type === 'transaction'" tag="div" @click="toggleNotification()" v-bind:to="{ name: 'transaction.index', params: {id: 1, type: 'purse', transactionId: notification.id}}")
                                div.title {{notification.title | persianNumbers}}
                                div.body {{notification.body | less}}

                            <!--Request money-->
                            router-link.notification-box.col-lg-12.col-md-12.col-xs-12(v-ripple="" v-if="notification.type === 'request_money'" tag="div" @click="toggleNotification()" v-bind:to="{ name: 'requestMoney.index', params: {type: 'debt'}}")
                                div.title {{notification.title | persianNumbers}}
                                div.body {{notification.body | less}}

                        div.ta-center.empty-notification.col-lg-12.col-md-12.col-xs-12(v-if="!notifications.length")
                            span هیچ موردی برای نمایش وجود ندارد


        confirm(v-if="confirmVisible" v-on:confirmed="logout()" v-on:closeModal="closeModal")
            span(slot="title") خروج
            div.ta-right(slot="message")
                div آیا خارج می شوید؟

            span(slot="messageDanger") {{$i18n.t('common.cancel')}}
            span(slot="messageSuccess") بله، خارج می شوم


</template>

<script>
    import confirm from '../partials/confirm.vue';
    export default {
        name:'navBar',
        data() {
            return {
                notificationCount: '',
                confirmVisible: false,
                confirm: false,
            }
        },
        computed: {
            notifications() {
                this.notificationCount = this.$store.state.alert.notifications.length;
                return this.$store.state.alert.notifications
            }
        },
        created(){
            console.log(this.$store.state.app.visibleNotification);
            this.$store.dispatch('startWebPushSocket');
        },
        methods: {
            closeModal(){
                this.confirmVisible = false;
            },
            toggleSidebar() {
                this.$store.commit('app/toggleSidebar');
            },
            toggleMobileSidebar(){
                this.$store.commit('app/toggleMobileSidebar');
            },
            logout(){
                this.confirm = true;
                if(this.confirm) {
                    this.$store.dispatch('auth/logout',this);
                }
            },
            toggleNotification() {
                this.$store.state.app.visibleNotification = !this.$store.state.app.visibleNotification;
            },
            reload() {
                location.reload();
            },
            closeNotificationFromOutside() {
                let vm = this;
                document.addEventListener('click', function(e) {
                    if(e.target.id !== 'btnNotification' && e.target.id !== 'navNotification') {
                        vm.$store.state.app.visibleNotification = false;
                    }
                }, false);
            }
        },
        components: {
            confirm
        }
    }
</script>