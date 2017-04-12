<template lang="pug">
    div.inner-content

        div.row.nav-page-header
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                p.page-title {{ $t('common.tickets') }}
                p.page-description ٖ{{ $t('ticket.sendDescription') }}
            div.col-lg-6.col-md-6.col-sm-6.col-xs-6
                div.break
                router-link.btn.default.pull-left(tag="button" v-bind:to="{ name: 'home.index'}") {{ $t('common.returnToDashboard') }}

        div.nav-ticket-create.col-lg-12.col-xs-12
            div.row
                div.right-box.col-lg-7.col-md-6.col-sm-12.col-xs-12
                    div.row
                        div.col-lg-7.col-md-7.col-sm-12.col-xs-12
                            input.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-model="title" type="text"  placeholder="عنوان تیکت")
                        div.col-lg-5.col-md-5.col-sm-12.col-xs-12
                            selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-on:select="selectDepartment" v-bind:data="departmentSelection" placeholder="دپارتمان")


                    div.row.no-margin
                        textarea(v-model="content" placeholder="توضیحات")

                div.left-box.col-lg-5.col-md-6.col-sm-12.col-xs-12
                    div.row
                        div
                            span.label {{$t('ticket.priority')}}:
                        div.col-xs.nav-picker
                            span.picker(v-ripple @click="priority = '1'" v-bind:class="{ 'picker-active': priority == '1' }") {{$t('ticket.important')}}
                            span.picker(v-ripple @click="priority = '0'" v-bind:class="{ 'picker-active': priority == '0' }") {{$t('ticket.normal')}}
                            span.picker(v-ripple @click="priority = '2'" v-bind:class="{ 'picker-active': priority == '2' }") {{$t('ticket.very-important')}}


                        div.col-lg-12.col-md-12.col-sm-12.col-xs-12
                            div.file-zone(@dragover="dragOver" @drop="onDrop" @dragleave="fileHover = false" v-bind:class="{'file-zone-hover': fileHover}")
                                div.row
                                    div.col-lg-2.col-md-2.col-sm-12.col-xs-12.ta-center
                                        span.upload-icon

                                    div.col-lg-10.col-md-10.col-sm-12.col-xs-12.ta-center.nav-texts(@dragenter="fileHover = true" @dragleave="fileHover = false")
                                        p فایل لوگو را اینجا رها کنید
                                        div.nav-file-input
                                            span یا از کامپیوتر
                                            input#attach(type="file" @change="onFileChange")
                                            div.file-name(v-if="fileName") {{fileName}}

                    div.row.nav-button
                        div.col-xs.no-margin
                            button.btn.success.pull-left(v-ripple @click="send") {{$t('ticket.createTicket')}}

</template>

<script>
    import selectbox from '../partials/selectbox.vue';

    export default {
        name: 'ticket-create',
        data() {
            return {
                status: 0 ,
                priority: 0,
                title: '',
                content: '',
                errorMessage: '',
                selectedDepartment: '',
                fileHover: false,
                file: '',
                fileName: ''
            }
        },
        created(){
            this.$store.dispatch('app/getTicketDepartments');
        },
        computed:{
            departmentSelection() {
                if(this.$store.state.app.ticketDepartments) {
                    return this.$store.state.app.ticketDepartments.map(function (department) {
                        return {
                            'title': department.name,
                            'value': department.entity_id
                        }
                    });
                }
            },
        },
        methods: {
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
            onFileChange(e) {
                let files = e.target.files || e.dataTransfer.files;
                if (!files.length)
                    return;
                this.createFile(files[0]);
            },
            createFile(file) {
                let image = new Image();
                let reader = new FileReader();
                let vm = this;
                this.fileName = file.name;


                reader.onload = (e) => {
                    vm.file = e.target.result;
                };
                reader.readAsDataURL(file);
            },
            send() {
                let ticketData = {
                    title : this.title,
                    content : this.content,
                    ticket_department_id : this.selectedDepartment,
                    priority : this.priority,
                    status : this.status,
                };
                this.$store.state.http.requests['ticket.postAdd'].save(ticketData).then(
                    ()=> {
                        this.$router.push({name: 'ticket.index'})
                    },
                    (response) => {
                        store.commit('flashMessage',{
                            text: response.data.meta.error_message,
                            type: 'danger'
                        });
                    }
                )
            },
            selectDepartment(departmentId) {
                this.selectedDepartment = departmentId;
            }
        },
        components: {
            selectbox
        }

    }
</script>
