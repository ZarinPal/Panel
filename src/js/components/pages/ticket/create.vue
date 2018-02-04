<template lang="pug">
    div.inner-content
        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                p.page-title {{ $i18n.t('common.tickets') }}
                p.page-description {{ $i18n.t('ticket.sendDescription') }}
            div.col-lg-6.col-md-6.col-sm-12.col-xs-12
                router-link.btn.default.pull-left(tag="button" v-bind:to="{ name: 'home.index'}") {{ $i18n.t('common.returnToDashboard') }}

        div.nav-ticket-create.col-lg-12.col-xs-12
            form(autocomplete="on" onsubmit="event.preventDefault();")
                div.row
                    div.right-box.col-lg-7.col-md-6.col-sm-12.col-xs-12
                        div.row.field-row
                            div.col-lg-7.col-md-7.col-sm-12.col-xs-12.field-box
                                input.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-focus="" v-validate="{ rules: {required: true, min: 5, max:255}}"  v-bind:data-vv-as="$i18n.t('ticket.title')" :class="{'input-danger': errors.has('title')}" v-model="title" name="title" type="text" :placeholder="$i18n.t('ticket.title')" tabindex="1")
                                div.ta-right(v-if="validation('title')")
                                    span.text-danger {{ errors.first('title') }}


                            div.col-lg-5.col-md-5.col-sm-12.col-xs-12.field-box
                                selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(@click.native="removeErrors('ticket_department_id')" v-validate="{ rules: {required: true}}" name="ticket_department_id" v-model="ticket_department_id" id="ticket_department_id" v-bind:data-vv-as="$i18n.t('ticket.department')" :class="{'input-danger': errors.has('ticket_department_id')}" v-on:select="selectDepartment" v-bind:selected="priority" v-bind:data="departmentSelection" :placeholder="$i18n.t('ticket.department')" tabindex="2")
                                div.ta-right(v-if="validation('ticket_department_id')")
                                    span.text-danger {{ errors.first('ticket_department_id') }}


                        div.row.no-margin
                            textarea(v-validate="{ rules: {required: true, min: 10, max:10000}}" v-bind:data-vv-as="$i18n.t('common.description')" :class="{'input-danger': errors.has('content')}" v-model="content" name="content" :placeholder="$i18n.t('common.description')" tabindex="3")
                            div.ta-right(v-if="validation('content')")
                                span.text-danger {{ errors.first('content') }}


                    div.left-box.col-lg-5.col-md-6.col-sm-12.col-xs-12.field-row
                        div.row.field
                            div
                                span.label {{$i18n.t('ticket.priority')}}:
                            div.col-xs.nav-picker
                                span.picker(v-ripple="" @click="priority = '1'" v-bind:class="{ 'picker-active': priority == '1' }") {{$i18n.t('ticket.important')}}
                                span.picker(v-ripple="" @click="priority = '0'" v-bind:class="{ 'picker-active': priority == '0' }") {{$i18n.t('ticket.normal')}}
                                span.picker(v-ripple="" @click="priority = '2'" v-bind:class="{ 'picker-active': priority == '2' }") {{$i18n.t('ticket.very-important')}}


                            div.col-lg-12.col-md-12.col-sm-12.col-xs-12
                                div.file-zone(@dragover="dragOver" @drop="onDrop" @dragleave="fileHover = false" v-bind:class="{'file-zone-hover': fileHover, 'input-danger': errors.has('attachment')}" )
                                    div.row
                                        div.col-lg-2.col-md-2.col-sm-12.col-xs-12.ta-center.ta-center(@dragenter="fileHover = true" @dragleave="fileHover = false")
                                            span.upload-icon

                                        div.col-lg-10.col-md-10.col-sm-12.col-xs-12.ta-center.nav-texts(@dragenter="fileHover = true" @dragleave="fileHover = false")
                                            p(@dragover="dragOver" @drop="onDrop" @dragleave="fileHover = false" ) فایل لوگو را اینجا رها کنید
                                            div.nav-file-input(@dragover="dragOver" @drop="onDrop" @dragleave="fileHover = false")
                                                span(@dragenter="fileHover = true" @dragleave="fileHover = false") یا از کامپیوتر

                                                label.attach
                                                    span.select-text انتخاب کنید
                                                    input(type="file" name="file" @change="onFileChange")

                                                div.file-name(v-if="fileUploaded" @dragover="dragOver" @drop="onDrop" @dragleave="fileHover = false" ) {{fileName}}
                                                span.nav-upload-loading(v-if="fileUploading")
                                                    loading

                            div.ta-right(v-if="validation('attachment')")
                                span.text-danger {{ errors.first('attachment') }}

                        div.row.nav-button
                            div.col-xs.no-margin
                                button.btn.success.pull-left(v-ripple="" @click="validateForm") {{$i18n.t('ticket.createTicket')}}
                                    svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                                        circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

</template>

<script>
    import selectbox from '../partials/selectbox.vue';
    import loading from '../../pages/partials/loading.vue';


    export default {
        name: 'ticket-create',
        data() {
            return {
                fileUploading: false,
                fileUploaded: false,
                loading: false,
                status: 0,
                priority: 0,
                title: '',
                content: '',
                errorMessage: '',
                ticket_department_id: '',
                fileHover: false,
                file: '',
                fileName: '',
                attachment: '',
            }
        },
        created(){
            store.commit('clearValidationErrors');
            this.$store.dispatch('app/getTicketDepartments');
        },
        computed: {
            departmentSelection() {
                if (this.$store.state.app.ticketDepartments) {
                    return this.$store.state.app.ticketDepartments.map(function (department) {
                        return {
                            'title': department.name,
                            'value': department.entity_id
                        }
                    });
                }
            },
            validationErrors() {
                return this.$store.state.alert.validationErrors;
            },
        },
        methods: {
            validateForm() {
                this.$validator.validateAll({
                    title: this.title,
                    content: this.content,
                    ticket_department_id: this.ticket_department_id
                }).then((result) => {
                    if (result) {
                        this.send();
                    }
                });
            },
            removeErrors: function (field) {
                !!this[field] && this.errors.remove(field);
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
            onFileChange(e) {
                let files = e.target.files || e.dataTransfer.files;
                if (!files.length)
                    return;
                this.createFile(files[0]);
                this.fileName = files[0].name;
            },
            createFile(file) {
                //check valid files
                let fileExtension = /(\.jpg|\.jpeg|\.gif|\.png|\.zip)$/i;
                if (!fileExtension.exec(file.name)) {
                    store.commit('flashMessage', {
                        text: 'TicketFileNotImageLocal',
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
                    this.fileUploaded = true;
                }, (response) => {
                    this.fileUploading = 'Failed';
                    store.commit('flashMessage', {
                        text: response.data.meta.error_type,
                        type: 'danger'
                    });
                });
            },
            send() {
                this.loading = true;
                let ticketData = {
                    title: this.title,
                    content: this.content,
                    ticket_department_id: this.ticket_department_id,
                    priority: this.priority,
                    status: this.status,
                    attachment: this.attachment,
                };
                this.$store.state.http.requests['ticket.postAdd'].save(ticketData).then(
                    () => {
                        this.fileUploaded = false;
                        this.$router.push({name: 'ticket.index'})
                    },
                    (response) => {
                        this.loading = false;
                        store.commit('setValidationErrors', response.data.validation_errors);
                        store.commit('flashMessage', {
                            text: response.data.meta.error_type,
                            type: 'danger'
                        });
                    }
                )
            },
            selectDepartment(departmentId) {
                this.ticket_department_id = departmentId;
            },
        },
        components: {
            selectbox,
            loading
        }

    }
</script>
