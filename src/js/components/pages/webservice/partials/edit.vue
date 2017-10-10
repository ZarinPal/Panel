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
                            div.col-lg-7.col-md-7.col-sm-12.col-xs-12
                                div.row.no-margin
                                    span.input-icon.ip-icon
                                    input.ltr-input(v-validate="{size: 15}" :class="{'input-danger': validationErrors.site_ip}" type="text" v-model="site_ip" placeholder= "IP" autofocus tabindex="1")
                                    div.ta-right(v-if="validationErrors.site_ip")
                                        span.text-danger {{ $i18n.t(validationErrors.site_ip) }}

                                div.row.no-margin
                                    purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectedPurse" v-bind:selected="purse" placeholder="انتخاب کیف پول" :class="{'input-danger': validationErrors.purse}" tabindex="2")
                                    div.ta-right(v-if="validationErrors.purse")
                                        span.text-danger {{ $i18n.t(validationErrors.purse) }}

                                div.row.no-margin(v-if="this.$store.state.app.webserviceCategories.length" )
                                    <!--span.input-icon.webservice-cat-icon-->
                                    webserviceCategories(v-on:select="selectedWebserviceCat" v-bind:selected="webservice_category_id" :class="{'input-danger': validationErrors.webservice_category_id}" tabindex="3")
                                    div.ta-right(v-if="validationErrors.webservice_category_id")
                                        span.text-danger {{ $i18n.t(validationErrors.webservice_category_id) }}

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
                                                p(@dragover="dragOver" @drop="onDrop" @dragleave="fileHover = false" ) فایل لوگو را اینجا رها کنید
                                                div.nav-file-input(@dragover="dragOver" @drop="onDrop" @dragleave="fileHover = false")
                                                    span(@dragenter="fileHover = true" @dragleave="fileHover = false") یا از کامپیوتر
                                                    input#attach(type="file" name="file" @change="onLogoChange" tabindex="4")
                                                    div.file-name(v-if="fileName" @dragover="dragOver" @drop="onDrop" @dragleave="fileHover = false" ) {{fileName}}



                                div.ta-right(v-if="validationErrors.site_logo")
                                    span.text-danger {{ $i18n.t(validationErrors.attachment) }}


                    div.row
                        div.col-xs.nav-buttons
                            button.btn.success.pull-left( v-ripple="" @click="editWebservice" tabindex="5") {{$i18n.t('webservice.edit')}}
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
            return{
                fileUploadFormData: new FormData(),
                loading: false,
                messages: {},
                fileHover: false,
                purse: '',
                webservice_category_id: '',
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
        },
        computed:{
            webservice(){
                return _.find(this.$store.state.auth.user.webservices, {'entity_id': this.$route.params.merchantCode});
            },
            pursesSelection() {
                if(this.$store.state.auth.user.purses) {
                    return this.$store.state.auth.user.purses.map(function (purse) {
                        return {
                            'title': '<span class="wallet-color color-' + purse.purse + '"></span>' + purse.name,
                            'value': purse.purse
                        }
                    });
                }
            },
            webserviceCatSelection() {
                if(this.$store.state.app.webserviceCategories) {
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
            selectedPurse(purseId) {
                this.purse = purseId;
            },
            selectedWebserviceCat(webserviceCatId) {
                this.webservice_category_id = webserviceCatId;
            },
            editWebservice() {
                this.loading = true;
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
                    ()=> {
                        this.changeWebserviceState();
                        store.commit('flashMessage',{
                            text: 'webservice edited success',
                            type: 'success'
                        });
                        this.$router.push({name: 'webservice.index'})
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
            changeWebserviceState(){
                let vm = this;
                let webserviceIndex = _.findIndex(this.$store.state.auth.user.webservices, function(webservice) {
                    return webservice.entity_id === vm.$route.params.merchantCode;
                });

                this.$store.state.auth.user.webservices[webserviceIndex].ip = this.site_ip;
                this.$store.state.auth.user.webservices[webserviceIndex].purse = this.purse;
                this.$store.state.auth.user.webservices[webserviceIndex].category_id = this.webservice_category_id;
            },
            dragOver() {
                window.addEventListener("dragover",function(e){
                    e.preventDefault();
                },false);
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
                    store.commit('flashMessage',{
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