# ng-cloudflare-turnstile

An intuitive, lightweight and easy to integrate captcha component for Angular.

## Install
```bash
npm i @pangz/ng-cloudflare-turnstile
```

## Usage
After installation you can simply include the needed types and classes to your Angular project.

### 1. Add the header classes
In the logic class (i.e.)`example.component.ts`, include the following.
```ts
import {
    NgCloudflareTurnstileComponent,
    Config,
    Result
} from 'ng-cloudflare-turnstile';

@Component({
    ...
    imports: [NgCloudflareTurnstileComponent],
    ...
})
```
### 2. Configure the widget
Add the widget configuration and the event listener method.
```ts
export class ExampleComponent {
    config: Config = {
        siteKey: XXXXXXXXXXXXXXXXXXXXXXXXXXX,
    }

    //Name can be anything. Make sure the parameter is of the correct type.
    eventHandler(d: Result): void { console.log(d); }
}
```
You need to get your own `siteKey` from the cloudflare dashboard.<br>
Alternatively, you can use the library-provided test `siteKey`s if you don't have one yet.<br>
Note that these are test keys especially used for development only.
( Make sure to get your own when you decide to put it in production. )
```ts
- DevSiteKey.ALWAYS_PASSES
- DevSiteKey.ALWAYS_BLOCKS
- DevSiteKey.ALWAYS_PASSES_INVISIBLE
- DevSiteKey.ALWAYS_BLOCKS_INVISIBLE
- DevSiteKey.FORCE_INTERACTIVE_CHALLENGE
```
### 3. Include the component
In the view file (i.e.)`example.component.html`, include the turnstile component.
```html
<ng-cloudflare-turnstile [config]="config" (event)="eventHandler($event)"></ng-cloudflare-turnstile>
```
That's all you need to have a working turnstile.

<br>
<br>

# Customization
Cloudflare turnstile offers various [configuration options](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/) to match your needs.<br>
The following are the configurations and library-provided classes you can use to customize the behavior of your widget.
```ts
{
    siteKey: '',
    action: '',
    cData: '',
    tabIndex: 0,
    language: Language.AUTO,
    theme: Theme.AUTO,
    size: Size.NORMAL,
    appearance: Appearance.ALWAYS,
    retry: Retry.AUTO,
    retryInterval: 8000,
    refreshExpired: RefreshExpiry.AUTO,
    refreshTimeout: RefreshTimeout.AUTO,
    responseField: true,
    feedbackEnabled: true,
    onSuccess: (_: Result): void => {},
    onError: (_: Result): void => {},
    onExpired: (_: Result): void => {},
    onBeforeInteractive: (_: Result): void => {},
    onAfterInteractive: (_: Result): void => {},
    onTimeout: (_: Result): void => {},
    onCreated: (_: Result): void => {},
    onReset: (_: Result): void => {},
    onRemoved: (_: Result): void => {},
};
```


# Listening to events
You might wanna do something when a particular event is triggered.<br>
One way to do it is checking each state and add the logic designed for each state.
```ts
eventHandler(d: Result): void {
    console.log(d);
    switch (d.result) {
        case State.WIDGET_CREATED: console.log("WIDGET_CREATED");break;
        case State.WIDGET_RESET: console.log("WIDGET_RESET"); break;
        case State.WIDGET_REMOVED: console.log("WIDGET_REMOVED"); break;
        case State.SUCCESS: console.log("SUCCESS"); break;
        case State.BEFORE_INTERACTIVE: console.log("BEFORE_INTERACTIVE"); break;
        case State.AFTER_INTERACTIVE: console.log("AFTER_INTERACTIVE"); break;
        case State.ERROR: console.log("ERROR"); break;
        case State.EXPIRED: console.log("EXPIRED"); break;
        case State.TIMEOUT: console.log("TIMEOUT"); break;
        default: console.log("Unknown event");
    }
}
```
Apart from the `eventHandler`, the configuration allows you to add logic to specific events using callbacks.<br>
Config callback can be used for cases where you need to isolate your logic or want to make it more organize.<br>
Each callback is described in the following.<br>
( Detailed information can be found [here](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/). )

|Built-in Callback            | Config Callback            | States                     |
|:---                         | :---                       | :---                       |
|`callback`                   | `onSuccess`                | `State.SUCCESS`            |
|`error-callback`	          | `onError`                  | `State.ERROR`              |
|`expired-callback`	          | `onExpired`                | `State.EXPIRED`            |
|`before-interactive-callback`| `onBeforeInteractive`      | `State.BEFORE_INTERACTIVE` |
|`after-interactive-callback` | `onAfterInteractive`       | `State.AFTER_INTERACTIVE`  |
|`timeout-callback`           | `onTimeout`                | `State.TIMEOUT`            |

Built-in callbacks might be enough for your need but library-level-callbacks are provided to give you better flexibility.

| Built-in Callback | Config Callback  |  States                    | Call Timing                         |
| :---              | :---             | :---                       | :---                                |
| `-`               | `onCreated`      | `State.WIDGET_CREATED`     | After the `render` method is called |
| `-`               | `onReset`        | `State.WIDGET_RESET`       | After the `reset` method is called  |
| `-`               | `onRemoved`      | `State.WIDGET_REMOVED`     | After the `remove` methid is called |

Some configuration enables manual rendering so you might find these extra library-level-callback useful for such cases.

# Utility Classes
Complete list of classes and types you can use.
```ts
import {
    NgCloudflareTurnstileComponent,
    Config,
    Result,
    DevSiteKey,
    Language,
    Theme,
    Size,
    Appearance,
    Retry,
    RefreshExpiry,
    RefreshTimeout,
    State,
    TurnstileManager
} from 'ng-cloudflare-turnstile';
```


# Turnstile Playground
You can visit the [ng-cloudflare-turnstile playground](https://pangz-lab.github.io/playground/ng-cloudflare-turnstile/) to try how each configuration works.
 ([source](https://github.com/pangz-lab/ng-cloudflare-turnstile/tree/main/projects/ng-cloudflare-turnstile-demo))<br><br>
<a href="https://raw.githubusercontent.com/pangz-lab/ng-cloudflare-turnstile/refs/heads/main/playground.png">
    <img src="https://raw.githubusercontent.com/pangz-lab/ng-cloudflare-turnstile/refs/heads/main/playground.png">
</a>
<br>
<br>
<br>

# Reference
- ***Client Configuration*** : https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
- ***Error Codes*** : https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/error-codes/
- ***Cloudflare Repo*** :  https://github.com/cloudflare

# Support Us
Creating and maintaining a high-quality library is a labor of love that takes countless hours of coding, debugging, and community interaction. If this library has made your development easier, saved you time, or added value to your projects, consider supporting its ongoing growth and maintenance. Your contributions directly help keep this project alive, up-to-date, and evolving.

Every donation, no matter the size, goes a long way in motivating the developer to dedicate time and energy to improving the library. With your support, We can continue fixing bugs, adding new features, and providing documentation and support for the community. By donating, you’re not just saying “thank you” for the work done so far—you’re investing in the library's future and helping it remain a reliable tool for developers worldwide.

Let’s make this library even better, together! Consider donating to show your appreciation and ensure the continued development of this project. Your generosity fuels innovation and sustains the open-source ecosystem we all benefit from. Thank you for your support! 🍻

### Buy me a Beer
<a href="https://buymeacoffee.com/pangzlab">
<img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWtycDlxNjJ1MHUwbzY2MHI2ZmFxd3hwZDhqNHAyaDdlNXZubGtlMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/hXMGQqJFlIQMOjpsKC/giphy.webp"
width="100" height="auto">
</a>

### Donation Address
***Verus ID*** : 
pangz@
<br>
***VRSC*** : 
RNrhRTq8ioDTrANrm52c9MfFyPKr3cmhBj

***vARRR*** : 
RWCNjDd2HNRbJMdsYxN8ZDqyrS9fYNANaR

***vDEX*** : 
RWCNjDd2HNRbJMdsYxN8ZDqyrS9fYNANaR

***KMD*** : 
RWCNjDd2HNRbJMdsYxN8ZDqyrS9fYNANaR

***BTC*** : 
3MsmELpB8bsYvFJCYKrUpMuoBATVR5eeta

***ETH*** : 
0xa248d188725c3b78af7e7e8cf4cfb8469e46cf3b


# License
This library is released under the [MIT License](https://github.com/pangz-lab/ng-cloudflare-turnstile/blob/main/LICENSE).
