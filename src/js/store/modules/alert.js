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
        addNotification(state, message){
            state.notifications.unshift(message);
        }
    },
    actions: {
        startWebPushSocket({ dispatch, commit, state }){
            let NchanSubscriber = require("nchan");

            let sub = new NchanSubscriber(
                'https://pubsub.zarinpal.com/notification',
                {
                    subscriber: 'websocket',
                }
            );


            sub.on('message', function (message) {
                message = JSON.parse(message);
                commit('addNotification', message);
                let notificationCount = state.notifications.length;
                let lastMessageTitle = state.notifications[notificationCount-1].title;
                let options = {
                    title: lastMessageTitle,
                    body: 'شما ' + notificationCount + ' پیام جدید دارید.',
                    icon: 'assets/img/zarin-logo.png',
                    sound: 'assets/sound/notification.mp3',
                    tag:'zarin-notify',
                };

                dispatch('sendBrowserNotification',options);
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
                    event.preventDefault(); // prevent the browser from focusing the Notification's ta
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
        }

    }
};