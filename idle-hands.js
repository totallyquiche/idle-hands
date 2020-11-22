const idleHands = {
    start: function (userSettings) {
        this.settings = this.getSettings(userSettings);

        this.heartbeat.start(
            this.settings.heartbeatUrl,
            this.settings.heartbeatCallback,
            (this.settings.heartRate * 1000)
        );

        this.inactivity.start();

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
        start: function () {
            this.interval = setInterval(this.check.bind(this), 1000);
        },
        stop: function () {
            clearInterval(this.interval);
        },
        reset: function () {
            this.stop();
            this.start();
        },
        check: function () {
            //
        }
    },
    storage: {
        setup: function () {

        },
        set: function () {

        },
        get: function () {

        },
        reset: function () {

        }
    },
    dialog: {
        init: function () {
            this.element.create();
            this.show();
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
    }
}