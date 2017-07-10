"use strict";
export default {
    namespaced: true,
    state: {
        vm: null,
        update: 0,
        paginator: {
            default : {
                data: [],
                resource: {
                    resource: {},
                    params: {}
                },
                isLoading: false,
            }
        },

    },
    mutations: {
        reset(state, requestName) {
            // if (!requestName) {
            //     requestName = 'default';
            // }
            //
            // if(state.paginator[requestName]) {
            //     state.paginator[requestName].data = [];
            // }
        },
        setVm(state, vm) {
            state.vm = vm;
        },
        initData(state, {resource, params, requestName}) {
            if (!requestName) {
                requestName = 'default';
            }

            state.paginator[requestName] = {
                data: [],
                resource: {
                    resource: resource,
                    params: params
                },
                isLoading: false,
            };
        },
        nextData(state, {resource, data, requestName}) {
            data.forEach(function(item){
                state.paginator[requestName].data.push(item);
                state.update++;
            });
            state.paginator[requestName].resource = {
                resource: resource
            };
        },
        changeLoading(state, {requestName, type}) {
            state.paginator[requestName].isLoading = type;
            state.update++;
        }
    },
    actions: {
        make ({commit, dispatch}, {vm, resource, params, requestName}) {
            commit('reset', requestName);
            commit('setVm', vm);
            commit('initData', {resource, params, requestName});
            dispatch('next', {requestName});
        },
        next ({commit, state}, {requestName}) {
            if(state.paginator[requestName].resource.resource){
                commit('changeLoading', {requestName, type:true});
                if (!requestName) {
                    requestName = 'default';
                }

                state.paginator[requestName].resource.resource.get(state.paginator[requestName].resource.params).then(
                    (response) => {
                        let resource = null;
                        if(response.data.meta.pagination.links.next){
                            resource = state.vm.$resource(response.data.meta.pagination.links.next);
                        }

                        commit('nextData', {resource, data:response.data.data, requestName});
                        commit('changeLoading', {requestName, type:false});
                    }
                ).catch((error) => {
                    console.log(error);
                    commit('changeLoading', {requestName, type:false});
                });
            }

        }
    }
};
