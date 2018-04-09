<template lang="pug">
div
    div(v-if="!requesting")
        div {{ticket}}

    div
        form(onsubmit="event.preventDefault();")
            textarea(v-validate="{ rules: { min: 10, max:10000}}" v-bind:data-vv-as="$i18n.t('ticket.ticketReplyContent')" :class="{'input-danger': errors.has('content')}" :placeholder="$i18n.t('ticket.ticketReplyContent')" v-model="content" name="content")
            div.ta-right(v-if="validation('content')")
                span.text-danger {{ errors.first('content') }}

            button.submit(@click="validateForm" :class="{'disable': loading}") {{ $i18n.t('ticket.send')}}
                svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                    circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")
            label.attach
                span.select-text(:class="{'uploaded' : fileUploaded}")
                input(type="file" name="file" @change="onFileChange")
                span.msg-danger(v-if="uploadResult.error_message") {{ $i18n.t('ticket.' + uploadResult.error_type)}}
                span.msg-success(v-if="uploadResult.file_id") {{ $i18n.t('ticket.uploadSuccess')}}
            span.nav-upload-loading(v-if="fileUploading")
                loading

</template>

<script>
    import loading from '../partials/loading.vue';

    export default {
        name: 'ticket-guest',
        data() {
            return {
                requesting: true,
                loading: false,
                fileUploading: false,
                uploadResult: false,
                fileUploaded: false,

                /**
                 * Get Ticket
                 */
                email: btoa('amin@gmail.com'),
                publicId: btoa('139701200198'),
                ticket: {},

                /**
                 * Post Ticket Reply
                 */
                content: null,
                attachment: null,
            }
        },
        created() {
            this.getGuestTicket();
        },
        methods: {
            validateForm() {
                this.$validator.validateAll({
                    content: this.content,
                }).then((result) => {
                    if (result) {
                        this.postTicketReply();
                    }
                });
            },
            onFileChange(e) {
                let files = e.target.files || e.dataTransfer.files;
                if (!files.length)
                    return;
                this.createFile(files[0]);
            },
            createFile(file) {
                this.fileUploading = true;
                let reader = new FileReader();
                let vm = this;

                reader.onload = (e) => {
                    vm.attachment = e.target.result;
                };
                reader.readAsDataURL(file);

                let formData = new FormData();
                formData.append('type', 'document');
                formData.append('file', file);

                this.$http.post('https://uploads.zarinpal.com/', formData, {emulateHTTP: true}).then((response) => {
                    this.attachment = response.data.meta.file_id;
                    this.fileUploading = false;
                    this.fileUploaded = true;
                    this.uploadResult = response.data.meta;
                }, (response) => {
                    this.fileUploading = 'Failed';
                });
            },
            getGuestTicket() {
                let vm = this;
                this.$store.state.http.requests['getReply'].get({
                    email: this.email,
                    publicId: this.publicId,
                }).then((response) => {
                    vm.ticket = response.data.data;
                    vm.requesting = false;
                }).catch(() => {
                    vm.requesting = false;
                });
            },
            postTicketReply() {
                let params = {
                    email: this.email,
                    publicId: this.publicId,
                };

                let ticketData = {
                    content: this.content,
                    attachment: this.attachment
                };

                this.$store.state.http.requests['getReply'].save(params, ticketData).then(
                    () => {
                        this.content = '';
                        this.getGuestTicket(this.$route.params.id);
                        this.loading = false;
                        this.validationErrors.content = '';
                        store.commit('flashMessage', {
                            text: 'TicketReplySuccessLocal',
                            type: 'success'
                        });
                    },
                    (response) => {
                        this.loading = false;
                        store.commit('setValidationErrors', response.data.validation_errors);
                        store.commit('flashMessage', {
                            text: response.data.meta.error_type,
                            type: 'danger'
                        });
                    }
                )

            }
        },
        components: {
            loading
        },
    }
</script>