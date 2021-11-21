'use strict'

const idleHands = {
    config: null,
    defaultConfig: {
        maximumIdleDuration: ((60 * 1000) * 60),
        promptDuration: (30 * 1000),
        heartbeatInterval: ((60 * 1000) * 30),
        redirectUrl: window.location.href,
        heartbeatUrl: window.location.href,
        logOutUrl: window.location.href,
        containerElement: document.getElementsByTagName('body')[0],
        eventListeners: ['click', 'keypress', 'scroll', 'wheel', 'mousewheel'],
        documentTitle: 'Session Expiration Warning',
        dialogTitle: 'Session Expiration Warning',
        dialogMessage: 'Your session is about to expire due to inactivity.',
        dialogCountDownMessage: 'Time remaining: ',
        dialogStayLoggedInButtonText: 'Stay Logged In',
        dialogLogOutButtonText: 'Log Out Now',
        dialogZindex: 9999,
        debug: false,
    },
    originalDocumentTitle: null,
    event: null,
    tickInterval: null,
    heartbeatInterval: null,
    elements: {
        overlayContainerElement: null,
        dialogContainerElement: null,
        dialogCountDownElement: document.createElement('span'),
    },
    setStartTime: function () {
        localStorage.setItem('startTime', this.getCurrentTime());
    },
    getStartTime: () => localStorage.getItem('startTime'),
    getCurrentTime: () => (new Date).getTime(),
    getIdleTime: function () {
        return this.getCurrentTime() - this.getStartTime();
    },
    getTimeRemaining: function () {
        return this.config.maximumIdleDuration - this.getIdleTime();
    },
    start: function (config) {
        if (this.config === null) {
            this.config = {...this.defaultConfig, ...config};
        }

        this.event = this.reset.bind(this);
        this.addEventListeners();
        this.setStartTime();
        this.tick();

        if (this.tickInterval === null) {
            this.tickInterval = setInterval(
                this.tick.bind(this),
                1000
            );
        }

        if (this.heartbeatInterval === null) {
            this.heartbeatInterval = setInterval(
                this.heartbeat.bind(this),
                this.config.heartbeatInterval
            );
        }
    },
    stop: function (destroyOverlay = true) {
        this.removeEventListeners();

        if (this.elements.overlayContainerElement !== null) {
            destroyOverlay ? this.destroyOverlay() : this.destroyDialog();
        }

        clearInterval(this.tickInterval);
        this.tickInterval = null;

        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
    },
    reset: function () {
        this.stop();
        this.start();
    },
    logOut: function () {
        this.stop(false);
        this.redirect();
    },
    tick: function () {
        const remainingTime = this.getTimeRemaining();
        const remainingSeconds = Math.floor((remainingTime / 1000));
        const promptDurationSeconds = Math.floor((this.config.promptDuration / 1000));

        if (this.config.debug) {
            console.log('Remaining Seconds: ' + remainingSeconds);
        }

        this.elements.dialogCountDownElement.innerText = remainingSeconds + ' seconds';

        if (
            remainingSeconds < (promptDurationSeconds + 1) &&
            this.elements.overlayContainerElement === null
        ) {
            this.removeEventListeners();
            this.buildOverlay();
        }

        if (
            remainingSeconds > promptDurationSeconds &&
            this.elements.overlayContainerElement !== null
        ) {
            this.addEventListeners();
            this.destroyOverlay();
        }

        if (remainingSeconds <= 0) {
            this.logOut()
        }
    },
    addEventListeners: function () {
        this.config.eventListeners.forEach(eventListener => {
            document.addEventListener(
                eventListener,
                this.event
            );
        });
    },
    removeEventListeners: function () {
        this.config.eventListeners.forEach(eventListener => {
            document.removeEventListener(
                eventListener,
                this.event
            );
        });
    },
    buildOverlay: function () {
        this.originalDocumentTitle = document.title;

        document.title = this.config.documentTitle;

        this.elements.overlayContainerElement = document.createElement('div');
        this.elements.dialogContainerElement = document.createElement('div');
        this.elements.dialogTitleElement = document.createElement('h1');
        this.elements.dialogMessageElement = document.createElement('span');
        this.elements.dialogCountDownContainerElement = document.createElement('div');
        this.elements.dialogButtonsContainerElement = document.createElement('div');
        this.elements.dialogStayLoggedInButtonElement = document.createElement('button');
        this.elements.dialogLogOutButtonElement = document.createElement('button');

        // Reset styles
        Object.keys(this.elements).forEach(key => {
            if (this.elements[key].nodeName !== 'BUTTON') {
                this.elements[key].style.setProperty('padding', '0', 'important');
                this.elements[key].style.setProperty('margin', '0', 'important');
                this.elements[key].style.setProperty('lineHeight', '1', 'important');
                this.elements[key].style.setProperty('color', 'black', 'important');
                this.elements[key].style.setProperty('background', 'white', 'important');
                this.elements[key].style.setProperty('border', 'none', 'important');
                this.elements[key].style.setProperty('text-align', 'left', 'important');
                this.elements[key].style.setProperty('font-family', 'sans-serif', 'important');
                this.elements[key].style.setProperty('font-size', '1em', 'important');
                this.elements[key].style.setProperty('font-weight', '200', 'important');
            }
        });


        this.elements.overlayContainerElement.id = 'idle-hands-overlay-container';
        this.elements.overlayContainerElement.style.setProperty('width', '100%', 'important');
        this.elements.overlayContainerElement.style.setProperty('height', '100%', 'important');
        this.elements.overlayContainerElement.style.setProperty('position', 'absolute', 'important');
        this.elements.overlayContainerElement.style.setProperty('z-index', this.config.dialogZindex, 'important');
        this.elements.overlayContainerElement.style.setProperty('background', 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNksAcAAEUAQRtOwGEAAAAASUVORK5CYII=")', 'important');

        this.elements.dialogContainerElement.style.setProperty('min-width', '350px', 'important');
        this.elements.dialogContainerElement.style.setProperty('position', 'fixed', 'important');
        this.elements.dialogContainerElement.style.setProperty('top', '50%', 'important');
        this.elements.dialogContainerElement.style.setProperty('left', '50%', 'important');
        this.elements.dialogContainerElement.style.setProperty('transform', 'translate(-50%, -50%)', 'important');
        this.elements.dialogContainerElement.style.setProperty('padding', '4px', 'important');
        this.elements.dialogContainerElement.style.setProperty('background', 'white', 'important');
        this.elements.dialogContainerElement.style.setProperty('border-radius', '4px', 'important');
        this.elements.dialogContainerElement.style.setProperty('border', '1px solid black', 'important');
        this.elements.dialogContainerElement.style.setProperty('font-family', 'Roboto,Verdana,sans-serif', 'important');
        this.elements.dialogContainerElement.style.setProperty('line-height', '1.5', 'important');
        this.elements.dialogContainerElement.style.setProperty('color', '#333', 'important');

        this.elements.dialogTitleElement.innerText = this.config.dialogTitle;
        this.elements.dialogTitleElement.style.setProperty('color', 'white', 'important');
        this.elements.dialogTitleElement.style.setProperty('text-align', 'center', 'important');
        this.elements.dialogTitleElement.style.setProperty('background', '#1484c8', 'important');
        this.elements.dialogTitleElement.style.setProperty('border-radius', '4px', 'important');
        this.elements.dialogTitleElement.style.setProperty('padding', '4px', 'important');
        this.elements.dialogTitleElement.style.setProperty('margin', '4px', 'important');
        this.elements.dialogTitleElement.style.setProperty('font-size', '1.15em', 'important');
        this.elements.dialogTitleElement.style.setProperty('font-weight', '400', 'important');

        this.elements.dialogMessageElement.innerText = this.config.dialogMessage;
        this.elements.dialogMessageElement.style.setProperty('display', 'block', 'important');
        this.elements.dialogMessageElement.style.setProperty('margin', '14px', 'important');

        this.elements.dialogCountDownContainerElement.innerText = this.config.dialogCountDownMessage;
        this.elements.dialogCountDownContainerElement.style.setProperty('display', 'block', 'important');
        this.elements.dialogCountDownContainerElement.style.setProperty('margin', '14px', 'important');

        this.elements.dialogStayLoggedInButtonElement.innerText = this.config.dialogStayLoggedInButtonText;
        this.elements.dialogStayLoggedInButtonElement.addEventListener('click', () => this.reset());
        this.elements.dialogStayLoggedInButtonElement.style.setProperty('width', '40%', 'important');
        this.elements.dialogStayLoggedInButtonElement.style.setProperty('padding', '8px 0', 'important');
        this.elements.dialogStayLoggedInButtonElement.style.setProperty('margin', '10px', 'important');
        this.elements.dialogStayLoggedInButtonElement.style.setProperty('margin-left', '7%', 'important');

        this.elements.dialogLogOutButtonElement.innerText = this.config.dialogLogOutButtonText;
        this.elements.dialogLogOutButtonElement.addEventListener('click', () => this.logOut());
        this.elements.dialogLogOutButtonElement.style.setProperty('width', '40%', 'important');
        this.elements.dialogLogOutButtonElement.style.setProperty('padding', '8px 0', 'important');
        this.elements.dialogLogOutButtonElement.style.setProperty('margin', '10px', 'important');
        this.elements.dialogLogOutButtonElement.style.setProperty('margin-right', '7%', 'important');

        this.elements.dialogContainerElement.appendChild(this.elements.dialogTitleElement);
        this.elements.dialogContainerElement.appendChild(this.elements.dialogMessageElement);
        this.elements.dialogCountDownContainerElement.appendChild(this.elements.dialogCountDownElement);
        this.elements.dialogContainerElement.appendChild(this.elements.dialogCountDownContainerElement);
        this.elements.dialogContainerElement.appendChild(document.createElement('hr'));
        this.elements.dialogButtonsContainerElement.appendChild(this.elements.dialogStayLoggedInButtonElement);
        this.elements.dialogButtonsContainerElement.appendChild(this.elements.dialogLogOutButtonElement);
        this.elements.dialogContainerElement.appendChild(this.elements.dialogButtonsContainerElement);
        this.elements.overlayContainerElement.appendChild(this.elements.dialogContainerElement);

        this.config.containerElement.appendChild(this.elements.overlayContainerElement);

        this.elements.dialogStayLoggedInButtonElement.focus();
    },
    destroyOverlay: function () {
        document.title = this.originalDocumentTitle;

        this.config.containerElement.removeChild(this.elements.overlayContainerElement);
        this.elements.overlayContainerElement = null;
    },
    destroyDialog: function () {
        this.elements.overlayContainerElement.removeChild(this.elements.dialogContainerElement);
        this.elements.overlayContainerElement = null;
    },
    redirect: function () {
        this.config.debug ?
            console.log('Redirect: ' + this.config.redirectUrl) :
            window.location.replace(this.config.redirectUrl);
    },
    heartbeat: function () {
        this.config.debug ?
            console.log('Hearbeat: ' + this.config.heartbeatUrl) :
            fetch(this.config.heartbeatUrl);
    }
};