<template lang="pug">
    div.warning-box-message
        div.nav-title-box
            span.icon-warning
            span.title
                slot(name="title")
        div.body
            slot(name="body")
</template>


<script>
    export default {
        name: 'alert-box',
    };
</script>