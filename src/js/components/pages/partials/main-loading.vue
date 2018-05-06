<template lang="pug">
    div(v-if="!$store.state.app.isLoaded")
        div.three-circle-loading
            div.spinner
            div.spinner
            div.spinner
</template>

<script>
    export default {
        name: 'main-loading',
    }
</script>