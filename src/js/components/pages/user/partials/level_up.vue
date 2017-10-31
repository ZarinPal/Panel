<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('user.editInformationTitle') }}
                p.page-description {{ $i18n.t('user.editInformationDescription') }}

        form(autocomplete="on" onsubmit="event.preventDefault();")
            div.row.section.nav-create-coupon
                div.row.box


                    input(type="file" name="file" @change="createFile($event, 'id_card_file')")
                    input(type="file" name="file" @change="createFile($event, 'national_card_file')")



                    div.row.nav-button
                        div.col-xs
                            button.btn.success.pull-left(v-ripple="" @click="postUploadDocuments" tabindex="9") {{$i18n.t('coupon.createCoupon')}}
                                svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                    circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

</template>


<script>

    export default {
        name: 'uploadDocument',
        data() {
            return {
                loading: false,

                /**
                 * User information
                 */
                gender: 'male',
                first_name: 'amin',
                last_name: 'nazari',
                birthday: '1374-09-14',
                ssn: '4890271880',

                /**
                 * upload documents variables
                 */
                documentFiles: {
                    id_card_file: null,
                    national_card_file: null,
                    introduction_file: null,
                },

                id_card_file: null,
                national_card_file: null,
                introduction_file: null,

                uploading: false,
            }
        },
        computed: {
            birthdate() {
                let georgianBirthdate = moment(this.birthday, 'jYYYY-jMM-jDD');
                georgianBirthdate = georgianBirthdate._i.substr(0, georgianBirthdate._i.length - 3);
                return georgianBirthdate
            }
        },
        methods: {
            /**
             * Validation
             */
            validation(name) {
                if(this.$store.state.alert.validationErrors[name]) {
                    this.errors.clear();
                    this.errors.add(name, this.$store.state.alert.validationErrors[name], 'api');
                    this.$store.state.alert.validationErrors[name] = false;
                }
                return this.errors.has(name);
            },
            validateForm() {
                this.$validator.validateAll({
                    // purse: this.purse,
                    // name: this.name,
                }).then((result) => {
                    if (result) {
                        this.postLevelUp();
                    }
                });
            },

            /**
             * Update user information
             */
            postLevelUp() {
                this.loading = true;

                let userData = {
                    gender: this.gender,
                    first_name: this.first_name,
                    last_name: this.last_name,
                    birthday: this.birthdate,
                    ssn: this.ssn,
                };

                this.$store.state.http.requests['user.postInformation'].save(userData).then(
                    () => {

                    },
                    (response) => {
                        this.loading = false;
                        this.$store.commit('flashMessage', {
                            text: response.data.meta.error_message,
                            type: 'danger'
                        });
                    }
                )
            },

            /**
             * Upload user documents
             */
            createFile(e, whichFile) {
                let files = e.target.files || e.dataTransfer.files;
                let file = files[0];
                if (!files.length)
                    return;

                //check valid files
                let fileExtension = /(\.jpg|\.jpeg|\.gif|\.png)$/i;
                if (!fileExtension.exec(file.name)) {
                    store.commit('flashMessage', {
                        text: 'fileNotImage',
                        type: 'danger'
                    });
                    return;
                }

                this.fileUploading = true;
                let reader = new FileReader();
                let vm = this;

                reader.onload = (e) => {
                    vm.documentFiles[whichFile] = file;
                };

                //set file data to reader
                reader.readAsDataURL(file);
            },

            postUploadDocuments() {
                let vm = this;

                let formData = new FormData();
                formData.append('type', 'document');

                _.forEach(this.documentFiles, function(file, fileKey) {
                    formData.append('file', file);

                    vm.$http.post('https://uploads.zarinpal.com/', formData, {emulateHTTP: true}).then((response) => {
                        console.log(response.data);
                    }, (response) => {
                        this.fileUploading = 'Failed';
                        console.log('Error occurred...');
                    });


                });




            }

        },
    }
</script>