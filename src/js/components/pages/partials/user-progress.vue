<template lang="pug">
    svg.progress(xmlns="http://www.w3.org/2000/svg"  width="100" height="120" viewBox="0 0 90 92")
        defs
            filter#group-3-c( width="137.8%" height="233.3%" x="-18.9%" y="-47.6%" filterUnits="objectBoundingBox")
                feOffset( dy="4" in="SourceAlpha" result="shadowOffsetOuter1")
                feGaussianBlur( in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="4")
                feColorMatrix( in="shadowBlurOuter1" result="shadowMatrixOuter1" values="0 0 0 0 1   0 0 0 0 0.831775701   0 0 0 0 0  0 0 0 0.349665987 0")
                feMerge
                    feMergeNode( in="shadowMatrixOuter1")
                    feMergeNode( in="SourceGraphic")
            pattern( id="image" x="0%" y="0%" height="100%" width="100%" viewBox="0 0 140 140")
                image( x="0%" y="0%" width="140" height="140" :xlink:href="user.avatar")
        g(fill="none" fill-rule="evenodd")
            circle( cx="45" cy="45" r="41" fill="none" stroke="#e6e6e6" stroke-width="6")
            circle.progress_step#userProgress(stroke-linecap="round" cx="45" cy="45" r="41" fill="none" stroke="#1CDB26" stroke-width="6")

            g( transform="translate(14 14)")
                circle(fill="url(#image)" cx="30.25" cy="30.25" r="30.25")
            circle( cx="73" cy="17" r="15" fill="#FFDA61")
            text( fill="#2A2A2A" font-family="IRANSans-Bold, IRANSans" font-size="12" font-weight="bold")
                tspan( x="73" y="21" text-anchor="middle") {{numberToPersian(user.user_progress.points)}}%
            g(filter="url(#group-3-c)" transform="translate(9 68)")
                rect( width="74" height="21" :fill="levelColor()" rx="10.5")
                text( fill="#2A2A2A" font-family="IRANSans-Medium, IRANSans" font-size="10" font-weight="400")
                    tspan( x="35" y="13" text-anchor="middle") ZP.{{user.public_id}}
</template>


<script>
  export default {
    name: 'partial-sidebar-userProgress',
    mounted() {
      this.renderProgress();
    },
    computed: {
      isSmallSidebar() {
        return this.$store.state.app.smallSidebar;
      },
      appIsLoaded() {
        return this.$store.state.app.isLoaded;
      },
      user() {
        if (!this.$store.state.auth.check)
          return {user_progress: {points: 0}, public_id: 1};
        return this.$store.state.auth.user;
      },
    },
    watch: {
      appIsLoaded() {
        this.renderProgress();
      },
      user() {
        this.renderProgress();
      },
    },
    methods: {
      levelColor() {
        switch (this.user.level) {
          case 1:
            return '#FFFFFF';
            break;
          case 2:
            return '#D5D9DB';
            break;
          case 3:
            return '#FFDA47';
            break;
          default:
            return '#FFFFFF';
        }
      },
      numberToPersian(value) {
        if (typeof value == 'undefined') {
          return value;
        }
        value = typeof value === "number" ? value.toString() : value;
        return value.toString().replace(/\d/g, function(match) {
          return ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'][parseInt(match)];
        });
      },
      renderProgress() {
        let circle = document.getElementById("userProgress");
        let dashoffset = 257.6106;
        if (this.$store.state.app.isLoaded) {
          if (isNaN(this.user.user_progress.points)) {
            this.user.user_progress.points = 100;
          } else {
            if (this.user.user_progress.points < 0) {
              this.user.user_progress.points = 0;
            }
            if (this.user.user_progress.points > 100) {
              this.user.user_progress.points = 100;
            }
          }
          let RADIUS = circle.getAttribute("r");
          let CIRCUMFERENCE = 2 * Math.PI * RADIUS;
          let progress = this.user.user_progress.points / 100;
          dashoffset = CIRCUMFERENCE * (1 - progress);
        }
        circle.setAttribute('stroke-dashoffset', dashoffset);
      },
    },
  }
</script>