<template lang="pug">
    transition(name="fade"
    enter-active-class="fade-in"
    leave-active-class="fade-out")
        div.modal.card(v-on:click.self="closeModal()")
            transition(name="zoom"
            enter-active-class="zoom-in"
            leave-active-class="zoom-out")
                div.row.center-xs(v-if="!closeModalContent" v-on:click.self="closeModal()")
                    div.col-lg-5.col-md-5.col-sm-10.col-xs-10.content
                        div.header
                            span.icon-close(@click="closeModal()")
                            span.title {{ $i18n.t('card.editAccountTitle') }}
                        div.body
                            div.contains
                                div.row
                                    div.col-xs.ta-right
                                        img.bank-logo(v-bind:src="'assets/img/banks/' + card.issuer.slug  + '.png'")
                                        span.label.bank-name {{card.issuer.name}}

                                div.row
                                    div.col-xs.ta-right
                                        span.label {{$i18n.t('card.iban')}}:
                                    div.col-xs
                                        span.label {{card.iban}}

                                div.row
                                    input(type="text" v-model="pan" placeholder="شماره کارت")

                                div.row.no-margin
                                    div.col-lg-6.col-md-4.col-xs-12.ta-right.nav-expiration-label
                                        span.label.expiration-label {{ $i18n.t('card.expiredDate') }}:
                                    div.col-lg-6.col-md-8.col-xs-12.no-margin
                                        div.row.nav-expiration-input
                                            div.col-xs.no-margin
                                                span.label {{$i18n.t('card.month')}}:
                                                input#month(type="number" v-model="month" placeholder="۰۰" maxlength="2" @keyup="changeMonthFocus")
                                            div.col-xs.no-margin
                                                span.label {{$i18n.t('card.year')}}:
                                                input#year(type="number" v-model="year" placeholder="۰۰۰۰" maxlength="4" @keyup="changeYearFocus")


                                div.row
                                    div.col-xs.no-margin
                                        button.btn.success.pull-left(v-ripple @click="editCard") {{$i18n.t('common.save')}}

</template>


<script>
    export default {
        name: 'pages-card-partials-editPurse',
        data() {
            return {
                closeModalContent: true,
            }
        },
        props:['card'],
        mounted(){
            this.closeModalContent = false
        },
        methods: {
            closeModal() {
                this.$emit('closeModal')
            },
            editCard() {
                let params = {
                    entity_id: this.card.entity_id
                };

                let purseData = {
                    purse : this.purse,
                    name : this.purseName,
                };
                this.$store.state.http.requests['purse.getList'].save(params, purseData).then(
                    ()=> {
                        this.$router.push({name: 'home.index'})
                    },
                    (response) => {
                        store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            type: 'danger'
                        });
                    }
                )
            },
            changeMonthFocus(event) {
                let target = event.srcElement;
                let maxLength = parseInt(target.attributes["maxlength"].value);
                let myLength = target.value.length;

                if (myLength >= maxLength) {
                    target.value = '';
                    document.getElementById("year").focus();
                }
            },
            changeYearFocus(event) {
                let target = event.srcElement;
                let maxLength = parseInt(target.attributes["maxlength"].value);
                let myLength = target.value.length;

                if (myLength >= maxLength) {
                    document.getElementById("month").focus();
                }

            }
        }
    }

</script>
