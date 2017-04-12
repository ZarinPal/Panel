<template lang="pug">
    div.inner-content
        div.nav-ticket-empty
            img(src="assets/img/ticket/empty.png")
            span.emptyText یک تیکت را برای نمایش انتخاب کنید

</template>

<script>
    export default {
        name: 'ticket-empty',
        data () {
            return {
                resource: this.$resource('ticket/{public_id}.json')
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
            this.ajaxGet(this.$route.params.public_id);
            this.$http.get('ticket.json').then(response => {
                response.data = response.data;
                this.list = response.data.data;
            });
        },
        methods: {
            ajaxGet(id){
                let vm = this;
                this.resource.get({public_id: id}).then(data => {
                    vm.request = data.data;
                    vm.ticket = vm.request.data;
                });
            },
        }
    }
</script>
