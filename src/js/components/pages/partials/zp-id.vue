<template lang="pug">
    div.nav-zp-id(v-bind:class="{'nav-zp-gold': user.level == '3', 'nav-zp-silver': user.level == '2', 'nav-zp-gray': user.level == '1', 'nav-zp-black': user.level == '-1', 'nav-zp-black': user.level == '0' }")
        span ZP. {{user.public_id}}
        span.zp-id-color(v-bind:class="{'zp-id-gold': user.level == '3', 'zp-id-silver': user.level == '2', 'zp-id-gray': user.level == '1' , 'zp-id-black': user.level == '-1', 'zp-id-black': user.level == '0' }")
            small.icon-zarinpal.zp-id-just-color
            span(v-if="user.level == '3'") {{$i18n.t('user.user_level_3')}}
            span(v-else-if="user.level == '2'") {{$i18n.t('user.user_level_2')}}
            span(v-else-if="user.level == '1'") {{$i18n.t('user.user_level_1')}}
            span(v-else-if="user.level == '-1'") {{$i18n.t('user.user_level_-1')}}
            span(v-else-if="user.level == '0'") {{$i18n.t('user.user_level_0')}}
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