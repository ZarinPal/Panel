<template lang="pug">
    transition(name="fade"
    enter-active-class="fade-in"
    leave-active-class="fade-out")
        div.modal.create-purse(v-on:click.self="closeModal()")
            transition(name="zoom"
            enter-active-class="zoom-in"
            leave-active-class="zoom-out")
                div.row.center-xs(v-if="!closeModalContent" v-on:click.self="closeModal()")
                    div.col-lg-5.col-md-5.col-sm-10.col-xs-10.content
                        div.header
                            span.icon-close(@click="closeModal()")
                            span.title {{ $i18n.t('webservice.activeUssd') }}

                        div.body
                            div.contains
                                div.row.input-group
                                    div.no-margin.last-label
                                        span #
                                    div.col-xs.no-margin
                                        input.input.ta-left(type="text" v-model="ussdId" placeholder="کد دستوری(ussd)")
                                    div.no-margin.first-label
                                        span *788*97*

                                div.row
                                    selectbox.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectedPurse" v-bind:data="pursesSelection" placeholder="انتخاب کیف پول")

                                div.row
                                    p.create-description {{ $i18n.t('webservice.ussdNotice') }}

                                div.row
                                    div.col-xs.no-margin
                                        button.btn.success.pull-left(v-ripple="" @click="activeUssd") {{$i18n.t('webservice.activation')}}

</template>


<script>
    import selectbox from '../../partials/selectbox.vue';

    export default {
        name: 'home-webservice-partials-ussdActivation',
        data() {
            return {
                closeModalContent: true,
                purse: 1,
                ussdId: '',
            }
        },
        props:['webservice'],
        mounted(){
            this.closeModalContent = false
        },
        computed:{
            pursesSelection() {
                return this.$store.state.auth.user.purses.map(function (purse) {
                    return {
                        'title': '<span class="wallet-color color-' + purse.purse + '"></span>' + purse.name + '<span class="pull-left persian-num"></span>',
                        'value': purse.purse
                    }
                });
            }
        },
        methods: {
            closeModal() {
                this.$emit('closeModal')
            },
            selectedPurse(purseId) {
                this.purse = purseId;
            },
            activeUssd() {
                let ussdData = {
                    webservice : this.webservice.entity_id,
                    purse : this.purse,
                    ussd_id : this.ussdId,
                };

//                this.$store.state.http.requests['webservice.postRequestUssd'].save(ussdData).then(
//                    ()=> {
//                        let vm = this;
//                        let webserviceIndex = _.findIndex(this.$store.state.auth.user.webservices, function(webservice) {
//                            return webservice.entity_id === vm.webservice.entity_id;
//                        });
//                        this.$store.state.auth.user.webservices[webserviceIndex].ussd_id = this.ussdId;
//
//                        this.closeModal();
//                    },
//                    (response) => {
//                        this.$store.commit('flashMessage',{
//                            text: response.data.meta.error_message,
//                            important: false,
//                            type: 'danger'
//                        });
//                    }
//                )
            },
        },
        components: {
            selectbox
        }
    }

</script>
