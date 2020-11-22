const idleHands = {
    start: function (userSettings) {
        this.settings = this.getSettings(userSettings);
        this.eventListener = this.reset.bind(this);

        this.storage.write(
            'startTime',
            (new Date).getTime()
        );

        this.addEventListeners(
            document,
            this.settings.activityEvents,
            this.eventListener
        );

        this.heartbeat.start(
            this.settings.heartbeatUrl,
            this.settings.heartbeatCallback,
            (this.settings.heartRate * 1000)
        );

        this.inactivity.start(
            this.settings.maxInactivitySeconds,
            this.settings.inactivityDialogDuration,
            this.dialog,
            this.settings.inactivityLogoutUrl
        );

        this.dialog.init(
            this.settings.manualLogoutUrl,
            this.reset.bind(this)
       );
    },
    initialDocumentTitle: document.title,
    eventListener: undefined,
    addEventListeners: function (target, types, listener) {
        types.split(' ').forEach(type => {
            target.addEventListener(type, listener);
        });
    },
    removeEventListeners: function (target, types, listener) {
        types.split(' ').forEach(type => {
            target.removeEventListener(type, listener);
        });
    },
    getSettings: function (userSettings) {
        const defaultSettings = {
            activityEvents: 'click keypress scroll wheel mousewheel',
            applicationId: 'idle-hands',
            dialogMessage: 'Your session is about to expire due to inactivity.',
            dialogTimeRemainingLabel: 'Time remaining',
            dialogTitle: 'Session Expiration Warning',
            documentTitle: null,
            heartbeatCallback: () => {},
            heartbeatUrl: window.location.href,
            heartRate: 300,
            inactivityLogoutUrl: 'https://www.google.com',
            inactivityDialogDuration: 45,
            localStoragePrefix: null,
            logoutNowButtonText: 'Logout Now',
            manualLogoutUrl: null,
            maxInactivitySeconds: 600,
            stayLoggedInButtonText: 'Stay Logged In'
        }

        let mergedSettings = Object.assign(defaultSettings, userSettings);

        mergedSettings.documentTitle = mergedSettings.documentTitle || mergedSettings.dialogTitle;
        mergedSettings.localStoragePrefix = mergedSettings.localStoragePrefix || mergedSettings.applicationId;
        mergedSettings.manualLogoutUrl = mergedSettings.manualLogoutUrl || mergedSettings.inactivityLogoutUrl;

        return mergedSettings;
    },
    heartbeat: {
        interval: undefined,
        start: function (heartbeatUrl, heartbeatCallback, heartRate) {
            this.interval = setInterval(this.pulse.bind(this, heartbeatUrl, heartbeatCallback), heartRate);
        },
        stop: function () {
            clearInterval(this.interval);
        },
        pulse: function (heartbeatUrl, heartbeatCallback) {
            fetch(heartbeatUrl).then(heartbeatCallback);
        }
    },
    storage: {
        write: function (cookieName, value, expiration) {
            let cookieContent = idleHands.settings.localStoragePrefix + '.' + cookieName + '=' + value + '; SameSite=Strict;';

            if (expiration) {
                cookieContent += 'expires=' . expiration;
            }

            document.cookie = cookieContent;
        },
        get: function (cookieName) {
            let cookies = document.cookie.split(' ');
            let fullyQualifiedCookieName = idleHands.settings.localStoragePrefix + '.' + cookieName;
            let cookieValue = false;

            cookies.forEach((cookie) => {
                pair = cookie.split('=');

                if (pair[0] == fullyQualifiedCookieName) {
                    cookieValue = pair[1];
                }
            });

            return cookieValue;
        },
        destroy: function (cookieName) {
            this.write(cookieName, '', ((new Date).getDate() - 1));
        }
    },
    inactivity: {
        interval: undefined,
        start: function (maxInactivitySeconds, inactivityDialogDuration, dialog, inactivityLogoutUrl) {
            this.interval = setInterval(this.check.bind(this, maxInactivitySeconds,  inactivityDialogDuration, dialog, inactivityLogoutUrl), 1000);
            idleHands.storage.write('startTime', (new Date).getTime());
        },
        stop: function () {
            clearInterval(this.interval);

            return this;
        },
        reset: function (maxInactivitySeconds, inactivityDialogDuration, dialog, inactivityLogoutUrl) {
            this.stop().start(maxInactivitySeconds, inactivityDialogDuration, dialog, inactivityLogoutUrl);
        },
        check: function (maxInactivitySeconds, inactivityDialogDuration, dialog, inactivityLogoutUrl) {
            let startTime = idleHands.storage.get('startTime');
            let inactivityTime = Math.floor(((new Date).getTime() - startTime) / 1000);

            if (!startTime || inactivityTime >= maxInactivitySeconds) {
                dialog.hide();
                this.stop().logout(inactivityLogoutUrl);
            } else if (inactivityTime >= (maxInactivitySeconds - inactivityDialogDuration)) {
                idleHands.removeEventListeners(
                    document,
                    idleHands.settings.activityEvents,
                    idleHands.eventListener
                );

                dialog.show();

                let secondsRemaining = (maxInactivitySeconds - inactivityTime);
                let secondsLabel = (secondsRemaining > 1) ? 'seconds' : 'second';

                document.querySelectorAll('#' + dialog.element.id + ' span')[0]
                    .innerHTML = '<b>' + idleHands.settings.dialogTimeRemainingLabel + '</b>: ' +
                        secondsRemaining + ' ' + secondsLabel;
            } else {
                dialog.hide();
            }
        },
        logout: function (logoutUrl) {
            idleHands.storage.destroy('startTime');
            window.location.href = logoutUrl;
        }
    },
    dialog: {
        init: function (manualLogoutUrl, resetCallback) {
            this.element.create();

            let links = document.querySelectorAll('#' + this.element.id + ' a');

            links[0].addEventListener('click', event => {
                event.stopPropagation();
                event.preventDefault();

                resetCallback();
            });

            links[1].addEventListener('click', event => {
                event.stopPropagation();
                event.preventDefault();

                idleHands.inactivity.logout(manualLogoutUrl);
            });
        },
        element: {
            id: 'idle-hands',
            create: function () {
                let dialogContainer = document.createElement('div');
                let container = document.createElement('div');
                let title = document.createElement('h1');
                let subtitle = document.createElement('h2');
                let span = document.createElement('span');
                let stayLoggedInAnchor = document.createElement('a');
                let logOutNowAnchor = document.createElement('a');

                container.id = this.id;
                container.style.display = 'none';
                container.style.position = 'absolute';
                container.style.width = '100%';
                container.style.height = '100%';

                dialogContainer.id = this.id + '-dialog';

                title.innerText = idleHands.settings.dialogTitle;

                subtitle.innerText = idleHands.settings.dialogMessage;

                stayLoggedInAnchor.href = '#';
                stayLoggedInAnchor.innerText = idleHands.settings.stayLoggedInButtonText;

                logOutNowAnchor.href = '#';
                logOutNowAnchor.innerText = 'Log out now';

                dialogContainer.appendChild(title);
                dialogContainer.appendChild(subtitle);
                dialogContainer.appendChild(span);
                dialogContainer.appendChild(stayLoggedInAnchor);
                dialogContainer.appendChild(logOutNowAnchor);

                container.appendChild(dialogContainer);

                document.getElementsByTagName('body')[0].appendChild(container);
            }
        },
        show: function () {
            document.getElementsByTagName('body')[0].style.overflow = 'hidden';
            document.title = idleHands.settings.documentTitle;
            document.getElementById(this.element.id).style.display = 'block';
        },
        hide: function () {
            document.title = idleHands.initialDocumentTitle;
            document.getElementById(this.element.id).style.display = 'none';
        }
    },
    reset: function () {
        this.storage.write(
            'startTime',
            (new Date).getTime()
        );

        this.addEventListeners(
            document,
            this.settings.activityEvents,
            this.eventListener
        );

        this.inactivity.reset(
            this.settings.maxInactivitySeconds,
            this.settings.inactivityDialogDuration,
            this.dialog,
            this.settings.inactivityLogoutUrl
        );

        this.dialog.hide();
    }
}