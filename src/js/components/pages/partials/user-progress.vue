<template lang="pug">
    canvas#userProgress(v-if="!isSmallSidebar" width="400" height="400")
    canvas#userProgress.small-user-image(v-else width="400" height="400")
</template>


<script>
export default {
    name: 'partial-sidebar-userProgress',
    props: [
        'avatar',
        'user_progress'
    ],
    mounted(){
        let canvas = document.getElementById("userProgress");
        this.profilePicture(canvas, this.user_progress.points,  this.avatar);
    },
    computed: {
        user(){
            return this.$store.state.auth.user;
        },
        isSmallSidebar(){
            return this.$store.state.app.smallSidebar;
        },
    },
    methods: {
        profilePicture(canvas, percent, avatar){
            let vm = this;
            let ctx = canvas.getContext("2d");
            ctx.scale(4, 4);
            ctx.webkitImageSmoothingEnabled =
            ctx.mozImageSmoothingEnabled = false;

            let thumbImg = document.createElement('img');
            thumbImg.src = avatar;

            let degrees = percent * 3.6;
            let radians = degrees * (Math.PI / 180);
            let gap = 7 * (Math.PI / 180);

            ctx.stroke();
            thumbImg.onload = function () {

                // gray line
                ctx.beginPath();
                ctx.strokeStyle = "#838383";
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.arc(46, 46, 42, radians + 1.5 * Math.PI + gap, (1.5 * Math.PI) - gap);
                ctx.stroke();
                ctx.save();


                // green line
                ctx.beginPath();
//                let grad1 = ctx.createRadialGradient(350, 200, 20, 350, 100, 200);
//                grad1.addColorStop(0, "#fb5c17");
//                grad1.addColorStop(0.5, "#00f");
//                grad1.addColorStop(1, "#fb5c17");
//
//                ctx.strokeStyle = grad1;

                ctx.strokeStyle = "#89E000";
                ctx.lineWidth = 5;
                ctx.arc(46, 46, 42, 1.5 * Math.PI, radians + 1.5 * Math.PI);
                ctx.stroke();
                ctx.save();



                //image
                ctx.beginPath();
                ctx.arc(46, 46, 38, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(thumbImg, 6, 6, 80, 80);
                ctx.beginPath();
                ctx.arc(0, 0, 25, 0, Math.PI * 2, true);
                ctx.clip();
                ctx.closePath();
                ctx.restore();

                // gray filter
                ctx.beginPath();
                ctx.strokeStyle = "rgba(255, 255, 255,.4)";
                ctx.lineWidth = 38;
                ctx.lineCap = 'butt';
                ctx.arc(46, 46, 19, radians + 1.5 * Math.PI, 1.5 * Math.PI);
                ctx.stroke();
                ctx.closePath();
                ctx.save();

                // percent
                if(percent < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = "#ffd600";
                    ctx.lineWidth = 1;
                    ctx.arc(84, 21, 14, 0, 2 * Math.PI, true);
                    ctx.fillStyle = '#ffd600';
                    ctx.fill();
                    ctx.fillStyle = '#000';
                    ctx.font = "11px IRANSans";
                    ctx.fillText(vm.numberToFarsi(percent) + "%", 95, 24);
                } else {

                }

                ctx.stroke();
                ctx.save();
            }
        },
        numberToFarsi(value) {
            if (typeof value == 'undefined') {
                return value;
            }
            value = typeof value === "number" ? value.toString() : value;
            return value.toString().replace(/\d/g, function (match) {
                return ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'][parseInt(match)];
            });
        }
    },


}


</script>