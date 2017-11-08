<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $i18n.t('user.editInformationTitle') }}
                p.page-description {{ $i18n.t('user.editInformationDescription') }}


        div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section.level-up
            div.box

                form(autocomplete="on" onsubmit="event.preventDefault();")

                    <!--Step 1-->
                    div(v-if="step == 1")
                        <!--gender-->
                        div.row.no-margin
                            div.col-lg-4.col-md-4.col-sm-12.col-xs-12.no-margin
                                input(name="gender" v-model="gender" value="male" type="radio" id="rdoMale")
                                label(for="rdoMale")
                                    span
                                    | {{ $i18n.t('user.male') }}

                            div.col-lg-4.col-md-4.col-sm-12.col-xs-12.no-margin
                                input(name="gender" v-model="gender" value="female" type="radio" id="rdoFemale")
                                label(for="rdoFemale")
                                    span
                                    | {{ $i18n.t('user.female') }}


                        <!--first_name-->
                        div.row.no-margin
                            input(v-validate="'required'" v-bind:data-vv-as="$i18n.t('user.firstName')" :class="{'input-danger': errors.has('first_name')}" type="text" name="first_name" id="first_name" v-model="first_name" :placeholder= "$i18n.t('user.firstName')" autofocus tabindex="1" )
                            div.ta-right(v-if="validation('first_name')")
                                span.text-danger {{ errors.first('first_name') }}

                        div.row.no-margin
                            input(v-validate="'required'" v-bind:data-vv-as="$i18n.t('user.lastName')" :class="{'input-danger': errors.has('last_name')}" type="text" name="last_name" id="last_name" v-model="last_name" :placeholder= "$i18n.t('user.lastName')" autofocus tabindex="1" )
                            div.ta-right(v-if="validation('last_name')")
                                span.text-danger {{ errors.first('last_name') }}


                        div.row.no-margin
                            input(v-mask="{type: 'date'}" v-validate="'required'" v-bind:data-vv-as="$i18n.t('user.birthday')" :class="{'input-danger': errors.has('birthday')}" type="text" name="birthday" id="birthday" v-model="birthday" :placeholder= "$i18n.t('user.birthday')" autofocus tabindex="1" )
                            div.ta-right(v-if="validation('birthday')")
                                span.text-danger {{ errors.first('birthday') }}


                        div.row.no-margin
                            input(v-validate="'required|digits:10'" v-bind:data-vv-as="$i18n.t('user.ssn')" :class="{'input-danger': errors.has('ssn')}" type="text" name="ssn" id="ssn" v-model="ssn" :placeholder= "$i18n.t('user.ssn')" autofocus tabindex="1" )
                            div.ta-right(v-if="validation('ssn')")
                                span.text-danger {{ errors.first('ssn') }}


                        div.row.nav-button
                            div.col-xs
                                button.btn.success.pull-left(v-ripple="" @click="validateForm" tabindex="9") {{$i18n.t('purse.nextStep')}}
                                    svg.material-spinner(v-if="isSavingInformation" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                        circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")


                    <!--Step 2-->
                    div.row(v-if="step == 2")
                        input(type="file" name="file" @change="createFile($event, 'id_card_file')")
                        input(type="file" name="file" @change="createFile($event, 'national_card_file')")
                        input(type="file" name="file" @change="createFile($event, 'introduction_file')")

                        div(v-if="!isSaving")
                            span(v-if="isUploading") در حال آپلود فایل ...
                            span(v-if="isUploading == 'Failed' ") مشکل آپلود فایل

                        div(v-if="!isUploading")
                            span(v-if="isSaving") در حال ذخیره سازی
                            span(v-if="isSaving == 'Failed' ") مشکل در ذخیره سازی

                        div.row.nav-button
                            div.col-xs
                                button.btn.success.pull-left(v-ripple="" @click="postUploadDocuments" tabindex="9") {{$i18n.t('coupon.createCoupon')}}
                                    svg.material-spinner(v-if="sendRequest" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                        circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

</template>


<script>

    export default {
        name: 'uploadDocument',
        data() {
            return {
                step: 1, // [1=> user information, 2=> user documents]
                isSavingInformation: false,

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

                sendRequest: false,
                isUploading: false,
                isSaving: false,
                maxFileUpload: 3,
                howManyFileUploaded: 0,
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
                    gender: this.gender,
                    first_name: this.first_name,
                    last_name: this.last_name,
                    birthday: this.birthday,
                    ssn: this.ssn,
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
                this.isSavingInformation = true;
                let userData = {
                    gender: this.gender,
                    first_name: this.first_name,
                    last_name: this.last_name,
                    birthday: this.birthday,
                    ssn: this.ssn,
                };

                this.$store.state.http.requests['user.postInformation'].save(userData).then(
                    () => {
                        this.isSavingInformation = false;
                        //increase step to show upload documents
                        this.step = 2;

                    },
                    (response) => {
                        this.isSavingInformation = false;
                        store.commit('setValidationErrors', response.data.validation_errors);
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

                let reader = new FileReader();
                let vm = this;

                reader.onload = (e) => {
                    vm.documentFiles[whichFile] = file;
                };

                //set file data to reader
                reader.readAsDataURL(file);
            },
            /**
             * Upload files and save
             * file name after upload
             * that give by api
             */
            postUploadDocuments() {
                this.sendRequest = true;
                this.isUploading = true;

                let vm = this;

                let formData = new FormData();
                formData.append('type', 'document');

                let uploadedFileNames = [];
                _.forEach(this.documentFiles, function(file, fileKey) {
                    formData.append('file', file);

                    vm.$http.post('https://uploads.zarinpal.com/', formData, {emulateHTTP: true}).then((response) => {
                        vm.howManyFileUploaded++;

                        //add file name to uploaded file object
                        uploadedFileNames[fileKey] = response.data.meta.file_id;

                        //save user uploaded file in db
                        if (vm.howManyFileUploaded === vm.maxFileUpload) {
                            //change file uploading stauts
                            vm.isUploading = false;

                            //change status of saving
                            vm.isSaving = true;

                            //save user uploaded file name
                            vm.$store.state.http.requests['user.postUploadDocument']
                                .save(uploadedFileNames)
                                .then(
                                    (response) => {
                                        vm.sendRequest = false;
                                        vm.isSaving = false;

                                        this.$router.push({name: 'ticket.index'});
                                    }, (response) => {
                                        vm.isSaving = 'Failed';
                                        vm.sendRequest = false;

                                        store.commit('setValidationErrors', response.data.validation_errors);
                                        store.commit('flashMessage', {
                                            text: response.data.meta.error_message,
                                            type: 'danger'
                                        });
                                    }
                                );
                        }
                    }, (response) => {
                        vm.sendRequest = false;
                        vm.isUploading = 'Failed';
                        store.commit('setValidationErrors', response.data.validation_errors);
                    });

                });
            }

        },
    }
</script>