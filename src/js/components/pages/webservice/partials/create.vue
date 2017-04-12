<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title ٖ{{ $t('webservice.create') }}
                p.page-description ٖ{{ $t('common.webserviceCreateDescription') }}


        div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section.create-webservice
            div.box
                div.body
                    div.row
                        div.col-lg-8.col-md-8.col-sm-12.col-xs-12
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

                div.row
                    div.col-xs.nav-buttons
                        button.btn.success.pull-right(v-ripple @click="createWebservice") {{$t('webservice.create')}}

</template>


<script>
    import selectbox from '../../partials/selectbox.vue';

    export default {
        name: 'pages-webservice-partials-create',
        data() {
            return {
                fileHover: false,
                messages: {},
                domain: '',
                tel: '',
                purse: '1',
                webservice_category_id: '3',
                site_name: '',
                site_content: '',
                image: '',
                fileUploadFormData: new FormData(),
            }
        },
        created(){
            this.$store.dispatch('app/getWebserviceCategories');
        },
        computed:{
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
            }
        },
        methods: {
            selectedPurse(purseId) {
                this.purse = purseId;
            },
            selectedWebserviceCat(webserviceCatId) {
                this.webservice_category_id = webserviceCatId;
            },
            createWebservice() {
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
                        this.$router.push({name: 'webservice.index'})
                    },
                    (response) => {
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
            selectbox
        }
    }

</script>
