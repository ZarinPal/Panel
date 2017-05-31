<template lang="pug">
    div.inner-content
        div.nav-ticket-empty
            div.no-ticket-image
            span.emptyText یک تیکت را برای نمایش انتخاب کنید

</template>

<script>
    export default {
        name: 'ticket-empty',
        data () {
            return {
//                resource: this.$resource('ticket/{public_id}.json')
            }
        },
        created() {
            //Change ticket list new ticket button
            if(!this.$store.state.app.isTicketEmptyPage) {
                this.$store.commit('app/changeTicketState');
            }
        },
        mounted(){
            this.data = [
                {
                    name: 'empty'
                }
            ];
//            this.ajaxGet(this.$route.params.public_id);
//            this.$store.state.http.requests['ticket.index'].get()
//            .then(response => {
//                response.data = response.data;
//                this.list = response.data.data;
//            });

            let vm = this;
            let ticketContent = document.getElementById('ticketContent');

            ticketContent.addEventListener("scroll", function(e) {
                if (ticketContent.scrollHeight - ticketContent.scrollTop === ticketContent.clientHeight){
                    vm.$store.dispatch(
                        'paginator/next'
                    );
                }
            });
        },
        methods: {
            getReplies(id){
                let ticket = {};
                this.$store.state.http.requests['ticket.Reply'].get({ticket_id: id}).then(data => {
                    ticket = data.data;
                    this.ticket = ticket.data;
                });
            },
//            ajaxGet(id){
//                let vm = this;
//                this.resource.get({public_id: id}).then(data => {
//                    vm.request = data.data;
//                    vm.ticket = vm.request.data;
//                });
//            },
        }
    }
</script>
