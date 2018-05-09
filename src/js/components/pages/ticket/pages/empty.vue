<template lang="pug">
  div.inner-content
    div.nav-ticket-empty
      div.no-ticket-image
      span.emptyText {{ $i18n.t('ticket.selectOne') }}

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
      if (!this.$store.state.app.isTicketEmptyPage) {
        this.$store.commit('app/changeTicketState');
      }
    },
    mounted(){
      this.data = [
        {
          name: 'empty'
        }
      ];

      let vm = this;
      let ticketContent = document.getElementById('ticketContent');

      ticketContent.addEventListener("scroll", function(e) {
        if (ticketContent.scrollHeight - ticketContent.scrollTop ===
            ticketContent.clientHeight
            && !vm.$store.state.paginator.isLoading) {
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
      getReplies(id){
        let ticket = {};
        this.$store.state.http.requests['ticket.Reply'].get({ticket_id: id}).
            then(data => {
              ticket = data.data;
              this.ticket = ticket.data;
            });
      },
    }
  }
</script>
