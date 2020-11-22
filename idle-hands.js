const idleHands = {
    start: function (userSettings) {
        document.addEventListener('click', this.reset.bind(this));

        this.settings = this.getSettings(userSettings);

        this.heartbeat.start(
            this.settings.heartbeatUrl,
            this.settings.heartbeatCallback,
            (this.settings.heartRate * 1000)
        );

        this.inactivity.start(
            this.settings.maxInactivitySeconds,
            this.settings.inactivityDialogDuration,
            this.dialog
        );

        this.dialog.init();
    },
    getSettings: function (userSettings) {
        const defaultSettings = {
            activityEvents: 'click keypress scroll wheel mousewheel mousemove',
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
    inactivity: {
        interval: undefined,
        startTime: undefined,
        start: function (maxInactivitySeconds, inactivityDialogDuration, dialog) {
            this.interval = setInterval(this.check.bind(this, maxInactivitySeconds,  inactivityDialogDuration, dialog), 1000);
            this.startTime = (new Date).getTime();
        },
        stop: function (callback) {
            clearInterval(this.interval, callback);
        },
        reset: function (maxInactivitySeconds, inactivityDialogDuration, dialog) {
            this.stop();
            this.start(maxInactivitySeconds, inactivityDialogDuration, dialog);
        },
        check: function (maxInactivitySeconds, inactivityDialogDuration, dialog) {
            let inactivityTime = Math.floor(((new Date).getTime() - this.startTime) / 1000);

            if (inactivityTime >= maxInactivitySeconds) {
                console.log('Redirecting');
                this.stop();
            } else if (inactivityTime >= inactivityDialogDuration) {
                dialog.show();

                dialogElement = document.getElementById(dialog.element.id);

                dialogElement.innerText = (maxInactivitySeconds - inactivityTime);
            } else {
                dialog.hide();
            }
        }
    },
    dialog: {
        init: function () {
            this.element.create();
        },
        element: {
            id: 'idle-hands-dialog',
            create: function () {
                let element = document.createElement('div');

                element.id = this.id;
                element.innerText = 'DIALOG WINDOW';
                element.style.display = 'none';

                document.getElementsByTagName('body')[0].append(element);
            }
        },
        show: function () {
            document.getElementById(this.element.id).style.display = 'block';
        },
        hide: function () {
            document.getElementById(this.element.id).style.display = 'none';
        }
    },
    logout: function () {
        console.log(this.settings.inactivityLogoutUrl);
    },
    reset: function () {
        this.inactivity.reset(
            this.settings.maxInactivitySeconds,
            this.settings.inactivityDialogDuration,
            this.dialog
        );

        this.dialog.hide();
    }
}