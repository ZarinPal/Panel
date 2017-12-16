export default {
    namespaced: true,
    state: {
        isLoaded: false,
        user: {
            name: 'کاربر تست',
            public_id: '123456',
            level: 2,
            purses: [
                {
                    balance: {
                        balance: 0,
                        today_income: 0,
                        today_outcome: 0,
                        total_to_exit: 0
                    },
                    name: 'اصلی زرین‌پال',
                    purse: 1,
                    visible: true
                },
                {
                    balance: {
                        balance: 0,
                        today_income: 0,
                        today_outcome: 0,
                        total_to_exit: 0
                    },
                    name: 'پیامک',
                    purse: 99,
                    visible: true
                },
            ]
        },
        check: false,
        isRequested: false,
        otpTime: 30, //As seconds
        purseLoadedCount: 0,
        getPurseLimit: 3,
        updatePurseListener: 0,
    },
    mutations: {
        fill(state, user) {
            user.avatar = 'https:' + user.avatar;
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
            state.isLoaded = false;
            state.purseLoadedCount = 0;
        },
        change(state, data) {
            state.user[data.name] = data.value;
        },
        updatePurseListener(state) {
            state.updatePurseListener++;
        }
    },
    actions: {
        fetch({commit, rootState, state, dispatch}, callback) {
            if (state.check) {
                rootState.app.isLoaded = true;
                callback(false);
                return;
            }

            rootState.http.requests['app.getBasicInfo'].get().then(
                (response) => {
                    dispatch('startWebPushSocket', {}, {root: true});
                    commit('fill', response.data.data);
                    dispatch('fetchPurseBalance');
                    // rootState.app.isLoaded = true;

                    if (!!this.$raven) {
                        this.$raven.setUserContext({
                            email: this.$store.state.auth.auth.email,
                            id: this.$store.state.auth.auth.public_id
                        });
                    }

                    callback(true);
                }
            ).catch((response) => {
                callback(false);
            });
        },
        fetchPurseBalance({rootState, state, dispatch, commit}) {
            state.user.purses.forEach(function (purse) {
                rootState.http.requests['purse.getBalance'].get({purseId: purse.purse}).then(response => {
                    state.purseLoadedCount++;
                    dispatch('addBalanceToPurse', {purseId: purse.purse, purseBalance: response.data.data});
                }).catch((response) => {
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
        addBalanceToPurse({state, dispatch, commit}, {purseId, purseBalance}) {
            let purseIndex = _.findIndex(state.user.purses, function (filterPurse) {
                return filterPurse.purse === purseId
            });
            state.user.purses[purseIndex].balance = purseBalance;
            state.user.purses[purseIndex].visible = true;
            dispatch('chanePurseBalanceStatus');
            commit('updatePurseListener');
        },
        chanePurseBalanceStatus({state, rootState, commit}) {
            let pursesCount = state.user.purses.length;
            if (pursesCount === state.purseLoadedCount) {
                rootState.app.isLoaded = true;
            }
            commit('updatePurseListener');
        },
        save({state, rootState}) {
            rootState.http.requests['profile'].update({
                mobile: state.user.mobile,
            }).catch((response) => {
                }
            );
        },
        logout({dispatch, commit, rootState}, vm) {
            rootState.http.requests['oauth.getLogout'].get().then(
                (response) => {
                    commit('app/changeLogOutStatus', null, { root: true });
                    commit('app/changeModalStatus', false, { root: true });
                    commit('empty');
                    dispatch('stopWebPushSocket', {}, {root: true});
                    vm.$router.push({name: 'auth.login'});
                }
            );
        },
    },
};