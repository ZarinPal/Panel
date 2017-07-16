<template lang="pug">
    modal.activation-ussd(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('webservice.activeUssd') }}
        div(slot="content")
            div.row
                <!--p.create-description {{ $i18n.t('webservice.ussdNotice') }}-->
                span.create-description هزینه فعالسازی سرویس همپا(USSD) براساس تعداد تراکنش های موجود بر روی درگاه عادی زرین پال متغیر است.
                    span.read-description(@click="visibleDescription=!visibleDescription") {{ $i18n.t('webservice.description') }}

            transition(name="fade"
            enter-active-class="fade-in"
            leave-active-class="fade-out")
                div.ta-right.more-description(v-if="visibleDescription") {{ $i18n.t('webservice.ussdNotice') }}

            form(autocomplete="on")
                div.row
                    div.row.input-group.no-margin(:class="{'input-danger': validationErrors.ussd_id}")
                        div.no-margin.last-label
                            span #
                        div.col-xs.no-margin
                            input.input.ta-left(type="text" v-model="ussdId" placeholder="کد دستوری(ussd)")
                        div.no-margin.first-label
                            span *788*97*
                div.ta-right(v-if="validationErrors.ussd_id")
                    span.text-danger {{ $i18n.t(validationErrors.ussd_id) }}

                div.row
                    purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(:class="{'input-danger': validationErrors.purse}" v-on:select="selectedPurse"  placeholder="انتخاب کیف پول")
                    div.ta-right(v-if="validationErrors.purse")
                        span.text-danger {{ $i18n.t(validationErrors.purse) }}

                div.row
                    div.col-xs.ta-right.no-margin
                        loading(v-if="getPriceLoading")
                        span.persian-num.activation-price(v-else)  هزینه ی درخواست همپا {{priceUssd.amount | numberFormat}} تومان می باشد.

                    div.no-margin
                        button.btn.success.pull-left(v-ripple="" @click="activeUssd") {{$i18n.t('webservice.activation')}}
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
                ussdId: '',
                priceUssd: ''
            }
        },
        props:['webservice'],
        mounted(){
            this.closeModalContent = false
        },
        computed:{
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
        },
        created() {
            this.getPriceUssd();
        },
        methods: {
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
                    webservice : this.webservice.entity_id,
                    purse : this.purse,
                    ussd_id : this.ussdId,
                };

                this.$store.state.http.requests['webservice.postRequestUssd'].save(ussdData).then(
                    ()=> {
                        let vm = this;
                        let webserviceIndex = _.findIndex(this.$store.state.auth.user.webservices, function(webservice) {
                            return webservice.entity_id === vm.webservice.entity_id;
                        });
                        this.$store.state.auth.user.webservices[webserviceIndex].ussd_id = this.ussdId;
                        this.validationErrors = null;
                        this.closeModal();
                    },
                    (response) => {
                            this.loading = false;
                          store.commit('setValidationErrors',response.data.validation_errors);

                        this.$store.commit('flashMessage',{
                            text: response.data.meta.error_message,
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
