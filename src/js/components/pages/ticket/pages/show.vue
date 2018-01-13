<template lang="pug">
    span
        div.nav-ticket-title(v-if="ticket")
            div.row.top-row
                div.col-xs
                    span.ticket-title {{ticket.title}}
                div.col-xs
                    span.ticket-id.pull-left.persian-num(@click="clipboardMessage()" v-clipboard="" v-bind:data-clipboard-text="ticket.public_id") {{ticket.public_id }}
                    button.btn.info.close-ticket.pull-left(v-if="ticket.status != 'close'" @click="closeTicket()") {{ $i18n.t('ticket.closeTicket')}}

            div.ver-line

            div.row.bottom-row(v-if="!isLoadReplies")
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
            div.col-xs.ta-center
                loading(v-if="isLoadReplies")
            span(v-for="reply in ticket.replies")
                <!--User Ticket-->
                div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section(v-if="reply.user_info.public_id == user.public_id")
                    div.box.ticket
                        div.top-xs.header
                            div.row
                                span.image
                                    img(v-avatar="" v-bind:src="'https:'+reply.user_info.avatar")
                                span.nav-ticket-status
                                    p.username {{ reply.user_info.name }}
                                    p.ticket-date.iransans-light.persian-num {{reply.created_at | fromNow }}

                        div.middle-xs.body.ta-right
                            pre(v-html="$options.filters.code(reply.content)")
                            a.ticket-attachment-download(v-if="reply.attachment" @click="downloadAttachFile(reply.attachment)") {{ $i18n.t('ticket.downloadFile') }}

                <!--Admin Ticket-->
                div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section(v-else)
                    div.box.ticket
                        div.top-xs.header.admin-header
                            div.row
                                span.image.admin-image
                                    img(v-avatar="" v-bind:src="'https:'+reply.user_info.avatar")
                                    div.zarinpal-sign

                                span.nav-ticket-status
                                    p.username {{ reply.user_info.name }}
                                    p.ticket-date.iransans-light.persian-num {{reply.created_at | fromNow }}

                        div.middle-xs.body.ta-right
                            pre(v-html="$options.filters.code(reply.content)")
                            a.ticket-attachment-download(v-if="reply.attachment" v-bind:href="reply.attachment") {{ $i18n.t('ticket.downloadFile') }}


        div.nav-send
            div.row
                div
                    img.pull-right(v-avatar="" v-bind:src="'https://www.gravatar.com/avatar/'+user.email_hash+'?s=45&d=https://cdn.zarinpal.com/emails/img/zarinpal-email-profile-default.png'")
                div.col-xs
                    div
                        b.title پاسخ به تیکت:
                        span.value {{ ticket.title }}
                    div
                        textarea(v-validate="{ rules: { min: 10, max:10000}}" v-bind:data-vv-as="$i18n.t('ticket.ticketReplyContent')" :class="{'input-danger': errors.has('content')}" :placeholder="$i18n.t('ticket.ticketReplyContent')" v-model="content" name="content")
                        div.ta-right(v-if="validation('content')")
                            span.text-danger {{ errors.first('content') }}

                        button.submit(@click="validateForm") {{ $i18n.t('ticket.send')}}
                            svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")
                            <!--input.attach(type="file" name="file" @change="onFileChange" :class="{'uploaded' : fileUploaded}")-->
                        label.attach
                            span.select-text(:class="{'uploaded' : fileUploaded}")
                            input(type="file" name="file" @change="onFileChange")

                        span(v-if="fileUploading == 'Failed'") upload failed
                        span.nav-upload-loading(v-if="fileUploading")
                            loading

</template>

<script>
    import loading from '../../partials/loading.vue';
    export default {
        name: 'ticket-show',
        data() {
            return {
                fileUploading: false,
                fileUploaded: false,
                loading: false,
                isLoadReplies: false,
                ticket: {},
                content: '',
                errorMessage: '',
                attachment: null,
            }
        },
        computed: {
            user(){
                return this.$store.state.auth.user;
            },
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
            loadingTicketState() {
                return {
                    status: this.$store.state.paginator.paginator.TicketList.isLoading,
                    update: this.$store.state.paginator.update,
                }
            },
        },
        created() {
            store.commit('clearValidationErrors');
            //Change ticket list new ticket button
            this.$store.commit('app/changeTicketState');
        },
        mounted() {
            this.getReplies(this.$route.params.id);
            let vm = this;
            let ticketContent = document.getElementById('ticketContent');

            ticketContent.addEventListener("scroll", function (e) {
                if (ticketContent.scrollHeight - ticketContent.scrollTop === ticketContent.clientHeight
                    && !vm.loadingTicketState.status) {
                    vm.$store.dispatch(
                        'paginator/next',
                        {
                            requestName: 'TicketList'
                        }
                    );
                }
            });
        },
        methods: {
            validation(name) {
                if (this.$store.state.alert.validationErrors[name]) {
                    let element = _.find(this.$validator.fields.items, function (field) {
                        return field.name == name;
                    });
                    this.errors.add(
                        name,
                        this.$validator.dictionary.container.fa.messages[this.$store.state.alert.validationErrors[name].rule](
                            element.el.dataset.vvAs,
                            this.$store.state.alert.validationErrors[name].params
                        ),
                        'api'
                    );
                    this.$store.state.alert.validationErrors[name] = false;
                }
                return this.errors.has(name);
            },
            validateForm() {
                this.$validator.validateAll({
                    content: this.content,
                }).then((result) => {
                    if (result) {
                        this.send();
                    }
                });
            },
            getReplies(id){
                this.isLoadReplies = true;
                let ticket = {};
                this.$store.state.http.requests['ticket.Reply'].get({ticket_id: id}).then(data => {
                    this.isLoadReplies = false;
                    ticket = data.data;
                    this.ticket = ticket.data;

                    setTimeout(function () {
                        let replies = document.getElementById("navTickets");
                        replies.scrollTop = replies.scrollHeight;
                    }, 10);
                });
            },
            send() {
                this.loading = true;
                let ticketData = {
                    content: this.content,
                    attachment: this.attachment,
                };

                let params = {
                    ticket_id: this.$route.params.id
                };

                this.$store.state.http.requests['ticket.Reply'].save(params, ticketData).then(
                    () => {
                        this.content = '';
                        this.getReplies(this.$route.params.id);
                        this.loading = false;
                        this.validationErrors.content = '';
                    },
                    (response) => {
                        this.loading = false;
                        store.commit('setValidationErrors', response.data.validation_errors);
                        store.commit('flashMessage', {
                            text: response.data.meta.error_message,
                            type: 'danger'
                        });
                    }
                )
            },
            closeReplies() {
                this.$emit('closeReplies')
            },
            kebabCase(value) {
                return _.kebabCase(value);
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
                }, (response) => {
                    this.fileUploading = 'Failed';
                });
            },
            closeTicket() {
                let params = {
                    ticketId: this.$route.params.id
                };

                this.$store.state.http.requests['ticket.postClose'].update(params, {}).then(
                    () => {
                        this.$router.push({name: 'ticket.index'})
                    },
                    (response) => {
                        store.commit('flashMessage', {
                            text: response.data.meta.error_message,
                            type: 'danger'
                        });
                    }
                )
            },
            clipboardMessage() {
                store.commit('flashMessage', {
                    text: 'copied',
                    type: 'success',
                    timeout: '500'

                });
            },
            downloadAttachFile(url) {
                window.open(url);
            }
        },
        watch: {
            '$route' (to) {
                this.getReplies(to.params.id)
            }
        },
        components: {
            loading,
        }
    }
</script>
