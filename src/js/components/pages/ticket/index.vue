<template lang="pug">
    div.row
        div.nav-ticket-list#ticketContent(v-bind:class="{'hidden-sm': showTicketReplies, 'show-sm': !showTicketReplies, 'ticket-empty-list-width': this.$store.state.app.isTicketEmptyPage}")
            div.content
                span(v-for="ticket in tickets.data" v-bind:ticket="ticket")
                    router-link.row(@click.native="showTicketReplies = true" tag="li" v-bind:to="{ name: 'ticket.show', params: { id: ticket.public_id}}")
                        div.col-xs
                            div.title(:class="{'close-ticket-title' : ticket.status == 'close'}") {{ticket.title | less}}
                            div.iransans-light.title(:class="{'close-ticket-title' : ticket.status == 'close'}")  {{ticket.public_id | persianNumbers}}
                        div.nav-details
                            div
                                span.status {{$i18n.t('ticket.' + ticket.status)}}
                                span.priority {{ $i18n.t('ticket.' + kebabCase(ticket.priority)) }}
                            span.date.iransans-light {{ticket.created_at | fromNow | persianNumbers}}

                div.ta-center.sticky-new-ticket(v-sticky="")
                    router-link.btn.success.btn-add-ticket(v-if="this.$store.state.app.isTicketEmptyPage" tag="button" v-bind:to="{ name: 'ticket.create'}")  {{$i18n.t('ticket.addTicket')}}
                    router-link.btn.success.rounded(v-else tag="button" v-bind:to="{ name: 'ticket.create'}")


                    div.ta-center(v-if="loadingTicketState.status")
                        svg.material-spinner(width="30px" height="30px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                            circle.path-colors(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

        div.col-xs.nav-tickets
            router-view(v-on:closeReplies="closeReplies()" v-bind:class="{'show-sm': showTicketReplies, 'hidden-sm': !showTicketReplies}")

</template>

<script>
    import navbar from '../partials/navbar.vue';
    import sidebar from '../partials/sidebar.vue';

    export default {
        name: 'ticket-index',
        data() {
          return {
              showTicketReplies: false,
          }
        },
        computed:{
            user(){
                return this.$store.state.auth.user;
            },
            tickets(){
                return {
                    data: this.$store.state.paginator.paginator.TicketList.data,
                    update: this.$store.state.paginator.update
                }
            },
            loadingTicketState() {
                return {
                    status: this.$store.state.paginator.paginator.TicketList.isLoading,
                    update: this.$store.state.paginator.update,
                }
            },
        },
        created() {
            let vm = this;
            this.$store.dispatch(
                'paginator/make',
                {
                    vm,
                    resource: vm.$store.state.http.requests['ticket.index'],
                    params: vm.searchOptions,
                    requestName: 'TicketList'
                }
            );
        },
        methods: {
            closeReplies() {
                this.showTicketReplies = false
            },
            kebabCase(value) {
                return _.kebabCase(value);
            }
        },
        components: {
            navbar,
            sidebar,
        },
    }
</script>
