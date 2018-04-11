<template lang="pug">
    modal.create-purse(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('purse.addPurseTitle') }}
        div(slot="content")
            form(autocomplete="on" onsubmit="event.preventDefault();")
                div.row
                    p.create-description(v-if="this.$store.state.auth.user.level < 3") {{ $i18n.t('purse.createPurseSilverUsersDescription') }}

                div.row
                    div.col-xs.no-margin
                        button.btn.success.pull-left(v-ripple="" @click="validateForm" tabindex="3") {{$i18n.t('purse.addPurse')}}
            div
                div.ta-right
                    span.text-help {{$i18n.t('purse.purseNameDescription') }}
                input(v-focus="" v-validate="{ rules: {required: true, min:3, max: 50}}" v-bind:data-vv-as="$i18n.t('user.purseName')" :class="{'input-danger': errors.has('name')}" type="text" v-model="name" name="name" id="name" autofocus tabindex="1" :placeholder="$i18n.t('user.purseName')")
                div.ta-right(v-if="validation('name')")
                    span.text-danger {{ errors.first('name') }}
                div.ta-right.m-t-10
                    span.text-help {{$i18n.t('purse.purseSelectDescription') }}
                purse.col-lg-12.col-md-12.col-sm-12.col-xs-12(@click.native="removeErrors('purse')" v-validate="{ rules: {required: true}}" name="purse" v-model="purse" v-bind:data-vv-as="$i18n.t('user.purse')" :class="{'input-danger': errors.has('purse')}" v-on:select="selectedPurse" placeholder="انتخاب کیف‌پول" tabindex="2")
                div.ta-right(v-if="validation('purse')")
                    span.text-danger {{ errors.first('purse') }}
                        svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                            circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

</template>


<script>
    import selectbox from '../../partials/selectbox.vue';
    import purse from '../../partials/purses.vue';
    import modal from '../../partials/modal.vue';

    export default {
        name: 'home-purse-create',
        data() {
            return {
                closeModalContent: true,
                purse: null,
                name: '',
                pursesBalance: {},
                loading: false,
            }
        },
        mounted(){
            this.closeModalContent = false;
        },
        computed: {
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
            purseId() {
                return this.purse;
            }
        },
        created(){
            store.commit('clearValidationErrors');
        },
        methods: {
            validateForm() {
                this.$validator.validateAll({
                    purse: this.purse,
                    name: this.name,
                }).then((result) => {
                    if (result) {
                        this.createPurse();
                    }
                });
            },
            removeErrors: function (field) {
                !!this[field] && this.errors.remove(field);
            },
            closeModal() {
                this.$emit('closeModal')
            },
            selectedPurse(purseId, fieldName = null) {
                this.purse = purseId;
            },
            createPurse() {
                this.loading = true;
                let purseData = {
                    purse: this.purse,
                    name: this.name,
                };
                this.$store.state.http.requests['purse.getList'].save(purseData).then(
                    () => {
                        this.loading = false;
                        let lastPurseId = this.$store.state.auth.user.purses.length;
                        let newPurse = {
                            balance: 0,
                            name: this.name,
                            purse: lastPurseId
                        };

                        this.$store.state.auth.user.purses.push(newPurse);
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
            }
        },
        components: {
            selectbox,
            purse,
            modal
        }
    }

</script>
