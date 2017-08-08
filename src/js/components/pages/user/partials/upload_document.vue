<template lang="pug">
    span
        h1 upload document
</template>


<script>

    export default {
        name: 'uploadDocument',
        data() {
            return {
                fileUploading: false,
                id_card_file :null,
                national_card_file: null,
                introduction_file: null
            }
        },
        computed:{
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
        },
        methods: {
            createFile(file) {
                //check valid files
                let fileExtension = /(\.jpg|\.jpeg|\.gif|\.png|\.zip)$/i;
                if(!fileExtension.exec(file.name))
                {
                    store.commit('flashMessage',{
                        text: 'fileNotImage',
                        type: 'danger'
                    });
                    return;
                }

                this.fileUploading = true;
                let reader = new FileReader();
                let vm = this;

                reader.onload = (e) => {
                    vm.attachment = e.target.result;
                };
                reader.readAsDataURL(file);

                let formData = new FormData();
                formData.append('type', 'document');
                formData.append('file', file);

                this.$http.post('https://uploads.zarinpal.com/', formData, {emulateHTTP: true}).then((response) => {
                    this.attachment = response.data.meta.file_id;
                    this.fileUploading = false;
                }, (response) => {
                    this.fileUploading = 'Failed';
                });
            },
        },
        components:{

        }
    }
</script>