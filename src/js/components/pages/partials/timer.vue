<template lang="pug">
    div.time
        div.timer
        div.alive
            div.minutes
                span {{ $store.state.timer.minutes | persianNumbers }}
            div.sprator :
            div.seconds
                span {{ $store.state.timer.seconds | persianNumbers }}
</template>

<script>
    export default{
        name: 'timer',
        props:['seconds'],
        created() {
            this.updateTimer();
        },
        methods: {
            updateTimer () {
                let minutes, seconds;
                let duration = this.seconds;
                if (duration > (60 * 15)) {
                    duration = 60 * 15;
                }
                let vm = this;

                let timer = setInterval(function () {
                    minutes = parseInt(duration / 60, 10);
                    seconds = parseInt(duration % 60, 10);

                    minutes = minutes < 10 ? "0" + minutes : minutes;
                    seconds = seconds < 10 ? "0" + seconds : seconds;

                    if (--duration < 0) {
                        clearInterval(timer);
                        vm.onFinished();
                    }

                    vm.$store.commit('timer/updateTimer', {minutes: minutes.toString(), seconds:seconds.toString()})
                }, 1000);
            },
            onFinished() {
                this.$emit('onFinished');
            }
        }
    }
</script>