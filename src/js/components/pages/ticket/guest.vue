<template lang="pug">
    div.ticket-main-content
        div.col-xs.nav-tickets.full-width
            div.nav-ticket-title(v-if="!requesting")
                div.row.top-row
                    div.col-xs
                        span.ticket-title {{ticket.title}}
                    div.col-xs
                        span.ticket-id.pull-left.persian-num(@click="clipboardMessage()" v-clipboard="" v-bind:data-clipboard-text="ticket.public_id") {{ticket.public_id }}
                div.ver-line

                div.row.bottom-row
                    div.col-lg-4.col-md-4.col-sm-4.col-xs-12
                        span.title {{ $i18n.t('ticket.updated') }} :
                        span.value.persian-num {{ticket.updated_at | fromNow }}
                    div.col-lg-5.col-md-4.col-sm-4.col-xs-12
                        span.title {{ $i18n.t('ticket.created') }} :
                        span.value.persian-num {{ticket.created_at | fromNow }}
                    div.col-lg-3.col-md-4.col-sm-4.col-xs-12
                        span.status.pull-left {{ $i18n.t('ticket.' + kebabCase(ticket.status)) }}
                        span.priority.pull-left {{ $i18n.t('ticket.' + kebabCase(ticket.priority)) }}
                        button.btn.success.hidden-lg(v-on:click="closeReplies()") بازگشت

            div.replies
                span(v-for="reply in ticket.replies")
                    <!--User Ticket-->
                    div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section
                        div.box.ticket
                            div.top-xs.header
                                div.row
                                    span.image
                                        img(v-avatar="" v-bind:src="'https:' + reply.user_info.avatar")
                                    span.nav-ticket-status
                                        p.username {{ reply.user_info.name }}
                                        p.ticket-date.iransans-light.persian-num {{reply.created_at | fromNow }}

                            div.middle-xs.body.ta-right
                                pre(v-html="$options.filters.code(reply.content)")
                                a.ticket-attachment-download(v-if="reply.attachment" @click="downloadAttachFile(reply.attachment)") {{ $i18n.t('ticket.downloadFile') }}

            div.nav-send
                div.row
                    div.col-xs
                        div
                            b.title لطفا به نکات زیر توجه فرمایید:
                            div * پس از ارسال تیکت حداکثر تا ۱۲ ساعت آینده پاسخ برای شما ارسال خواهد شد.
                            div * برخی از تيکت ها ممکن است، نياز به زمان بيشتری برای بررسی داشته باشند.
                            div * پس از ارسال تيکت، نيازی به تماس تلفنی نيست. تيکت ارسالی شما قطعا توسط همکاران ما بررسی و پاسخ داده خواهد شد.
            div.nav-send
                div.row
                    div.col-xs
                        div
                            b.title پاسخ به تیکت:
                            span.value {{ ticket.title }}
                        div
                            textarea(v-validate="{ rules: { min: 10, max:10000}}" v-bind:data-vv-as="$i18n.t('ticket.ticketReplyContent')" :class="{'input-danger': errors.has('content')}" :placeholder="$i18n.t('ticket.ticketReplyContent')" v-model="content" name="content")
                            div.ta-right(v-if="validation('content')")
                                span.text-danger {{ errors.first('content') }}

                            button.submit(@click="validateForm" :class="{'disable': loading}") {{ $i18n.t('ticket.send')}}
                                svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                    circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")
                                <!--input.attach(type="file" name="file" @change="onFileChange" :class="{'uploaded' : fileUploaded}")-->
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
                email: this.$route.params.email,
                publicId: this.$route.params.publicId,
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
            kebabCase(value) {
                return _.kebabCase(value);
            },
            clipboardMessage() {
                store.commit('flashMessage', {
                    text: 'Copied',
                    type: 'success',
                    timeout: '500'

                });
            },
            downloadAttachFile(url) {
                window.open(url);
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