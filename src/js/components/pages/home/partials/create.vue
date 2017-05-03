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
                            span.title {{ $i18n.t('purse.addPurseTitle') }}

                        div.body
                            div.contains

                                div.row
                                    input(:class="{'input-danger': validationErrors.name}" type="text" v-model="purseName" placeholder="نام کیف پول")
                                    div.ta-right(v-if="validationErrors.name")
                                        span.text-danger {{ $i18n.t(validationErrors.name) }}

                                    selectbox.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectedPurse" v-bind:data="pursesSelection" placeholder="انتخاب کیف پول")

                                div.row
                                    p.create-description {{ $i18n.t('purse.createPurseSilverUsersDescription') }}


                                div.row
                                    div.col-xs.no-margin
                                        button.btn.success.pull-left(v-ripple="" @click="createPurse") {{$i18n.t('purse.addPurse')}}

</template>


<script>
    import selectbox from '../../partials/selectbox.vue';

    export default {
        name: 'home-purse-create',
        data() {
            return {
                closeModalContent: true,
                purse: 1,
                purseName: '',
                pursesBalance: {},
            }
        },
        mounted(){
            this.closeModalContent = false
        },
        computed:{
            pursesSelection() {
                return this.$store.state.auth.user.purses.map(function (purse) {
//                    let vm = this;
//                    let purseBalance = vm.moneyFormat(purse.purse);
                    return {
                        'title': '<span class="wallet-color color-' + purse.purse + '"></span>' + purse.name + '<span class="pull-left persian-num">' + purse.balance +  ' تومان</span>',
                        'value': purse.purse
                    }
                });
            },
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
        },
        methods: {
            closeModal() {
                this.$emit('closeModal')
            },
            selectedPurse(purseId) {
                this.purse = purseId;
            },
            createPurse() {
                let purseData = {
                    purse : this.purse,
                    name : this.purseName,
                };
                this.$store.state.http.requests['purse.getList'].save(purseData).then(
                    ()=> {
                        let lastPurseId = this.$store.state.auth.user.purses.length;
                        let newPurse = {
                            balance: 0,
                            name: this.purseName,
                            purse: lastPurseId
                        };

                        this.$store.state.auth.user.purses.push(newPurse);
                        this.closeModal();
                    },
                    (response) => {
                        store.commit('setValidationErrors',response.data.validation_errors);
                        this.$store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            important: false,
                            type: 'danger'
                        });
                    }
                )
            },
            moneyFormat(num) {
//                let n = num.toString(), p = n.indexOf('.');
//                return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, function($0, i){
//                    return p<0 || i<p ? ($0+',') : $0;
//                });
            }
        },
        components: {
            selectbox
        }
    }

</script>
