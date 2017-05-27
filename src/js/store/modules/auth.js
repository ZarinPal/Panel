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
        fetch ({commit, rootState, dispatch}, callback) {
            rootState.http.requests['app.getBasicInfo'].get().then(
                (response) => {
                    commit('fill', response.data.data);
                    dispatch('fetchPurceBalance', callback);
                }
            ).catch(()=>{
                callback(false);
            });
        },
        fetchPurceBalance({rootState, state}, callback){
            let purseCount = state.user.purses.length;
            state.user.purses.forEach(function (purse, index) {
                rootState.http.requests['purse.getBalance'].get({purseId: purse.purse}).then(response => {
                    let purseIndex = _.findIndex(state.user.purses, function(filterPurse) {
                        return filterPurse.purse === purse.purse
                    });
                    state.user.purses[purseIndex].balance = response.data.data;
                    if(purseCount-1 === index){
                        callback(true);
                    }
                });
            });


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
