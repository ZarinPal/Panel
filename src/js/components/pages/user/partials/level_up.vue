<template lang="pug">
    span(v-if="step == 2")
        user-address(v-on:incrementUserLevelUpStep="incrementStep")

    div.inner-content(v-else)
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-12
                p.page-title {{ $i18n.t('user.' + pageTitle) }}
                p.page-description {{ $i18n.t('user.editInformationDescription') }}


        div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section.level-up
            div.box
                form(autocomplete="on" onsubmit="event.preventDefault();")
                    div.body
                        div.row
                            div.col-lg-12.col-md-12.col-sm-12.col-xs-12

                                div.row
                                    div.col-lg-6.col-md-12.col-sm-12.col-xs-12

                                        <!--Step 1-->
                                        div(v-if="step == 1")
                                            <!--gender-->
                                            div.row.nav-rows
                                                div.col-lg-5.col-md-5.col-sm-5.col-xs-5.no-margin
                                                    span.label {{ $i18n.t('user.gender') }}

                                                div.col-lg-7.col-md-7.col-sm-7.col-xs-7.no-margin
                                                    div.row
                                                        div.col-lg-6.col-md-6.col-sm-6.col-xs-6.ta-center.no-margin
                                                            input(name="gender" v-model="gender" value="male" type="radio" id="rdoMale")
                                                            label(for="rdoMale")
                                                                span
                                                                | {{ $i18n.t('user.male') }}

                                                        div.col-lg-6.col-md-6.col-sm-6.col-xs-6.ta-center.no-margin
                                                            input(name="gender" v-model="gender" value="female" type="radio" id="rdoFemale")
                                                            label(for="rdoFemale")
                                                                span
                                                                | {{ $i18n.t('user.female') }}

                                                    div.ta-right(v-if="validation('gender')")
                                                        span.text-danger {{ errors.first('gender') }}

                                            <!--first_name-->
                                            div.row.nav-rows
                                                input(v-validate="'required'" v-bind:data-vv-as="$i18n.t('user.firstName')" :class="{'input-danger': errors.has('first_name')}" type="text" name="first_name" id="first_name" v-model="first_name" :placeholder= "$i18n.t('user.firstName')" autofocus tabindex="1" )
                                                div.ta-right(v-if="validation('first_name')")
                                                    span.text-danger {{ errors.first('first_name') }}

                                            div.row.nav-rows
                                                input(v-validate="'required'" v-bind:data-vv-as="$i18n.t('user.lastName')" :class="{'input-danger': errors.has('last_name')}" type="text" name="last_name" id="last_name" v-model="last_name" :placeholder= "$i18n.t('user.lastName')" autofocus tabindex="1" )
                                                div.ta-right(v-if="validation('last_name')")
                                                    span.text-danger {{ errors.first('last_name') }}

                                            div.row.nav-rows
                                                date-picker.persian-num(v-validate="'required'" v-bind:data-vv-as="$i18n.t('common.birthday')" v-model="birthday" name="birthday" min="1300/01/01" :placeholder="$i18n.t('common.birthday')")
                                                div.ta-right(v-if="validation('birthday')")
                                                    span.text-danger {{ errors.first('birthday') }}

                                            div.row.nav-rows
                                                input(v-validate="'required|digits:10'" v-bind:data-vv-as="$i18n.t('user.ssn')" :class="{'input-danger': errors.has('ssn')}" type="text" name="ssn" id="ssn" v-model="ssn" :placeholder= "$i18n.t('user.ssn')" autofocus tabindex="1" )
                                                div.ta-right(v-if="validation('ssn')")
                                                    span.text-danger {{ errors.first('ssn') }}

                                        <!--Step 2-->
                                div(v-if="step == 3")

                                    <!--national_card_file-->
                                    div.row.nav-rows
                                        div.col-lg-4.col-md-4.col-sm-4.col-xs-12.no-margin
                                            span.label {{ $i18n.t('user.idCardFile') }}
                                        div.col-xs.no-margin
                                            label.attach
                                                span.select-text(:class="{'uploaded' : documentFiles.national_card_file}")
                                                    span(v-if="documentFiles.national_card_file") {{ $i18n.t('user.fileSelected') }}
                                                    span(v-else) {{ $i18n.t('user.clickToSelectFile') }}
                                                input(type="file" name="file" @change="createFile($event, 'national_card_file')")
                                    <!--id_card_file-->
                                    div.row.nav-rows
                                        div.col-lg-4.col-md-4.col-sm-4.col-xs-12.no-margin
                                            span.label {{ $i18n.t('user.nationalCardFile') }}
                                        div.col-xs.no-margin
                                            label.attach
                                                span.select-text(:class="{'uploaded' : documentFiles.id_card_file}")
                                                    span(v-if="documentFiles.id_card_file") {{ $i18n.t('user.fileSelected') }}
                                                    span(v-else) {{ $i18n.t('user.clickToSelectFile') }}
                                                input(type="file" name="file" @change="createFile($event, 'id_card_file')")


                                    div.row.nav-rows
                                        div.col-xs-12.label-red
                                            span {{ $i18n.t('user.uploadDocumentNotice') }}

                                    <!--introduction_file-->
                                    div.row.nav-rows
                                        div.col-xs-12
                                            input(type="checkbox" v-model="visible_introduction" id="introduction")
                                            label(for="introduction")
                                                span
                                                | {{$i18n.t('user.imIntroductionUser')}}

                                    div.row.nav-rows(v-if="visible_introduction")
                                        div.col-xs-12.agreement-label
                                            span.label {{ $i18n.t('common.agreement') }}
                                        div.col-xs-12
                                            span {{ $i18n.t('user.detailIntroductionUser') }}
                                        div.row.nav-rows.col-xs
                                            div.col-lg-4.col-md-4.col-sm-4.col-xs-12.no-margin
                                                span.label
                                                | {{ $i18n.t('user.introductionFile') }}
                                            div.col-xs.no-margin
                                                label.attach
                                                    span.select-text(:class="{'uploaded' : documentFiles.introduction_file}")
                                                        span(v-if="documentFiles.introduction_file") {{ $i18n.t('user.fileSelected') }}
                                                        span(v-else) {{ $i18n.t('user.clickToSelectFile') }}
                                                    input(type="file" name="file" @change="createFile($event, 'introduction_file')")
                                    div(v-if="!isSaving")
                                        span(v-if="isUploading && isUploading != 'Failed'") در حال آپلود مدارک
                                        span.text-danger(v-if="isUploading == 'Failed' ") مشکل آپلود فایل
                                        loading.dis-ib.upload-loading(v-if="isUploading && isUploading != 'Failed'" v-bind:width="15" v-bind:height="15")

                                    div(v-if="!isUploading")
                                        span.text-danger(v-if="isSaving && isSaving != 'Failed'") در حال ذخیره سازی
                                        span(v-if="isSaving == 'Failed' ") مشکل در ذخیره سازی
                                        loading.dis-ib.upload-loading(v-if="isSaving && isSaving != 'Failed'" v-bind:width="15" v-bind:height="15")
                            div.full-width.nav-button
                                <!--Add information button-->
                                div.col-xs(v-if="step == 1")
                                    button.btn.success.pull-left(v-ripple="" @click="validateForm" tabindex="9") {{$i18n.t('purse.nextStep')}}
                                        svg.material-spinner(v-if="isSavingInformation" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                            circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

                                <!--Upload documents button-->
                                div.col-xs(v-if="step == 3")
                                    button.btn.success.pull-left(v-ripple="" @click="postUploadDocuments" tabindex="9") {{$i18n.t('user.upload')}}
                                        svg.material-spinner(v-if="sendRequest" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                            circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")


</template>


<script>
    import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
    import loading from '../../partials/loading';
    import address from './add_address';

    export default {
        name: 'uploadDocument',
        data() {
            return {
                pageTitle: 'editInformationTitle',
                step: 1, // [1=> user information, 2=> add address, 3=>user documents]
                isSavingInformation: false,
                visible_introduction: false,

                /**
                 * User information
                 */
                gender: 'male',
                first_name: this.$store.state.auth.user.first_name,
                last_name: this.$store.state.auth.user.last_name,
                birthday: '',
                ssn: this.$store.state.auth.user.ssn,

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
        created() {
            if (this.$store.state.auth.user.birthday) {
                this.birthday = moment(this.$store.state.auth.user.birthday).format('jYYYY-jMM-jDD')
            } else {
                this.birthday = '';
            }
        },
        methods: {
            /**
             * Validation
             */
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
            incrementStep() {
                this.step++;
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
                    birthday: moment(this.birthday, 'jYYYY/jMM/jDD').format('YYYY-MM-DD'),
                    ssn: this.ssn,
                };

                this.$store.state.http.requests['user.postInformation'].save(userData).then(
                    () => {
                        this.isSavingInformation = false;
                        //increase step to show upload documents
                        this.pageTitle = 'uploadDocumentTitle';
                        this.step = 2;
                    },
                    (response) => {
                        this.isSavingInformation = false;
                        store.commit('setValidationErrors', response.data.validation_errors);

                        if (response.data.meta.error_type == 'UserYouCanNotEditInfo') {
                            this.step++;
                        } else {
                            this.$store.commit('flashMessage', {
                                text: response.data.meta.error_type,
                                type: 'danger'
                            });
                        }
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
                        text: 'UserFileNotImageLocal',
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

                this.documentFiles = _.pickBy(this.documentFiles, _.isObject);

                let uploadedFileNames = {};
                _.forEach(this.documentFiles, function (file, fileKey) {
                    if (file) {
                        formData.append('file', file);

                        vm.$http.post('https://uploads.zarinpal.com/', formData, {emulateHTTP: true})
                            .then((response) => {
                                vm.howManyFileUploaded++;

                                //add file name to uploaded file object
                                uploadedFileNames[fileKey] = response.data.meta.file_id;

                                //save user uploaded file in db
                                if (vm.howManyFileUploaded === _.size(vm.documentFiles)) {
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

                                                store.commit('flashMessage', {
                                                    text: 'UserFileUploadedLocal',
                                                    type: 'success'
                                                });

                                                vm.$router.push({name: 'ticket.index'});
                                            }, (response) => {
                                                vm.isSaving = 'Failed';
                                                vm.sendRequest = false;

                                                store.commit('setValidationErrors', response.data.validation_errors);
                                                store.commit('flashMessage', {
                                                    text: response.data.meta.error_type,
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
                    }


                });
            },
        },
        components: {
            'user-address': address,
            loading,
            datePicker: VuePersianDatetimePicker
        }
    }
</script>