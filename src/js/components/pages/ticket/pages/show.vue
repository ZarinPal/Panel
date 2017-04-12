<template lang="pug">
span
    div.nav-ticket-title(v-if="ticket")
        div.row.top-row
            div.col-xs
                span.ticket-title {{ticket.title}}
            div.col-xs
                span.ticket-id.pull-left {{ticket.public_id | persianNumbers}}

        div.ver-line
        div.row.bottom-row
            div.col-lg-3.col-md-3.col-xs-12
                span.title {{ $t('ticket.updated') }} :
                span.value {{ticket.updated_at | fromNow | persianNumbers}}
            div.col-lg-3.col-md-3.col-xs-12
                span.title {{ $t('ticket.created') }} :
                span.value {{ticket.created_at | fromNow | persianNumbers}}
            div.col-lg-3.col-md-3.col-xs-12
                span.title {{ $t('ticket.status') }} :
                span.value {{ $t('ticket.' + kebabCase(ticket.status)) }}
            div.col-lg-3.col-md-3.col-xs-12
                span.priority.pull-left {{ $t('ticket.' + kebabCase(ticket.priority)) }}
                button.btn.success.hidden-lg(v-on:click="closeReplies()") بازگشت


    div.replies
        span(v-for="reply in ticket.replies")
            <!--User Ticket-->
            div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section(v-if="reply.user_info.public_id == user.public_id")
                div.box.ticket
                    div.top-xs.header
                        div.row
                            span.image
                                img(v-bind:src="reply.user_info.avatar")
                            span.nav-ticket-status
                                p.username {{ reply.user_info.name }}
                                p.ticket-date.iransans-light {{reply.created_at | fromNow | persianNumbers}}

                    div.middle-xs.body.ta-right
                        p(v-html="$options.filters.code(reply.content)")


            <!--Admin Ticket-->
            div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section(v-else)
                div.box.ticket
                    div.top-xs.header.admin-header
                        div.row
                            span.image.admin-image
                                img(v-bind:src="reply.user_info.avatar")
                                img.zarinpal-sign(src="assets/img/zarin-logo.png")

                            span.nav-ticket-status
                                p.username {{ reply.user_info.name }}
                                p.ticket-date.iransans-light {{reply.created_at | fromNow | persianNumbers}}

                    div.middle-xs.body.ta-right
                        p(v-html="$options.filters.code(reply.content)")

    div.nav-send
        div.row
            div
                img.pull-right(v-bind:src="'https://www.gravatar.com/avatar/'+user.email_hash+'?s=45&d=https://cdn.zarinpal.com/emails/img/zarinpal-email-profile-default.png'")
            div.col-xs
                div
                    b.title پاسخ به تیکت:
                    span.value {{ ticket.title }}
                div
                    textarea(placeholder="متن پاسخ تیکت..." v-model="content")
                button.submit(@click="send") {{ $t('ticket.send')}}
                input.attach(type="file")

</template>

<script>
    export default {
        name: 'ticket-show',
        data() {
          return {
              ticket: {},
              content: '',
              errorMessage: '',
              unsafeString: '<p>Hello World</p>'
          }
        },
        computed: {
            user(){
                return this.$store.state.auth.user;
            },
            content() {

            }
        },
        created() {
            this.getReplies(this.$route.params.id);
            let vm = this;
            window.onscroll = function () {
                if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
                    vm.$store.dispatch(
                        'paginator/next'
                    );
                }
            };

            //Change ticket list new ticket button
            this.$store.commit('app/changeTicketState');
        },
        methods: {
            getReplies(id){
                let ticket = {};
                this.$store.state.http.requests['ticket.Reply'].get({ticket_id: id}).then(data => {
                    ticket = data.data;
                    this.ticket = ticket.data;
                });
            },
            send() {
                let ticketData = {
                    content : this.content,
                };

                let params = {
                    ticket_id: this.$route.params.id
                };

                this.$store.state.http.requests['ticket.Reply'].save(params, ticketData).then(
                    ()=> {
                        this.$router.push({name: 'ticket.index'})
                    },
                    (response) => {
                        store.commit('flashMessage',{
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
            }
        },
        watch: {
            '$route' (to) {
                this.getReplies(to.params.id)
            }
        },

    }
</script>
