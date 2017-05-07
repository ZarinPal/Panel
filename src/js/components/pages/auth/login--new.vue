<template lang="pug">
    div.row.center-xs(v-if="$store.state.app.isLoaded")
        div.col-xs-11.col-sm-11.col-md-5.col-lg-5.section.login-box
            div.box
                div.row.top-xs
                    span.zp-icon
                    span.zp-title {{ $i18n.t('common.zarinPal') }}
                div.row.middle-xs
                    div.body-messages
                        div.col-lg-12.ta-right
                            p {{ $i18n.t('user.loginToUserAccount') }}
                            span {{ $i18n.t('user.forUseHaveToLogin') }}
                        div.col-lg-12.no-margin
                            input(type="text")

                div.row.bottom-xs
                    div.col-xs.no-margin.ta-right
                        span {{ $i18n.t('user.notRegistered') }}
                        router-link.link(tag="span" v-bind:to="{ name: 'auth.register'}") {{ $i18n.t('user.register') }}
                    div.col-xs.no-margin
                        button.gold.pull-left {{$i18n.t('user.login')}}

            div.row.auth-privacy-footer
                div.col-xs.ta-right
                    router-link.link(tag="span" v-bind:to="{ name: 'auth.register'}") {{$i18n.t('user.backToHomePage')}}
                div.col-xs.ta-left
                    router-link.link(tag="span" v-bind:to="{ name: 'auth.register'}") {{$i18n.t('user.rulesAndRegulations')}}
                    router-link.link(tag="span" v-bind:to="{ name: 'auth.register'}") {{$i18n.t('user.privacy')}}








</template>

<script>

</script>