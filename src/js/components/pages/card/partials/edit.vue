<template lang="pug">
    modal.card(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('card.editAccountTitle') }}
        div(slot="content")
            div.row
                div.col-xs.ta-right
                    div.card-logo(:class="'logo-' + card.issuer.slug.toLowerCase()")
                    span.label.bank-name {{card.issuer.name}}

            div.row
                div.col-xs.ta-right
                    span.label {{$i18n.t('card.iban')}}:
                div.col-xs.ta-left
                    span.label {{card.iban}}

            div.row
                input.ta-left(type="text" v-model="pan" placeholder="شماره کارت" maxlength="19" id="pan" @keyup="cardNumberFormat()")
                div.ta-right(v-if="validationErrors.pan")
                    span.text-danger {{ $i18n.t(validationErrors.pan) }}

            div.row.no-margin
                div.col-lg-6.col-md-4.col-xs-12.ta-right.nav-expiration-label
                    span.label.expiration-label {{ $i18n.t('card.expiredDate') }}:
                div.col-lg-6.col-md-8.col-xs-12.no-margin
                    div.row.nav-expiration-input
                        div.col-xs.no-margin
                            span.label {{$i18n.t('card.month')}}:
                            input#month(type="text" v-model="month" placeholder="00" maxlength="2" @keyup="changeMonthFocus")
                        div.col-xs.no-margin
                            span.label {{$i18n.t('card.year')}}:
                            input#year(type="text" v-model="year" placeholder="0000" maxlength="4" @keyup="changeYearFocus")


            div.row
                div.col-xs.no-margin
                    button.btn.success.pull-left(v-ripple="" @click="editCard") {{$i18n.t('common.save')}}
                        svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                            circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

</template>


<script>
    import modal from '../../partials/modal.vue';

    export default {
        name: 'pages-card-partials-edit',
        data() {
            return {
                loading: false,
                closeModalContent: true,
                pan: '',
                month: '',
                'year': ''
            }
        },
        props:['card'],
        mounted(){
            this.closeModalContent = false
        },
        computed:{
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            }
        },
        methods: {
            cardNumberFormat() {
                let text = document.getElementById("pan").value;
                let result = [];
                text = this.pan.replace(/[^\d]/g, "");
                while (text.length > 4 && text.length <= 16) {
                    result.push(text.substring(0, 4));
                    text = text.substring(4);
                }
                if (this.pan.length > 0) result.push(text);
                this.pan = result.join("-");
            },
            closeModal() {
                this.$emit('closeModal')
            },
            editCard() {
                this.loading = true;
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
                        this.loading = false;
                        store.commit('setValidationErrors',response.data.validation_errors);
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
        },
        components: {
            modal
        }
    }

</script>