<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title ٖ{{ $i18n.t('webservice.editTitle') }}
                p.page-description ٖ{{ $i18n.t('webservice.editWebserviceDescription') }}
        div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section.create-webservice
            div.box
                div.body
                    div.row
                        div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                            input(type="text" v-model="site_ip" placeholder= "IP")
                            span.input-icon.ip-icon
                            input(type="text" v-model="site_name" placeholder= "نام وب‌سایت")
                            span.input-icon.home-icon
                            input(type="text" v-model="domain" placeholder= "آدرس وب‌سایت: domain.ir")
                            span.input-icon.earth-icon
                            input(type="text" v-model="tel" placeholder= "تلفن پشتیبانی وب‌سایت")
                            span.input-icon.mobile-icon
                            textarea.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-model="site_content" placeholder= "توضیحات وب‌سایت")
                            selectbox.selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectedPurse" v-bind:data="pursesSelection" placeholder="انتخاب کیف پول")
                            span.input-icon.purse-icon
                            selectbox.selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectedWebserviceCat" v-bind:data="webserviceCatSelection" placeholder="انتخاب دسته‌بندی وب‌سایت")
                            span.input-icon.webservice-cat-icon

                        div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                            div.row
                                div.col-lg-12.col-md-12.col-sm-12.col-xs-12
                                    div.nav-picker
                                        span.picker.pull-right {{$i18n.t('webservice.uploadLogo')}}

                                div.col-lg-12.col-md-12.col-sm-12.col-xs-12
                                    span(v-if="selectedLogo")
                                        img.webservice-logo(:src="selectedLogo")
                                    span(v-else)
                                        img.webservice-logo(:src="site_logo")






                                div.col-lg-12.col-md-12.col-sm-12.col-xs-12
                                    div.file-zone(@dragover="dragOver" @drop="onDrop" @dragleave="fileHover = false" v-bind:class="{'file-zone-hover': fileHover}")
                                        div.row
                                            div.col-lg-2.col-md-2.col-sm-12.col-xs-12.ta-center
                                                span.upload-icon

                                            div.col-lg-10.col-md-10.col-sm-12.col-xs-12.ta-center.nav-texts
                                                p فایل لوگو را اینجا رها کنید
                                                div.nav-file-input
                                                    span یا از کامپیوتر
                                                    input#attach(type="file" name="file" @change="onLogoChange")


                div.row
                    div.col-xs.nav-buttons
                        button.btn.success.pull-left(v-bind:class="{'disable': disableSubmit}" v-ripple @click="editWebservice") {{$i18n.t('webservice.edit')}}

</template>



<script>
    import selectbox from '../../partials/selectbox.vue';

    export default {
        name: 'pages-webservice-partials-edit',
        data(){
            return{
                fileUploadFormData: new FormData(),
                messages: {},
                fileHover: false,
                disableSubmit: true,
                purse: '',
                webservice_category_id: '',
                site_ip: '',
                site_name: '',
                domain: '',
                site_content: '',
                tel: '',
                selectedLogo: '',
                site_logo: '//logoland.zarinpal.com/734b8d6c9a0e6e29765c5bb4da8b0d68/125x125.png',//logoland.zarinpal.com/' + md5(this.webservice.entity_id) + '/125x125.png',
            }
        },
        created() {
            this.$store.dispatch('app/getWebserviceCategories');

            this.purse = this.webservice.purse;
            this.webservice_category_id = this.webservice.category_id;
            this.site_ip = this.webservice.ip;
            this.site_name = this.webservice.name;
            this.domain = this.webservice.domain;
            this.site_content = this.webservice.description;
            this.tel = this.webservice.tel;
            this.site_logo = this.webservice.logo;
        },
        computed:{
            webservice(){
                return _.find(this.$store.state.auth.user.webservices, {'entity_id': this.$route.params.merchantCode});
            },
            pursesSelection() {
                if(this.$store.state.auth.user.purses) {
                    return this.$store.state.auth.user.purses.map(function (purse) {
                        return {
                            'title': purse.name,
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
        },
        methods: {
            selectedPurse(purseId) {
                this.purse = purseId;
            },
            selectedWebserviceCat(webserviceCatId) {
                this.webservice_category_id = webserviceCatId;
            },
            editWebservice() {
                let webserviceData = {
                    purse: this.purse,
                    webservice_category_id: this.webservice_category_id,
                    site_name: this.site_name,
                    site_ip: this.site_ip,
                    site_content: this.site_content,
                    tel: this.tel,
                    domain: this.domain,
                    site_logo: this.site_logo,
                };

                let params = {
                    webservice_id: this.$route.params.merchantCode
                };

                this.$store.state.http.requests['webservice.postEdit'].update(params, webserviceData).then(
                    ()=> {
                        this.$router.push({name: 'webservice.index'})
                    },
                    (response) => {
                        store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            type: 'danger'
                        });
                    }
                )
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
                    this.disableSubmit = false;
                }, (response) => {
                    console.log('Error occurred...');
                });
            }
        },
        components: {
            selectbox
        }
    }
</script>