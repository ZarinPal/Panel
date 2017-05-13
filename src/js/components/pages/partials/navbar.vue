<template lang="pug">
    div.navbar.row
        div.col-lg-4.col-sm-4.col-xs-4
            span.normal-sidebar-collapse.hidden-xs(v-ripple="" @click="toggleSidebar()")
            span.mobile-sidebar-collapse(@click="toggleMobileSidebar()")
            h4.hidden-xs.navbar-title پیشخوان

        div.navigation-logo.col.col-lg-4.col-sm-4.col-xs-4
            img(src="assets/img/zarin-logo.png")

        div.col-lg-4.col-sm-4.col-xs-4.left-box
            a.logout(@click="logout()" title="خروج" v-ripple="")
            span.notification-lamp(v-if="notifications.length")
            a.notification.circle-hover(:class="{'disable-notification-icon' : notifications == 0}" @click="toggleNotification()" v-ripple="")


        div.nav-notification(v-if="this.$store.state.app.visibleNotification")
            div.content
                div.row.header
                    div.col-xs.ta-center
                        span.notification-count(v-if="notifications.length") {{notificationCount | persianNumbers}}
                        span.zarinpal-title {{$i18n.t('common.zarinPal')}}
                    div.ta-left
                        <!--span.icon-setting-->

                div.row.body
                    router-link.notification-box.col-lg-12.col-md-12.col-xs-12( v-for="notification in notifications" v-if="notification.type == 'ticket'" v-bind:to="{ name: 'ticket.show', params: {id: notification.id}}")
                        div.title {{notification.title}}
                        div.body {{notification.body | less}}

                    router-link.notification-box.col-lg-12.col-md-12.col-xs-12( v-for="notification in notifications" v-else-if="notification.type == 'transaction'" v-bind:to="{ name: 'transaction.show', params: {public_id: notification.id}}")
                        div.title {{notification.title}}
                        div.body {{notification.body | less}}

                    div.ta-center.empty-notification.col-lg-12.col-md-12.col-xs-12(v-if="!notifications.length")
                        span هیچ موردی برای نمایش وجود ندارد



</template>

<script>
export default {
    name:'navBar',
    data() {
        return {
            visibleNotification: false,
            notificationCount: '',
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
        toggleSidebar() {
            this.$store.commit('app/toggleSidebar');
        },
        toggleMobileSidebar(){
            this.$store.commit('app/toggleMobileSidebar');
        },
        logout(){
            this.$store.dispatch('auth/logout',this);
        },
        toggleNotification() {
            this.$store.state.app.visibleNotification = !this.$store.state.app.visibleNotification;
        }
    }
}
</script>