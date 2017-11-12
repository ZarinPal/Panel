<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('webservice.create') }}
                p.page-description {{ $i18n.t('webservice.createDescription') }}

        div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section.create-webservice
            div.box
                form(autocomplete="on" onsubmit="event.preventDefault();")
                    div.body
                        div.row
                            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                                div.row.no-margin
                                    span.input-icon.home-icon
                                    input(v-validate="'required'" v-bind:data-vv-as="$i18n.t('webservice.siteName')"  :class="{'input-danger': errors.has('site_name')}" type="text" name="site_name"  id="siteName" v-model="site_name" :placeholder= "$i18n.t('webservice.siteName')" autofocus tabindex="1" )
                                    div.ta-right(v-if="validation('site_name')")
                                        span.text-danger {{ errors.first('site_name') }}

                                div.row.no-margin
                                    span.input-icon.earth-icon
                                    div.row.input-group.no-margin.full-width(:class="{'input-danger': errors.has('domain')}")
                                        div.col-xs.no-margin
                                            input.input.ltr-input(v-validate="'required|url'"  v-bind:data-vv-as="$i18n.t('webservice.domain')"   type="text" v-model="domain"  name="domain"  placeholder= "آدرس وب‌سایت: domain.ir" tabindex="2" )
                                        div.no-margin.first-label
                                            span http://www.

                                    div.ta-right(v-if="validation('domain')")
                                        span.text-danger {{ errors.first('domain') }}

                                div.row.no-margin
                                    span.input-icon.mobile-icon
                                    input.ltr-input(v-validate="{rules: {required: true, regex: /^09[0-9]{9}$/} }" :class="{'input-danger': errors.has('tel')}"  v-bind:data-vv-as="$i18n.t('webservice.tel')" type="text" v-model="tel" name="tel" :placeholder= "$i18n.t('webservice.tel')" tabindex="3" )
                                    div.ta-right(v-if="validation('tel')")
                                        span.text-danger {{ errors.first('tel') }}

                                div.row.no-margin
                                    textarea.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-validate="'required'" :class="{'input-danger': errors.has('site_content')}" v-model="site_content" v-bind:data-vv-as="$i18n.t('webservice.info')" name="site_content" :placeholder= "$i18n.t('webservice.info')"  tabindex="4")
                                div.ta-right(v-if="validation('site_content')")
                                    span.text-danger {{ errors.first('site_content') }}

                                div.row.no-margin
                                    purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(@click.native="removeErrors('purse')" v-validate="{ rules: {required: true}}" name="purse" v-bind:data-vv-as="$i18n.t('user.purse')" v-on:select="selectedPurse" placeholder="انتخاب کیف پول" :class="{'input-danger': errors.has('purse')}" tabindex="5")
                                    div.ta-right(v-if="validation('purse')")
                                        span.text-danger {{ errors.first('purse') }}

                                div.row.no-margin
                                    webserviceCategories.webservice-categories(@click.native="removeErrors('webservice_category_id')" v-validate="{ rules: {required: true}}" name="webservice_category_id" v-bind:data-vv-as="$i18n.t('webservice.webserviceCategoryId')" @select="selectedWebserviceCat" :class="{'input-danger': errors.has('webservice_category_id')}" tabindex="6" )
                                    div.ta-right(v-if="validation('webservice_category_id')")
                                        span.text-danger {{ errors.first('webservice_category_id') }}


                    div.row
                        div.col-xs.nav-buttons
                            button.btn.success.pull-left(v-ripple=""  @click="validateForm" tabindex="7") {{$i18n.t('webservice.create')}}
                                svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                    circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

</template>


<script>
    import selectbox from '../../partials/selectbox.vue';
    import purse from '../../partials/purses.vue';
    import webserviceCategories from '../../partials/webservice-categories.vue';

    export default {
        name: 'pages-webservice-partials-create',
        validator: null,
        data() {
            return {
                loading: false,
                fileHover: false,
                domain: null,
                tel: null,
                purse: null,
                webservice_category_id: null,
                site_name: '',
                site_content: null,
                image: null,
                fileUploadFormData: new FormData(),
            }
        },
        computed: {
            webserviceCatSelection() {
                if (this.$store.state.app.webserviceCategories) {
                    return this.$store.state.app.webserviceCategories.map(function (value) {
                        return {
                            'title': value.title,
                            'value': value.public_id
                        }
                    });
                }
            },
        },
        created(){
            store.commit('clearValidationErrors');
            this.$store.dispatch('app/getWebserviceCategories');
        },
        mounted(){
            setTimeout(() => {
                document.getElementById('siteName').focus()
            }, 10);
        },
        methods: {
            validation(name) {
                if (this.$store.state.alert.validationErrors[name]) {
                    this.errors.clear();
                    this.errors.add(name, this.$store.state.alert.validationErrors[name], 'api');
                    this.$store.state.alert.validationErrors[name] = false;
                }
                return this.errors.has(name);
            },
            validateForm() {
                this.$validator.validateAll({
                    site_name: this.site_name,
                    domain: this.domain,
                    tel: this.tel,
                    site_content: this.site_content,
                    purse: this.purse,
                    webservice_category_id: this.webservice_category_id
                }).then((result) => {
                    if (result) {
                        this.createWebservice();
                    }
                });
            },
            removeErrors : function (field) {
                !!this[field] && this.errors.remove(field);
            },
            selectedPurse(purseId) {
                this.purse = purseId;
            },
            selectedWebserviceCat(webserviceCatId) {
                this.webservice_category_id = webserviceCatId;
            },
            createWebservice() {
                if (this.errors.length) {
                    store.commit('flashMessage', {
                        text: 'fix validation errors',
                        type: 'danger',
                    });
                    return false;
                }

                //check tel is mobile and validate it
                if (/^09/g.test(this.tel)) {
                    if (!(/^09[0-9]{9}$/g.test(this.tel))) {
                        store.commit('flashMessage', {
                            text: 'mobile number not valid',
                            type: 'danger',
                        });
                        this.loading = false;
                        return;
                    }
                }

                this.loading = true;
                let webserviceData = {
                    domain: this.domain,
                    tel: this.tel,
                    purse: this.purse,
                    webservice_category_id: this.webservice_category_id,
                    site_name: this.site_name,
                    site_content: this.site_content,
                };

                this.$store.state.http.requests['webservice.getIndex'].save(webserviceData).then(
                    () => {
                        store.commit('flashMessage', {
                            text: 'ticket new webservice',
                            type: 'success',
                            important: true,
                        });
                        this.$router.push({name: 'webservice.index'})
                    },
                    (response) => {
                        this.loading = false;
                        store.commit('setValidationErrors', response.data.validation_errors);
                        store.commit('flashMessage', {
                            text: response.data.meta.error_message,
                            type: 'danger'
                        });
                    }
                )
            },
            dragOver() {
                window.addEventListener("dragover", function (e) {
                    e.preventDefault();
                }, false);
                this.fileHover = true;
            },
            onDrop(e) {
                e.stopPropagation();
                e.preventDefault();
                let files = e.target.files || e.dataTransfer.files;
                if (!files.length)
                    return;
                this.createImage(files[0]);
                this.fileHover = false;
            },
            onLogoChange(e) {
                let files = e.target.files || e.dataTransfer.files;
                if (!files.length)
                    return;
                this.createImage(files[0]);
            },
            createImage(file) {
                if (!file.type.match('image.*')) {
                    store.commit('flashMessage', {
                        text: 'fileNotImage',
                        type: 'danger'
                    });
                    return;
                }

                let image = new Image();
                let reader = new FileReader();
                let vm = this;
                this.fileName = file.name;

                reader.onload = (e) => {
                    vm.image = e.target.result;
                };
                reader.readAsDataURL(file);
            },
        },
        components: {
            selectbox,
            purse,
            webserviceCategories,
        }
    }

</script>
