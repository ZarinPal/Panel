<template lang="pug">
    modal.transaction-detail(v-on:closeModal="closeModal()")
        span.persian-num(slot="title") {{$i18n.t('transaction.id')}} : {{ transaction.public_id}}
        div.content(slot="content")
            div.body
                div.deposit-background
                    div.row.nav-deposit(v-bind:class="{'nav-deposit-in': transaction.effective_sign == 1 && transaction.confirmed =='confirmed', 'nav-deposit-internal': transaction.effective_sign == 0 && transaction.confirmed =='confirmed', 'nav-deposit-out': transaction.effective_sign == -1 && transaction.confirmed =='confirmed' ,'nav-deposit-toexit': transaction.confirmed =='pendingExit' }")
                        div.col-lg-6.col-md-6.col-sm-6.col-xs-6.from
                            div.row
                                div.user-image
                                    img(v-bind:src="'https:'+transaction.from_user.avatar")
                                div.col-xs.nav-user-info
                                    div.user-name {{transaction.from_user.name}}
                                    div.user-zp-id ZP.{{transaction.from_user.public_id + '.' + transaction.from_user.purse}}
                        div.col-lg-6.col-md-6.col-sm-6.col-xs-6.to
                            div.row
                                div.user-image
                                    span(v-if="transaction.to_merchant")
                                        img(v-bind:src="'https:'+transaction.to_merchant.avatar")
                                    span(v-else-if="transaction.to_user")
                                        img(v-bind:src="'https:'+transaction.to_user.avatar")

                                div.col-xs.nav-user-info
                                    span(v-if="transaction.to_user")
                                        div.user-name {{transaction.to_user.name}}
                                        div.user-zp-id ZP.{{transaction.to_user.public_id + '.' + transaction.to_user.purse}}

                                    span(v-else-if="transaction.to_merchant")
                                        div.user-name {{transaction.to_merchant.name}}
                                        div.user-zp-id ZP.{{transaction.to_merchant.public_id}}

                span.amount.persian-num {{ transaction.amount | numberFormat }}
                span {{$i18n.t('transaction.toman')}}

                div.nav-rows
                    div.row
                        div.col-xs.ta-right
                            span.title {{$i18n.t('transaction.id')}}
                        div.col-xs.ta-left
                            span.value.persian-num  {{ transaction.public_id}}
                    div.row
                        div.col-xs.ta-right
                            span.title {{$i18n.t('transaction.status')}}
                        div.col-xs.ta-left
                            span.title.tick(v-if="transaction.confirmed == 'confirmed' ") {{ $i18n.t('transaction.confirmed') }}
                            span.title.moving-out-icon(v-else-if="transaction.confirmed == 'pendingExit'") {{ $i18n.t('transaction.movingOut') }}
                            span.title.unverified(v-else) {{ $i18n.t('transaction.movingOut') }}

                    div.row
                        div.col-xs.ta-right
                            span.title {{$i18n.t('transaction.date')}}
                        div.col-xs.ta-left
                            span.value.persian-num {{transaction.created | jalali('HH:mm:ss jYYYY-jMM-jDD')}}



                    div.row
                        div.col-xs.ta-right
                            span.title {{$i18n.t('common.ip')}}
                        div.col-xs.ta-left
                            span.value  {{ transaction.from_ip}}

                    div.row(v-if="transaction.card_info")
                        div.col-xs.ta-right
                            span.title(v-if="transaction.card_info.mask")  {{$i18n.t('transaction.payerMask')}}
                        div.col-xs.ta-left.dir-ltr
                            span.value.persian-num(v-if="transaction.card_info.mask")  {{ $options.filters.cardNumber(transaction.card_info.mask)}}

                    div.row(v-if="transaction.card_info")
                        div.col-xs.ta-right
                            span.title(v-if="transaction.card_info.issuer.name")  {{$i18n.t('transaction.payerIssuer')}}
                        div.col-xs.ta-left
                            span.value.persian-num(v-if="transaction.card_info.issuer.name")  {{ transaction.card_info.issuer.name}}

                    div.row(v-if="transaction.to_user")
                        div.col-xs.ta-right
                            span.title(v-if="transaction.effective_sign == 1")  {{$i18n.t('transaction.depositTo')}}
                            span.title(v-else) {{$i18n.t('transaction.paymentTo')}}
                        div.col-xs.ta-left
                            span.value(v-if="transaction.effective_sign == 1")  {{ purseName.name }}
                            span.value(v-else)  {{ transaction.to_user.name }}


                    <!--span(v-if="transaction.to_merchant")-->
                    div.row(v-if="transaction.payer.name")
                        div.col-xs.ta-right
                            span.title(v-if="transaction.payer.name")  {{$i18n.t('transaction.payerName')}}
                        div.col-xs.ta-left
                            span.value.persian-num(v-if="transaction.payer.name")  {{ transaction.payer.name}}


                    div.row(v-if="transaction.payer.mobile")
                        div.col-xs.ta-right
                            span.title(v-if="transaction.payer.mobile")  {{$i18n.t('transaction.payerMobile')}}
                        div.col-xs.ta-left
                            span.value.persian-num(v-if="transaction.payer.mobile")  {{ transaction.payer.mobile}}

                    div.row(v-if="transaction.payer.email")
                        div.col-xs.ta-right
                            span.title(v-if="transaction.payer.email")  {{$i18n.t('transaction.payerEmail')}}
                        div.col-xs.ta-left
                            span.value(v-if="transaction.payer.email")  {{ transaction.payer.email }}

                    div.row
                        div.col-xs.ta-right
                            span.title {{$i18n.t('common.description')}}
                        div.col-xs.ta-left
                            span.value  {{ transaction.description}}

                    div.row(v-if="transaction.note && !isEditingNote")
                        div.col-xs.ta-right
                            span.title(v-if="transaction.note")  {{$i18n.t('transaction.note')}}
                        div.col-xs.ta-left
                            span.value(v-if="transaction.note")  {{ transaction.note }}

                    div.row(v-if="isEditingNote")
                        div.col-xs.ta-right
                            span.title  {{$i18n.t('transaction.note')}}
                        div.col-xs.ta-left
                            form(autocomplete="on" onsubmit="event.preventDefault();")
                                input( v-validate="{ rules: { min:5, max: 255}}" v-model="txtTransactionNote" name='txtTransactionNote'  id='txtTransactionNote' onfocus="this.select()" v-bind:data-vv-as="$i18n.t('transaction.note')" )
                                div.ta-right(v-if="validation('txtTransactionNote')")
                                    span.text-danger {{ errors.first('txtTransactionNote') }}

                    div.row
                        div.col-xs
                            button.btn.success(@click="saveNote" v-if="isEditingNote" ) ذخیره یادداشت
                            button.btn(@click="addNote" v-else-if="transaction.note" ) ویرایش یادداشت
                            button.btn(@click="addNote" v-else="!transaction.note" ) افزودن یادداشت
                        div.col-xs
                            a(:href="'/rest/v3/transaction/' + transaction.public_id + '.pdf'")
                                button.btn {{$i18n.t('transaction.print')}}


</template>


<script>
    import modal from '../../partials/modal.vue';

    export default {
        name: 'transaction-details',
        data() {
            return {
                closeModalContent: true,
                purseName: null,
                txtTransactionNote: this.transaction.note,
                isEditingNote: false,
            }
        },
        props: ['transaction'],
        computed: {
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            }
        },
        created() {
            store.commit('clearValidationErrors');
            if (this.transaction.to_user) {
                this.purseName = this.getPurseName(this.transaction.to_user.purse);
            }
        },
        mounted() {
            this.closeModalContent = false
        },
        methods: {
            closeModal() {
                this.$emit('closeModal')
            },
            getPurseName(purseId) {
                return _.find(this.$store.state.auth.user.purses, function (purse) {
                    return purse.purse === purseId;
                });

            },
            addNote() {
                this.isEditingNote = true;
            },
            saveNote() {
                let sendContent = {
                    note: this.txtTransactionNote
                };
                this.$store.state.http.requests['transaction.getInfo']
                    .update({'transactionId': this.transaction.public_id}, sendContent)
                    .then(() => {
                            this.transaction.note = this.txtTransactionNote;
                            this.isEditingNote = false;
                            store.commit('flashMessage', {
                                text: 'TransactionEditNoteDoneLocal',
                                type: 'success'
                            });
                        },
                        (response) => {
                            store.commit('setValidationErrors', response.data.validation_errors);
                            store.commit('flashMessage', {
                                text: response.data.meta.error_type,
                                type: 'danger'
                            });

                        }
                    );


            }

        },
        components: {
            modal
        }
    }

</script>
