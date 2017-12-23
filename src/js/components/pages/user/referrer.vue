<template lang="pug">
    modal.request-personal-link(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('user.referredUsers') }}
        div(slot="content")

            <!--Referrer link-->
            div.row.referrer-link
                div.col-xs.ta-left.no-margin
                    div.row.label-group.pull-left
                        div.col-xs.text.merchant-code
                            input.txt-referrer-link(:id="'txtReferrerId-' + referrer.public_id" onfocus="this.select();" v-bind:value="referrer.public_id" readonly="readonly")
                        div.icon(@click="clipboardMessage(referrer.public_id)" v-clipboard="" v-bind:data-clipboard-text="referrer.link")


            <!--Referred Users-->
            div.referrer-box(v-if="referredUsers")
                loading(v-if="loadingData")

                div.row(v-else v-for="referrer in referredUsers")
                    div.col-lg-2
                        img(:src="referrer.avatar")
                    div.col-lg-5
                        span {{referrer.name}}
                        span {{referrer.public_id}}
                    div.col-lg-5
                        span {{referrer.referrer_fee}}

</template>


<script>
    import modal from "../partials/modal";
    import loading from "../partials/loading";
    export default {
        name: 'user-referrer',
        data() {
            return {
                loadingData: true,
                referredUsers: {},
                referrer: {
                    public_id: 123,
                    link: 'https:link'
                }
            }
        },
        created() {
            this.getReferrerLink();
            this.getReferredUsers();
        },
        methods: {
            getReferrerLink() {

            },
            getReferredUsers() {
                this.$store.state.http.requests['user.referred']
                    .get({userPublicId: this.$store.state.auth.user.public_id})
                    .then((response) => {
                            this.referredUsers = response.data.data;
                            this.loadingData = false;
                        }, (response) => {
                            store.commit('setValidationErrors', response.data.validation_errors);
                            store.commit('flashMessage', {
                                text: response.data.meta.error_message,
                                type: 'danger'
                            });
                        }
                    );
            },
            clipboardMessage(event) {
                setTimeout(function () {
                    let txtReferrerId = document.getElementById('txtReferrerId-' + event);
                    if (txtReferrerId) {
                        txtReferrerId.select();
                    }
                }, 10);

                store.commit('flashMessage', {
                    text: 'copied',
                    type: 'success',
                    timeout: '1500'
                });
            },
            closeModal() {
                this.$emit('closeModal');
            }
        },
        components: {
            modal,
            loading
        }
    }
</script>