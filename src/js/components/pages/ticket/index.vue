<template lang="pug">
    div.full-height(v-show="$store.state.app.isLoaded")
        navbar

        div.zp-container.row
            sidebar

            div.col-xs.ticket-main-content
                div.row
                    div.nav-ticket-list(v-bind:class="{'hidden-sm': showTicketReplies, 'show-sm': !showTicketReplies, 'ticket-empty-list-width': this.$store.state.app.isTicketEmptyPage}")
                        div.content
                            span(v-for="ticket in tickets" v-bind:ticket="ticket")
                                router-link.row(@click.native="showTicketReplies = true" tag="li" v-bind:to="{ name: 'ticket.show', params: { id: ticket.public_id}}")
                                    div.col-xs
                                        div.title {{ticket.title | less}}
                                        div.iransans-light.title {{ticket.public_id | persianNumbers}}
                                    div.nav-details
                                        div
                                            span.status {{$i18n.t('ticket.' + ticket.status)}}
                                            span.priority {{ $i18n.t('ticket.' + kebabCase(ticket.priority)) }}
                                        span.date.iransans-light {{ticket.created_at | fromNow | persianNumbers}}


                            div.ta-center.sticky-new-ticket(v-sticky="")
                                router-link.btn.success(v-if="this.$store.state.app.isTicketEmptyPage" tag="button" v-bind:to="{ name: 'ticket.create'}")  {{$i18n.t('ticket.addTicket')}}
                                router-link.btn.success.rounded(v-else tag="button" v-bind:to="{ name: 'ticket.create'}")

                    div.col-xs.nav-tickets.full-height
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
                return this.$store.state.paginator.data;
            }
        },
        created(){
            let vm = this;
            this.$store.dispatch(
                'paginator/make',
                {
                    vm,
                    resource: vm.$store.state.http.requests['ticket.index'],
                    resourceData: vm.searchOptions
                }
            );
        },
        methods: {
            loadMoreTitle() {
                this.$store.dispatch(
                    'paginator/next'
                );
            },
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
