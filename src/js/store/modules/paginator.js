"use strict";
export default {
    namespaced: true,
    state: {
        data:[],
        vm:null,
        resource:null,
        resourceData:null
    },
    mutations: {
        reset(state) {
            state.data = [];
        },
        fill(state, data) {
            data.forEach(function(item){
                state.data.push(item);
            });
        },
        setVm(state, vm) {
            state.vm = vm;
        },
        setResource(state, {resource, resourceData}) {
            state.resource = resource;
            state.resourceData = resourceData;
        }
    },
    actions: {
        make ({commit, dispatch}, {vm, resource, resourceData}) {
            commit('reset');
            commit('setVm', vm);
            commit('setResource', {resource, resourceData});
            dispatch('next');
        },
        next ({commit, state}) {
            if(state.resource){
                state.resource.get(state.resourceData).then(
                    (response) => {
                        commit('fill', response.data.data);
                        let resource = null;
                        if(response.data.meta.pagination.links.next){
                            resource = state.vm.$resource(response.data.meta.pagination.links.next);
                        }
                        commit('setResource', {resource});
                    }
                ).catch(() => {});
            }
        }
    }
};
