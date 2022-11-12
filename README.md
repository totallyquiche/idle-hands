# Idle Hands

Manage user inactivity across all browser windows with automatic redirect and
dialog prompt.

This is a zero-dependency, pure JavaScript rewrite of the
[jQuery Idle Hands plugin](https://github.com/totallyquiche/jquery-idle-hands).

## Basic Usage

```html
<script type="module">
    import idleHands from './idle-hands.js';

    idleHands.start();
</script>
```

### Advanced Usage

```html
<script type="module">
    import idleHands from './idle-hands.js';

    idleHands.start({
        applicationId: 'idle_hands',
        heartbeatUrl: 'https://abc.xyz/logout',
        manualLogOutUrl: 'https://abc.xyz/logout/?type=manual',
        automaticLogOutUrl: 'https://abc.xyz/logout/?type=automatic',
        maxInactivitySeconds: (60 * 60) // 1 hour,
    });
</script>
```

## Settings

|Name|Default Value|Description|
|---|---|--|
|`applicationId`|`window.location.hostname`|A unique identifier used to avoid conflicts with other sites using Idle Hands.|
|`automaticLogOutUrl`|`window.location.hostname`|The URL the user will be automatically redirected to when the `maximumIdleDuration` is reached.|
|`containerElement`|`body`|The HTML element the Idle Hands overlay is attached to.|
|`debug`|`false`|Indicates whether debug mode should be active, preventing redirects and instead logging activity to the console.|
|`dialogCountDownMessage`|`Time remaining: `|The text to display before the timer on the inactivity prompt|
|`dialogLogOutButtonText`|`Log Out Now`|The text to display on the inactivity prompt button that logs the user out.|
|`dialogMessage`|`Your session is about to expire due to inactivity.`|The message to display in the inactivity prompt.|
|`dialogStayLoggedInButtonText`|`Stay Logged In`|The text to display on the inactivity prompt button that keeps the user logged in.|
|`dialogTitle`|`Session Expiration Warning`|The text to display in th inactivity prompt header.|
|`documentTitle`|`Session Expiration Warning`|The text to display in the browser tab/window while the inactivity prompt is showing.|
|`eventListeners`|`['click', 'keypress', 'scroll', 'wheel', 'mousewheel']`|An array of JavaScript events which reset the inactivity timer.|
|`heartbeatInterval`|`(30 * 1000)` (30 seconds)|How often a `GET` request should be sent to the `heartbeatUrl`. This works is intended to keep the user logged into the application, allowing Idle Hands to handle logging out.|
|`heartbeatUrl`|`window.location.href`|A URL a `GET` request can be sent to in order to keep the user logged into the application.|
|`logOutUrl`|`null`|The URL which a user should be redirected to when Idle Hands logs them out. This overrides `automaticLogOutUrl` and `manualLogOutUrl`.|
|`loggingOutDocumentTitle`|`Logging Out...`|The text to display in the browser tab/window while Idle Hands is redirecting the user to the logout URL.|
|`manualLogOutUrl`|`window.location.href`|The URL the user will be redirected to when they click the log out button on the inactivity prompt.|
|`maximumIdleDuration`|`((60 * 1000) * 60)` (60 minutes)|How long a user is allowed to remain inactive before they are logged out. This includes the time the inactivity prompt is displayed.|
|`overlayZIndex`|`9999`|The `z-index` of the inactivity overlay. Increase this if other HTML elements appear on top of the overlay.|
|`promptDuration`|`(30 * 1000)` (30 seconds)|How long the inactivity prompt should be displayed before the user is logged out.|