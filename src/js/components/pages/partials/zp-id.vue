<template lang="pug">
    div.nav-zp-id(v-bind:class="{'nav-zp-gold': user.level == '3', 'nav-zp-silver': user.level == '2' }")
        span ZP. {{user.public_id}}
        span.zp-id-color(v-bind:class="{'zp-id-gold': user.level == '3', 'zp-id-silver': user.level == '2' }")
            small.icon-zarinpal
            span(v-if="user.level == '3'") {{$i18n.t('user.user_level_3')}}
            span(v-else-if="user.level == '2'") {{$i18n.t('user.user_level_2')}}
            span(v-else-if="user.level == '1'") {{$i18n.t('user.user_level_1')}}
</template>


<script>
export default {
    name: 'zp-id',
    props: [
        'data',
    ],
    computed: {
        user(){
            return this.data;
        }
    },
};
</script>