<template lang="pug">
    div.navbar.row
        div.col-lg-4.col-sm-4.col-xs-4
            span.normal-sidebar-collapse.circle-hover.hidden-xs(v-ripple="" @click="toggleSidebar()")
            span.mobile-sidebar-collapse(@click="toggleMobileSidebar()")
            h4.hidden-xs.navbar-title پیشخوان

        div.navigation-logo.col.col-lg-4.col-sm-4.col-xs-4
            img(src="assets/img/zarin-logo.png")

        div.col-lg-4.col-sm-4.col-xs-4.left-box
            a.logout(@click="logout()" title="خروج")
            a.notification

</template>

<script>
export default {
    name:'navBar',
    created(){
        this.$store.dispatch('startWebPushWorker');
    },
    methods: {
        toggleSidebar(){
            this.$store.commit('app/toggleSidebar');
        },
        toggleMobileSidebar(){
            this.$store.commit('app/toggleMobileSidebar');
        },
        logout(){
            this.$store.dispatch('auth/logout',this);
        },
    }
}
</script>