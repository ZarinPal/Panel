<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('webservice.create') }}
                p.page-description {{ $i18n.t('webservice.createDescription') }}


        div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section.create-webservice
            div.box
                div.body
                    div.row
                        div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                            div.row.no-margin
                                span.input-icon.home-icon
                                input(:class="{'input-danger': validationErrors.site_name}" type="text" v-model="site_name" placeholder= "نام وب‌سایت")
                                div.ta-right(v-if="validationErrors.site_name")
                                    span.text-danger {{ $i18n.t(validationErrors.site_name) }}

                            div.row.no-margin
                                span.input-icon.earth-icon
                                div.row.input-group.no-margin.full-width(:class="{'input-danger': validationErrors.domain}")
                                    div.col-xs.no-margin
                                        input.input.ta-left(type="text" v-model="domain"  placeholder= "آدرس وب‌سایت: domain.ir")
                                    div.no-margin.first-label
                                        span http://www.

                                div.ta-right(v-if="validationErrors.domain")
                                    span.text-danger {{ $i18n.t(validationErrors.domain) }}


                            div.row.no-margin
                                span.input-icon.mobile-icon
                                input(:class="{'input-danger': validationErrors.tel}" type="text" v-model="tel" placeholder= "تلفن پشتیبانی وب‌سایت")
                                div.ta-right(v-if="validationErrors.tel")
                                    span.text-danger {{ $i18n.t(validationErrors.tel) }}

                            div.row.no-margin
                                textarea.col-lg-12.col-md-12.col-sm-12.col-xs-12(:class="{'input-danger': validationErrors.site_content}" v-model="site_content" placeholder= "توضیحات وب‌سایت")
                                div.ta-right(v-if="validationErrors.site_content")
                                    span.text-danger {{ $i18n.t(validationErrors.site_content) }}

                            div.row.no-margin
                                purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectedPurse" placeholder="انتخاب کیف پول")

                            div.row.no-margin
                                webserviceCategories.webservice-categories(v-on:select="selectedWebserviceCat")
                                <!--span.input-icon.webservice-cat-icon-->

                div.row
                    div.col-xs.nav-buttons
                        button.btn.success.pull-right(v-ripple="" @click="createWebservice") {{$i18n.t('webservice.create')}}
                            svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

</template>


<script>
    import selectbox from '../../partials/selectbox.vue';
    import purse from '../../partials/purses.vue';
    import webserviceCategories from '../../partials/webservice-categories.vue';

    export default {
        name: 'pages-webservice-partials-create',
        data() {
            return {
                loading: false,
                fileHover: false,
                messages: {},
                domain: '',
                tel: '',
                purse: null,
                webservice_category_id: null,
                site_name: '',
                site_content: '',
                image: '',
                fileUploadFormData: new FormData(),
            }
        },
        computed:{
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
        created(){
            this.$store.dispatch('app/getWebserviceCategories');
        },
        methods: {
            selectedPurse(purseId) {
                this.purse = purseId;
            },
            selectedWebserviceCat(webserviceCatId) {
                this.webservice_category_id = webserviceCatId;
            },
            createWebservice() {
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
                    ()=> {
                        store.commit('flashMessage',{
                            text: 'ticket-new-webservice',
                            type: 'danger'
                        });
                        this.$router.push({name: 'webservice.index'})
                    },
                    (response) => {
                        this.loading = false;
                        store.commit('setValidationErrors',response.data.validation_errors);
                        this.messages = response.data.meta.error_message;
                        store.commit('flashMessage',{
                            text: this.messages,
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
                    store.commit('flashMessage',{
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
