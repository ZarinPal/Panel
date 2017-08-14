export default {
    namespaced: true,
    state: {
        isLoaded: false,
        user: {},
        check: false,
        otpTime: 30, //As seconds
        purseLoadedCount: 0,
        getPurseLimit:3
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
            state.check = false;
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
                    dispatch('fetchPurseBalance');
                    callback(true);
                }
            ).catch((response)=>{
                console.log(response);
                callback(false);
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
        },
        fetchPurseBalance({rootState, state, dispatch}){
            state.user.purses.forEach(function (purse) {
                rootState.http.requests['purse.getBalance'].get({purseId: purse.purse}).then(response => {
                    state.purseLoadedCount++;
                    dispatch('addBalanceToPurse', {purseId: purse.purse, purseBalance: response.data.data});
                    // dispatch('chanePurseBalanceStatus');
                    // callback(true);
                }).catch(()=>{
                    dispatch('purseBalanceFailed', purse.purse);
                });
            });
        },
        purseBalanceFailed({rootState, state, dispatch}, purseId) {
            rootState.http.requests['purse.getBalance'].get({purseId: purseId}).then(response => {
                state.purseLoadedCount++;
                dispatch('addBalanceToPurse', {purseId: purseId, purseBalance: response.data.data});
            });
        },
        chanePurseBalanceStatus({state, rootState}){
            let pursesCount = state.user.purses.length;
            if (pursesCount === state.purseLoadedCount) {
                rootState.app.isLoaded = true;
            }
        },
        addBalanceToPurse({state, dispatch}, {purseId, purseBalance}) {
            let purseIndex = _.findIndex(state.user.purses, function (filterPurse) {
                return filterPurse.purse === purseId
            });
            state.user.purses[purseIndex].balance = purseBalance;
            dispatch('chanePurseBalanceStatus');
        }

    },
};
