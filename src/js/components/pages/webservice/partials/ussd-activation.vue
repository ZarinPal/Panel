<template lang="pug">
    modal.activation-ussd(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('webservice.activeUssd') }}
        div(slot="content")
            div.row
                <!--p.create-description {{ $i18n.t('webservice.ussdNotice') }}-->
                span.create-description هزینه فعالسازی سرویس همپا(USSD) براساس تعداد تراکنش‌های موجود بر روی درگاه عادی زرین‌پال متغیر  است.
                    span.read-description(@click="visibleDescription=!visibleDescription") {{ $i18n.t('webservice.description') }}

            transition(name="fade"
            enter-active-class="fade-in"
            leave-active-class="fade-out")
                div.ta-right.more-description(v-if="visibleDescription") {{ $i18n.t('webservice.ussdNotice') }}

            form(autocomplete="on" onsubmit="event.preventDefault();")
                div.row
                    div.row.input-group.no-margin(:class="{'input-danger': errors.has('ussd_id')}" required)
                        div.no-margin.last-label
                            span #
                        div.col-xs.no-margin
                            input.input.ltr-input(v-focus="" v-validate="'required|numeric|min:4|max:6|min_value:1000'" v-bind:data-vv-as="$i18n.t('webservice.ussd')" maxlength="5" type="text" v-model="ussd_id" name="ussd_id" :placeholder="$i18n.t('webservice.ussd')" autofocus tabindex="1")
                        div.no-margin.first-label
                            span *788*97*
                    div.ta-right.full-width(v-if="validation('ussd_id')")
                        span.text-danger {{ errors.first('ussd_id') }}

                div.row
                    purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(@click.native="removeErrors('purse')" v-validate="{ rules: {required: true}}" name="purse" v-bind:data-vv-as="$i18n.t('user.purse')" :class="{'input-danger': errors.has('purse')}" v-on:select="selectedPurse" placeholder="انتخاب کیف‌پول" tabindex="2")
                    div.ta-right(v-if="validation('purse')")
                        span.text-danger {{ errors.first('purse') }}

                div.row.body-bottom
                    div.col-lg-9.col-md-12.col-sm-12.col-xs-12.ta-right
                        loading(v-if="getPriceLoading" v-bind:width="20" v-bind:height="20")
                        span.persian-num.activation-price(v-else-if="!getPriceLoading && priceUssd")  هزینه ی درخواست همپا {{priceUssd.amount | numberFormat}} تومان می‌باشد.

                    div.no-margin.col-lg-3.col-md-12.col-sm-12.col-xs-12.ta-left
                        button.btn.success.pull-left(v-ripple="" @click="validateForm") {{$i18n.t('webservice.activation')}}
                            svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")
</template>


<script>
    import selectbox from '../../partials/selectbox.vue';
    import purse from '../../partials/purses.vue';
    import modal from '../../partials/modal.vue';
    import loading from '../../partials/loading.vue';

    export default {
        name: 'home-webservice-partials-ussdActivation',
        data() {
            return {
                loading: false,
                getPriceLoading: true,
                visibleDescription: false,
                closeModalContent: true,
                purse: null,
                ussd_id: null,
                priceUssd: ''
            }
        },
        props: ['webservice'],
        mounted(){
            this.closeModalContent = false
        },
        created() {
            store.commit('clearValidationErrors');
            this.getPriceUssd();
        },
        methods: {
            validateForm() {
                this.$validator.validateAll({
                    purse: this.purse,
                    ussd_id: this.ussd_id,
                }).then((result) => {
                    if (result) {
                        this.activeUssd();
                    }
                });
            },
            removeErrors: function (field) {
                !!this[field] && this.errors.remove(field);
            },
            closeModal() {
                this.$emit('closeModal')
            },
            selectedPurse(purseId) {
                this.purse = purseId;
            },
            getPriceUssd() {
                this.$store.state.http.requests['webservice.getPriceUssd'].get().then(response => {
                    this.priceUssd = response.data.data[0];
                    this.getPriceLoading = false;
                });
            },
            activeUssd() {
                this.loading = true;
                let ussdData = {
                    webservice: this.webservice.entity_id,
                    purse: this.purse,
                    ussd_id: this.ussd_id,
                };

                this.$store.state.http.requests['webservice.postRequestUssd'].save(ussdData).then(
                    () => {
                        let vm = this;
                        let webserviceIndex = _.findIndex(this.$store.state.auth.user.webservices, function (webservice) {
                            return webservice.entity_id === vm.webservice.entity_id;
                        });
                        this.$store.state.auth.user.webservices[webserviceIndex].ussd_id = this.ussd_id;
                        this.validationErrors = null;
                        store.commit('flashMessage', {
                            text: 'WebserviceUssdCodeActivatedLocal',
                            type: 'success'
                        });
                        this.closeModal();
                    },
                    (response) => {
                        this.loading = false;
                        store.commit('setValidationErrors', response.data.validation_errors);

                        this.$store.commit('flashMessage', {
                            text: response.data.meta.error_type,
                            important: false,
                            type: 'danger'
                        });
                    }
                )
            },
        },
        components: {
            selectbox,
            purse,
            modal,
            loading
        }
    }

</script>
