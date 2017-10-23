export default {
    namespaced: true,
    state: {
        isLoaded: false,
        smallSidebar: false,
        showMobileSidebar: false,
        isTicketEmptyPage: false,
        webserviceCategories: [],
        ticketDepartments: [],
        visibleNotification: false,
        singlePurseMoreTrigger: null,
        singleWebserviceMoreTrigger: null,
        singleEasypayMoreTrigger: null,
        ticketSummary: {},
        refererId: null,
        selectedTab: 'dashboard',
        isOpenModal: false,
    },
    mutations: {
        loading(state) {
            state.isLoaded = false;
        },
        ready(state) {
            state.isLoaded = true;
        },
        toggleSidebar(state) {
            state.smallSidebar = !state.smallSidebar;
        },
        toggleMobileSidebar(state, condition) {
            if (condition) {
                state.showMobileSidebar = condition;
                return;
            }
            state.showMobileSidebar = !state.showMobileSidebar;
        },
        changeTicketState(state) {
            state.isTicketEmptyPage = !state.isTicketEmptyPage;
        },
        setWebserviceCategories(state, categories) {
            state.webserviceCategories = categories;
        },
        setTicketDepartments(state, categories){
            state.ticketDepartments = categories;
        },
        setRefererId(state, refId) {
            if (refId) {
                state.refererId = refId;
                return
            }
        },
        changeTabData(state, data) {
            state.selectedTab = data
        },
        changeModalStatus(state, status) {
            state.isOpenModal = status
        }
    },
    actions: {
        getWebserviceCategories({commit, rootState, state}) {
            if (state.webserviceCategories.length) {
                return;
            }
            rootState.http.requests['webservice.getWebserviceCategory'].get().then(
                (response) => {
                    commit('setWebserviceCategories', response.data.data);
                }
            );
        },
        getTicketDepartments({commit, rootState, state}) {
            if (state.ticketDepartments.length) {
                return;
            }
            rootState.http.requests['ticket.getTicketDepartment'].get().then(
                (response) => {
                    commit('setTicketDepartments', response.data.data);
                }
            );
        },
    }
};
