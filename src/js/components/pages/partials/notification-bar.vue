<template lang="pug">
div.full-width.notification-container.snack-animated(v-if="notificationBar == 'visible'")
    a.full-width(href="https://goo.gl/9k3mXw" target="blank")
        div.notification-bar.row
          div.col-lg-10.col-md-10.col-sm-10.col-xs-12.xs-ta.center
              div.xs-ta.center
                a(href="https://goo.gl/9k3mXw" target="blank").message قهرمان کسب و کار خودت باش!
    span.notification-bar-close(@click="closeNotificationBar") بستن اعلان
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
      //Clear prev notification key
      if (localStorage.getItem('notification_bar')) {
        localStorage.removeItem('notification_bar');
      }

      //Check new notification bar
      if (!localStorage.getItem('biz_notification_bar')) {
        localStorage.setItem('biz_notification_bar', 'visible');
      }

      this.notificationBar = localStorage.getItem('biz_notification_bar');
    },
    methods: {
      closeNotificationBar() {
        this.notificationBar = 'hidden';
        localStorage.setItem('biz_notification_bar', 'hidden');
      }
    }
  };
</script>