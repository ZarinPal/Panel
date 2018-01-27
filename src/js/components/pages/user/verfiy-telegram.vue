<template lang="pug">

    confirm(v-if="confirmVisible" v-on:confirmed="verify()" v-on:closeModal="closeModal")
        span(slot="title") {{$i18n.t('user.verifyTelegramTitle')}}
        div.ta-right(slot="message")
            div {{$i18n.t('user.verifyTelegramDesk')}}
        span(slot="messageDanger") {{$i18n.t('common.cancel')}}
        span(slot="messageSuccess") {{$i18n.t('user.verifyTelegramConfirm')}}
</template>


<script>
    import confirm from '../partials/confirm.vue';
    export default {
        name: 'notification-verify',
        data() {
            return {
                confirmVisible: true,
                confirm: false,
            }
        },
        methods: {
            closeModal(){
                this.$router.push({name: 'home.index'})
                this.confirmVisible = false;
            },
            verify(){
                this.confirm = true;
                if (this.confirm) {
                    let params = {
                        uuid: this.$route.params.id
                    };

                    this.$store.state.http.requests['user.postVerifyNotificationSystem'].save(params, {}).then(
                        () => {
                            store.commit('flashMessage', {
                                text: 'UserVerifyTelegramDoneLocal',
                                type: 'success'
                            });
                        },
                        (response) => {
                            store.commit('flashMessage', {
                                text: 'UserVerifyTelegramErrorLocal',
                                type: 'danger'
                            });
                            this.closeModal();
                        }
                    )
                }
            },
        },
        components: {
            confirm,
        }
    };
</script>