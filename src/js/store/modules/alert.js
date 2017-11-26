export default {
    state: {
        messages: [],
        validationErrors: [],
        notifications: [],
        counter: 1,
        nchanSubscriber: null,
    },
    mutations: {
        setValidationErrors(state, validationErrors) {
            let errors = {};
            if (validationErrors) {
                validationErrors.forEach(function (error) {
                    errors[error.input] = {
                        rule: error.rule,
                        params: error.params
                    };
                    state.validationErrors = errors;
                });
            }
        },
        clearValidationErrors(state, data) {
            state.validationErrors = [];
        },
        flashMessage(state, message) {
            state.messages.push({
                text: message.text,
                type: (typeof message.type === 'undefined') ? 'info' : message.type,
                show: (typeof message.show === 'undefined') ? true : message.show,
                timeout: (typeof message.timeout === 'undefined') ? 3000 : message.timeout,
                important: (typeof message.important === 'undefined') ? false : message.important,
                remove() {
                    this.show = false;
                    state.messages = state.messages.filter(function (item) {
                        return item.show;
                    });
                },
                handleShowEvent() {
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
        addNotification(state, message) {
            state.counter++;
            message.uuid = state.counter;
            state.notifications.unshift(message);
        },
        setNotifications(state) {
            state.notifications = [];
        },
        initNchanSubscriber(state, subscriber) {
            state.nchanSubscriber = subscriber;
        }
    },
    actions: {
        startWebPushSocket({dispatch, commit, state}) {
            commit('setNotifications');
            let NchanSubscriber = require("nchan");

            commit(
                'initNchanSubscriber',
                new NchanSubscriber(
                    'https://pubsub.zarinpal.com/notification',
                    {
                        subscriber: 'websocket',
                        reconnect: 'persist',
                        shared: true
                    }
                )
            );

            state.nchanSubscriber.on('message', function (message) {
                message = JSON.parse(message);
                commit('addNotification', message);
                if (state.notifications) {
                    let notificationCount = state.notifications.length;
                    let lastMessageTitle = state.notifications[notificationCount - 1].title;
                    let options = {
                        title: lastMessageTitle,
                        body: 'شما ' + notificationCount + ' پیام جدید دارید.',
                        icon: 'assets/images/zarin-logo.png',
                        sound: 'assets/sound/notification.mp3',
                        tag: 'zarin-notify',
                    };

                    dispatch('sendBrowserNotification', options);
                }
            });

            state.nchanSubscriber.start();
        },
        stopWebPushSocket({state}) {
            state.nchanSubscriber.stop();
        },
        sendBrowserNotification({rootState}, options) {
            let notifier = (options) => {
                let notification = new Notification(
                    options.title,
                    options
                );

                notification.onclick = function (event) {
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
