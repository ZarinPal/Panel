export default {
    namespaced: true,
    state: {
        isLoaded: false,
        user: {},
        check: false,
    },
    mutations: {
        fill(state, user) {
            state.user = user;
            state.check = true;
            state.isLoaded = true;

            if (user.creator) {
                state.is_creator = true;
            }
        },
        empty(state) {
            state.user = {};
        },
        change(state, data) {
            state.user[data.name] = data.value;
        },
    },
    actions: {
        fetch ({commit, rootState}) {
            rootState.http.requests['app.getBasicInfo'].get().then(
                (response) => {
                    commit('fill', response.data.data);
                }
            ).catch(()=>{});
        },
        save ({state, rootState}) {
            rootState.http.requests['profile'].update({
                mobile: state.user.mobile,
            }).catch(
                (response) => {
                }
            );
        },
        logout ({commit, rootState},vm) {
            rootState.http.requests['oauth.getLogout'].get().then(
                (response) => {
                    commit('empty');
                    vm.$router.push({name: 'auth.login'});
                }
            );
        }
    },
};
