<template lang="pug">
    div.navbar.row
        div.col-lg-5.col-sm-5.col-xs-5
            span.normal-sidebar-collapse.hidden-xs(@click="toggleSidebar()" v-ripple="")
            span.mobile-sidebar-collapse(@click="toggleMobileSidebar()")
            h4.hidden-xs.navbar-title {{ $i18n.t('panel.' + this.$store.state.app.selectedTab) }}

        router-link.navigation-logo.col.col-lg-2.col-sm-2.col-xs-2(tag="div" v-bind:to="{name: 'home.index'}")
            div.logo.hand

        div.col-lg-5.col-sm-5.col-xs-5.left-box
            img.profile-dropdown-avatar(@click="visibleProfileDropdown = !visibleProfileDropdown" id="btnProfileDropdown" :src="this.$store.state.auth.user.avatar")

            a.notification.notification-fill(v-if="notifications.data.length >= 1" v-ripple="" id="btnNotification" @click="toggleNotification()" title="اعلانات")
            a.notification.notification-empty(v-else v-ripple="" id="btnNotification" @click="toggleNotification()" title="اعلانات")
            span.notification-lamp(v-if="notifications.data.length")
            <!--span.reload.circle-hover(v-ripple="" @click="reload" title="بروز رسانی")-->

            profile-dropdown(id="navProfileDropdown" v-click-outside="closeFromOutside" v-if="visibleProfileDropdown")

        transition(name="fade"
        enter-active-class="fade-in"
        leave-active-class="fade-out")
            div.nav-notification(v-click-outside="closeFromOutside" id="navNotification" v-if="this.$store.state.app.visibleNotification")
                div.content
                    div.row.header
                        div.col-xs.ta-center
                            span.notification-count(v-if="notifications.data.length") {{ notifications.count | persianNumbers}}
                            span.zarinpal-title {{$i18n.t('common.zarinPal')}}
                        div.ta-left
                            <!--span.icon-setting-->

                    div.row.body
                        div.full-width(v-for="notification in notifications.data")
                            <!--Ticket-->
                            router-link.notification-box.col-lg-12.col-md-12.col-xs-12(v-ripple="" v-if="notification.type === 'ticket' && notification.id" tag="div" @click.native="toggleNotification(notification.uuid)" v-bind:to="{ name: 'ticket.show', params: {id: notification.id}}")
                                div.title {{notification.title | persianNumbers}}
                                div.body {{notification.body | less}}

                            <!--Transaction-->
                            router-link.notification-box.col-lg-12.col-md-12.col-xs-12(v-ripple="" v-if="notification.type === 'transaction' && notification.id" tag="div" @click.native="toggleNotification(notification.uuid)" v-bind:to="{ name: 'transaction.index', params: {id: notification.data.purse, type: 'purse', transactionId: notification.id}}")
                                div.title {{notification.title | persianNumbers}}
                                div.body {{notification.body | less}}

                            <!--Request money-->
                            router-link.notification-box.col-lg-12.col-md-12.col-xs-12(v-ripple="" v-if="notification.type === 'request_money' && notification.data.entity_id" tag="div" @click.native="toggleNotification(notification.uuid)" v-bind:to="{ name: 'requestMoney.index', params: {type: 'debt'}}")
                                div.title {{notification.title | persianNumbers}}
                                div.body {{notification.body | less}}

                        div.ta-center.empty-notification.col-lg-12.col-md-12.col-xs-12(v-if="!notifications.data.length")
                            span {{ $i18n.t('common.nothingToShow') }}
</template>

<script>
    import profileDropdown from '../../pages/partials/user/profile-dropdown.vue';

    export default {
        name: 'navBar',
        data() {
            return {
                visibleProfileDropdown: false,
                notificationCount: 0,
            }
        },
        computed: {
            notifications() {
                return {
                    count: this.$store.state.alert.notifications.length,
                    data: this.$store.state.alert.notifications,
                    counter: this.$store.state.alert.counter
                };
            }
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
            toggleNotification(notificationId) {
                if (!notificationId) {
                    notificationId = null;
                }
                //remove ticket OR transaction OR request_money notifications
                _.remove(this.$store.state.alert.notifications, function (notification) {
                    return notification.uuid === notificationId;
                });
                this.$store.state.alert.counter++;

                this.$store.state.app.visibleNotification = !this.$store.state.app.visibleNotification;
            },
            reload() {
                location.reload();
            },
            closeFromOutside() {
                let vm = this;
                document.addEventListener('click', function (e) {
                    if (e.target.id !== 'btnNotification' && e.target.id !== 'navNotification') {
                        vm.$store.state.app.visibleNotification = false;
                    }

//                  && e.target.parentNode.parentNode.id !== 'navProfileDropdown'
                    if (e.target.id !== 'btnProfileDropdown' && e.target.id !== 'btnLogout') {
                        vm.visibleProfileDropdown = false;
                    }
                });
            },
        },
        components: {
            'profile-dropdown': profileDropdown
        }
    }
</script>