export default {
    state: {
        messages: [],
        validationErrors: [],
        notifications: [],
        counter: 1,

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
        clearValidationErrors(state, data) {
            state.validationErrors = [];
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
        addNotification(state, message){
            state.counter++;
            message.uuid = state.counter;
            state.notifications.unshift(message);
        },
        initNotifications(state) {
            state.notifications = [];
        }
    },
    actions: {
        startWebPushSocket({ dispatch, commit, state }){
            commit('initNotifications');
            let NchanSubscriber = require("nchan");

            let sub = new NchanSubscriber(
                'https://pubsub.zarinpal.com/notification',
                {
                    subscriber: 'websocket',
                    reconnect: 'persist',
                    shared: true
                }
            );

            sub.on('message', function (message) {
                message = JSON.parse(message);
                commit('addNotification', message);
                if (state.notifications) {
                    let notificationCount = state.notifications.length;
                    let lastMessageTitle = state.notifications[notificationCount-1].title;
                    let options = {
                        title: lastMessageTitle,
                        body: 'شما ' + notificationCount + ' پیام جدید دارید.',
                        icon: 'assets/images/zarin-logo.png',
                        sound: 'assets/sound/notification.mp3',
                        tag:'zarin-notify',
                    };

                    dispatch('sendBrowserNotification', options);
                }
            });

            sub.start();
        },
        sendBrowserNotification({rootState}, options){
            let notifier = (options)=>{
                let notification = new Notification(
                    options.title,
                    options
                );

                notification.onclick = function(event) {
                    rootState.app.visibleNotification = true;
                    parent.focus();
                    window.focus();
                    event.preventDefault(); // prevent the browser from focusing the Notification's ta
                    // window.open('https://api.zarinpal.dev/panelw/index.html/panel/home', '_blank');
                };
            };

            if (!("Notification" in window)) {
                return null;
            } else if (Notification.permission === "granted") {
                notifier(options);
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission(function (permission) {
                    if (permission === "granted") {
                        notifier(options);
                    }
                });
            }
        },
    }
};
