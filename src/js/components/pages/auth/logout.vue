// app.vue
<!--<style>-->
<!--</style>-->

<!--<template>-->
<!--</template>-->

<script>
    export default {
        name: 'auth-logout',
        mounted(){
            this.$http.get('oauth/logout.json').then(()=>{
                this.$router.push({name: 'auth.login'});
            })
        },
    }
</script>
