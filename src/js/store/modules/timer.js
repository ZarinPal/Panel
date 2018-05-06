export default {
    namespaced: true,
    state: {
        minutes: '00',
        seconds: '00',
        getPurseBalanceTime: Date.now(),
    },
    mutations: {
        updateTimer(state, {minutes, seconds}) {
            state.minutes = minutes;
            state.seconds = seconds;
        },
    },
};