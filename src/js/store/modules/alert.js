export default {
    state: {
        messages: [],
        validationErrors: [],
        notifications: [],
    },
    mutations: {
        setValidationErrors(state, validationErrors) {
            let errors = {};
            if (validationErrors) {
                validationErrors.forEach(function (error) {
                    errors[error.input] = error.translation_key;
                    state.validationErrors = errors;
                });
            }
        },
        flashMessage(state, message){
            state.messages.push({
                text: message.text,
                type: (typeof message.type === 'undefined') ? 'info' : message.type,
                show: (typeof message.show === 'undefined') ? true : message.show,
                timeout: (typeof message.timeout === 'undefined') ? 3000 : message.timeout,
                important: (typeof message.important === 'undefined') ? false : message.important,
                remove(){
                    this.show = false;
                    state.messages = state.messages.filter(function (item) {
                        return item.show;
                    });
                },
                handleShowEvent(){
                    {
                        if (!this.important) {
                            setTimeout(
                                () => this.remove(),
                                this.timeout
                            )
                        }
                    }
                }
            });

            if (state.messages.length > 3) {
                state.messages.shift();
            }
        },
        addNotification({state}, message){
            state.notifications.unshift(message);
        }
    },
    actions: {
        startWebPushWorker({commit}){
            let NchanSubscriber = require("nchan");

            let sub = new NchanSubscriber(
                'https://pubsub.zarinpal.com/notification',
                {
                    subscriber: 'websocket',
                }
            );

            sub.on('message', function (message) {
                // postMessage(JSON.parse(message));
                commit('addNotification', message);
                let options = {
                    title: message,
                    body: message
                };
                // new Notification(options.title, options);
                alert(options.title);

            });

            sub.start();

        }
    }
};