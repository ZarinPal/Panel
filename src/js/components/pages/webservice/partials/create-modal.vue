<template lang="pug">
    transition(name="fade"
    enter-active-class="fade-in"
    leave-active-class="fade-out")
        div.modal.webservice-create(v-on:click.self="closeModal()")
            transition(name="zoom"
            enter-active-class="zoom-in"
            leave-active-class="zoom-out")
                div.row.center-xs(v-if="!closeModalContent" v-on:click.self="closeModal()")
                    div.col-lg-5.col-md-5.col-sm-10.col-xs-10.content
                        div.header
                            span.icon-close(@click="closeModal()")
                            span.title {{ $t('webservice.create') }}
                        div.body
                            div.contains

                                div.row
                                    input(type="text" v-model="site_name" placeholder= "نام وب‌سایت")
                                    input(type="text" v-model="domain" placeholder= "آدرس وب‌سایت: domain.ir")
                                    input(type="text" v-model="tel" placeholder= "تلفن پشتیبانی وب‌سایت")
                                    textarea.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-model="site_content" placeholder= "توضیحات وب‌سایت")
                                    selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectedPurse" v-bind:data="pursesSelection" placeholder="انتخاب کیف پول")
                                    selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectedWebserviceCat" v-bind:data="webserviceCatSelection" placeholder="انتخاب دسته‌بندی وب‌سایت")


                                div.row
                                    div.col-xs.no-margin
                                        button.btn.success.pull-left(@click="createWebservice") {{$t('webservice.create')}}

</template>


<script>
    import selectbox from '../../partials/selectbox.vue';

    export default {
        name: 'pages-webservice-partials-create',
        data() {
            return {
                closeModalContent: true,
                domain: '',
                tel: '',
                purse: '',
                webservice_category_id: '3',
                site_name: '',
                site_content: '',
            }
        },
        created(){
            this.$store.dispatch('app/getWebserviceCategories');
        },
        mounted(){
            this.closeModalContent = false
        },
        computed:{
            pursesSelection() {
                return this.$store.state.auth.user.purses.map(function (purse) {
                    return {
                        'title': purse.name,
                        'value': purse.purse
                    }
                });
            },
            webserviceCatSelection() {
                return this.$store.state.app.webserviceCategories.map(function (value) {
                    return {
                        'title': value.title,
                        'value': value.public_id
                    }
                });
            },
//            webserviceCategories(){
//                return this.$store.state.app.webserviceCategories;
//            },
        },
        methods: {
            closeModal() {
                this.$emit('closeModal')
            },
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
                        this.errorMessage = response.data.meta.error_message;
                        alert(this.errorMessage)
                    }
                )
            }
        },
        components: {
            selectbox
        }
    }

</script>
