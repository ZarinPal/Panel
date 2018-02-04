<template lang="pug">
    canvas#userProgress(v-if="!isSmallSidebar" width="440" height="450")
    canvas#userProgress.small-user-image(v-else width="440" height="450")
</template>


<script>
    export default {
        name: 'partial-sidebar-userProgress',
        data() {
            return {
                levelColorCode: '#ffd600',
            }
        },
        props: [
            'user',
            'user_progress'
        ],
        mounted(){
            let canvas = document.getElementById("userProgress");
            this.profilePicture(canvas, this.user_progress.points, this.user.avatar);
        },
        computed: {
            isSmallSidebar(){
                return this.$store.state.app.smallSidebar;
            },
        },
        methods: {
            profilePicture(canvas, percent, avatar){
                let vm = this;

                let degrees = percent * 3.6;
                let radians = degrees * (Math.PI / 180);
                let gap = 7 * (Math.PI / 180);

                let ctx = canvas.getContext("2d");
                ctx.scale(4, 4);
                ctx.webkitImageSmoothingEnabled =
                    ctx.mozImageSmoothingEnabled = true;
                let thumbImg = document.createElement('img');
                thumbImg.src = avatar;

                thumbImg.onload = function () {
                    ctx.translate(5, 5);

                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(50, 50, 35, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(thumbImg, 15, 15, 70, 70);
                    ctx.beginPath();
                    ctx.arc(0, 0, 25, 0, Math.PI * 2, true);
                    ctx.clip();
                    ctx.closePath();
                    ctx.restore();
                    ctx.save();

                    // white circle
                    ctx.beginPath();
                    ctx.strokeStyle = "#fff";
                    ctx.lineWidth = 7;
                    ctx.lineCap = "round";
                    ctx.arc(50, 50, 46, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();
                    ctx.restore();
                    ctx.save();

                    // green circle
                    ctx.beginPath();
                    ctx.strokeStyle = "#89E000";
                    ctx.lineWidth = 7;
                    ctx.lineCap = "round";
                    ctx.arc(50, 50, 46, 1.5 * Math.PI, radians + 1.5 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();
                    ctx.restore();
                    ctx.save();

                    // percent
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.arc(81, 19, 15, 0, 2 * Math.PI, true);
                    ctx.fillStyle = vm.levelColor(vm.user.level);
                    ctx.fill();
                    ctx.fillStyle = '#000';
                    ctx.font = "12px IRANSans";
                    ctx.textAlign="center";
                    ctx.fillText(vm.numberToFarsi(percent) + "٪", 81, 22);
                    ctx.closePath();
                    ctx.restore();
                    ctx.save();


                    // zpid
                    ctx.beginPath();
                    ctx.lineCap = "round";
                    ctx.strokeStyle= vm.levelColor(vm.user.level);
                    // ctx.shadowColor = vm.levelColor(vm.user.level);
                    // ctx.shadowBlur = 20;
                    // ctx.shadowOffsetX = 0;
                    // ctx.shadowOffsetY = 4;
                    ctx.lineWidth = 21;
                    ctx.moveTo(23, 89);
                    ctx.lineTo(77, 89);
                    ctx.stroke();
                    ctx.stroke();
                    ctx.stroke();
                    ctx.restore();
                    ctx.save();

                    ctx.beginPath();
                    ctx.fillStyle='#000';
                    ctx.textAlign="center";
                    ctx.font="10px IRANSans";
                    ctx.fillText('ZP.' + vm.user.public_id, 50, 93);
                    ctx.stroke();
                    ctx.restore();
                    ctx.save();
                }
            },
            levelColor() {
                switch(this.user.level) {
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
                        return '#f80';
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