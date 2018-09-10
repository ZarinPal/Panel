<template lang="pug">
  div.notification-bar.row.snack-animated(v-if="notificationBar == 'visible'")
      div.col-lg-10.col-md-10.col-sm-10.col-xs-12.xs-ta.center
          div.xs-ta.center
            a(href="https://www.zarinpal.com/blog/%D8%A7%D9%85%D8%B6%D8%A7%D8%A1-%D8%AA%D9%81%D8%A7%D9%87%D9%85%E2%80%8C%D9%86%D8%A7%D9%85%D9%87-%D9%BE%D8%B1%D8%AF%D8%A7%D8%AE%D8%AA%E2%80%8C%DB%8C%D8%A7%D8%B1%DB%8C-%D8%AA%D9%88%D8%B3%D8%B7-%D8%A8/" target="blank").message امضاء تفاهم‌نامه پرداخت‌یاری توسط بانک مرکزی و زرین‌پال
      div.col-lg-2.col-md-2.col-sm-2.col-xs-12.xs-ta.center
          span.close(@click="closeNotificationBar") بستن اعلان
</template>

<script>
  export default {
    name: 'notification-bar',
    data() {
      return {
        notificationBar: 'hidden',
      }
    },
    created() {
      if (!localStorage.getItem('notification_bar')) {
        localStorage.setItem('notification_bar', 'visible');
      }

      this.notificationBar = localStorage.getItem('notification_bar');
    },
    methods: {
      closeNotificationBar() {
        this.notificationBar = 'hidden';
        localStorage.setItem('notification_bar', 'hidden');
      }
    }
  };
</script>