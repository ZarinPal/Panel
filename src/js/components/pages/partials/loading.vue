<template lang="pug">
  div.nav-loading(v-if="!width && !height")
    svg.material-spinner(width="30px" height="30px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
      circle.path-colors(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

  div.nav-loading(v-else)
    svg.material-spinner(:width="width" :height="height" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
      circle.path-colors(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")
</template>

<script>
  export default {
    name: 'loading',
    props: ['width', 'height']
  }
</script>
