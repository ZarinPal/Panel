<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title ٖ{{ $i18n.t('webservice.editTitle') }}
                p.page-description ٖ{{ $i18n.t('webservice.editWebserviceDescription') }}
        div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section.create-webservice
            div.box
                form(autocomplete="on" onsubmit="event.preventDefault();")
                    div.body
                        div.row

                            div.col-lg-6.col-md-8.col-sm-12.col-xs-12
                                div.row
                                    div.col-xs.ta-right
                                        input(v-model="visibleIp" name="ipOptional" value="yes" type="radio" id="rdoWithIp")
                                        label(for="rdoWithIp")
                                            span
                                            |{{ $i18n.t('webservice.withIpLimit')}}

                                    div.col-xs.ta-right
                                        input(v-model="visibleIp" name="ipOptional" value="no" type="radio" id="rdoWithoutIp")
                                        label(for="rdoWithoutIp")
                                            span
                                            |{{ $i18n.t('webservice.withoutIpLimit')}}


                            div.col-lg-7.col-md-7.col-sm-12.col-xs-12
                                div.row.no-margin(v-if="visibleIp == 'yes'")
                                    span.input-icon.ip-icon
                                    input.ltr-input(v-validate="'ip'" :class="{'input-danger': errors.has('site_ip')}"  v-bind:data-vv-as="$i18n.t('webservice.ipServer')" type="text" v-model="site_ip" name="site_ip"  id="site_ip" placeholder= "IP" autofocus tabindex="1")
                                    div.ta-right(v-if="validation('site_ip')")
                                        span.text-danger {{ errors.first('site_ip') }}

                                div.row.no-margin
                                    purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(@click.native="removeErrors('purse')" v-validate="{ rules: {required: true}}" name="purse" v-bind:data-vv-as="$i18n.t('user.purse')" v-on:select="selectedPurse" v-bind:selected="purse" placeholder="انتخاب کیف پول" :class="{'input-danger': errors.has('purse')}" tabindex="5")
                                    div.ta-right(v-if="validation('purse')")
                                        span.text-danger {{ errors.first('purse') }}

                                div.row.no-margin(v-if="this.$store.state.app.webserviceCategories.length" )
                                    webserviceCategories.webservice-categories(@click.native="removeErrors('webservice_category_id')" v-validate="{ rules: {required: true}}" name="webservice_category_id" v-bind:data-vv-as="$i18n.t('webservice.webserviceCategoryId')" v-on:select="selectedWebserviceCat" v-bind:selected="webservice_category_id" :class="{'input-danger': errors.has('webservice_category_id')}" tabindex="6" )
                                    div.ta-right(v-if="validation('webservice_category_id')")
                                        span.text-danger {{ errors.first('webservice_category_id') }}

                                div.row
                                    div.nav-picker
                                        span.picker.pull-right {{$i18n.t('webservice.uploadLogo')}}

                                div.col-lg-12.col-md-12.col-sm-12.col-xs-12.ta-center
                                    img.webservice-logo(:src="selectedLogo")

                                div.col-lg-12.col-md-12.col-sm-12.col-xs-12
                                    div.file-zone(@dragover="dragOver" @drop="onDrop" @dragleave="fileHover = false" v-bind:class="{'file-zone-hover': fileHover}")
                                        div.row
                                            div.col-lg-2.col-md-2.col-sm-12.col-xs-12.ta-center.ta-center(@dragenter="fileHover = true" @dragleave="fileHover = false")
                                                span.upload-icon

                                            div.col-lg-10.col-md-10.col-sm-12.col-xs-12.ta-center.nav-texts(@dragenter="fileHover = true" @dragleave="fileHover = false")
                                                p.attachment-text(@dragover="dragOver" @drop="onDrop" @dragleave="fileHover = false" ) فایل لوگو را اینجا رها کنید
                                                div.nav-file-input(@dragover="dragOver" @drop="onDrop" @dragleave="fileHover = false")
                                                    span(@dragenter="fileHover = true" @dragleave="fileHover = false") یا از کامپیوتر

                                                    label.attach
                                                        span.select-text انتخاب کنید
                                                        input(type="file" name="file" @change="onLogoChange" tabindex="4")

                                                    div.file-name(v-if="fileName" @dragover="dragOver" @drop="onDrop" @dragleave="fileHover = false" ) {{fileName}}

                                div.ta-right(v-if="validationErrors.site_logo")
                                    span.text-danger {{ $i18n.t(validationErrors.attachment) }}


                    div.row
                        div.col-xs.nav-buttons
                            button.btn.success.pull-left( v-ripple="" @click="validateForm" tabindex="5") {{$i18n.t('webservice.edit')}}
                                svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                    circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")
</template>


<script>
    import selectbox from '../../partials/selectbox.vue';
    import purse from '../../partials/purses.vue';
    import webserviceCategories from '../../partials/webservice-categories.vue';

    export default {
        name: 'pages-webservice-partials-edit',
        data(){
            return {
                fileUploadFormData: new FormData(),
                loading: false,
                visibleIp: 'yes',
                messages: {},
                fileHover: false,
                purse: null,
                webservice_category_id: null,
                site_ip: '',
                site_name: '',
                domain: '',
                site_content: '',
                fileName: '',
                tel: '',
                selectedLogo: '',//logoland.zarinpal.com/14937992435909914ba5e2d/125x125.png',
                site_logo: '',//logoland.zarinpal.com/' + md5(this.webservice.entity_id) + '/125x125.png',
            }
        },
        created() {
            store.commit('clearValidationErrors');
            this.$store.dispatch('app/getWebserviceCategories');

            this.purse = this.webservice.purse;
            this.webservice_category_id = this.webservice.category_id;
            this.site_ip = this.webservice.ip;
            this.site_name = this.webservice.name;
            this.domain = this.webservice.domain;
            this.site_content = this.webservice.description;
            this.tel = this.webservice.tel;
            this.selectedLogo = this.webservice.logo;

            if (this.webservice.ip) {
                this.visibleIp = 'yes';
            } else {
                this.visibleIp = 'no';
            }
        },
        computed: {
            webservice(){
                return _.find(this.$store.state.auth.user.webservices, {'entity_id': this.$route.params.merchantCode});
            },
            pursesSelection() {
                if (this.$store.state.auth.user.purses) {
                    return this.$store.state.auth.user.purses.map(function (purse) {
                        return {
                            'title': '<span class="wallet-color color-' + purse.purse + '"></span>' + purse.name,
                            'value': purse.purse
                        }
                    });
                }
            },
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
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
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
                    site_ip: this.site_ip,
                    purse: this.purse,
                    webservice_category_id: this.webservice_category_id
                }).then((result) => {
                    if (result) {
                        this.editWebservice();
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
            editWebservice() {
                this.loading = true;

                if (this.visibleIp === 'no') {
                    this.site_ip = null;
                }

                let webserviceData = {
                    purse: this.purse,
                    webservice_category_id: this.webservice_category_id,
                    site_ip: this.site_ip,
                    site_logo: this.site_logo,
                };

                let params = {
                    webservice_id: this.$route.params.merchantCode
                };

                this.$store.state.http.requests['webservice.postEdit'].update(params, webserviceData).then(
                    () => {
                        this.changeWebserviceState();
                        store.commit('flashMessage', {
                            text: 'webservice edited success',
                            type: 'success'
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
            changeWebserviceState(){
                let vm = this;
                let webserviceIndex = _.findIndex(this.$store.state.auth.user.webservices, function (webservice) {
                    return webservice.entity_id === vm.$route.params.merchantCode;
                });

                this.$store.state.auth.user.webservices[webserviceIndex].ip = this.site_ip;
                this.$store.state.auth.user.webservices[webserviceIndex].purse = this.purse;
                this.$store.state.auth.user.webservices[webserviceIndex].category_id = this.webservice_category_id;
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
                this.createFile(files[0]);
                this.fileName = files[0].name;
                this.fileHover = false;
            },
            onLogoChange(e) {
                let files = e.target.files || e.dataTransfer.files;
                if (!files.length)
                    return;
                this.createFile(files[0]);
            },
            createFile(file) {
                if (!file.type.match('image.*')) {
                    store.commit('flashMessage', {
                        text: 'fileNotImage',
                        type: 'danger'
                    });
                    return;
                }

                //set image on image element
                let image = new Image();
                let reader = new FileReader();
                let vm = this;

                reader.onload = (e) => {
                    vm.selectedLogo = e.target.result;
                };
                reader.readAsDataURL(file);

                let formData = new FormData();
                formData.append('type', 'logo');
                formData.append('file', file);

                this.$http.post('https://uploads.zarinpal.com/', formData, {emulateHTTP: true}).then((response) => {
                    this.site_logo = response.data.meta.file_id;
                }, (response) => {
                    console.log('Error occurred...');
                });
            }
        },
        components: {
            selectbox,
            purse,
            webserviceCategories
        }
    }
</script>