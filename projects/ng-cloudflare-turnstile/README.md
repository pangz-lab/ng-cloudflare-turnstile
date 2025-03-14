# ng-cloudflare-turnstile

<!-- This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.0. -->
An intuitive, lightweight and easy to use cloudflare turnstile component for Angular.

## Install
`npm i @pangz/ng-cloudflare-turnstile`

## Usage
After installation you can simply include the needed types and classes to your Angular project

### 1. Add the header classes
From your logic class (i.e.)`example.component.ts`, include the following
```ts
import {
    NgCloudflareTurnstileComponent,
    Config,
    Result
} from 'ng-cloudflare-turnstile';

@Component({
    selector: 'example',
    standalone: true,
    imports: [NgCloudflareTurnstileComponent],
    templateUrl: './example.component.html',
    styleUrl: './example.component.css'
})
```
### 2. Configure the widget
Add the widget configuration and the event listener method. You need to get your own `siteKey` from the cloudflare dashboard
```ts
export class ExampleComponent {
    config: Config = {
        siteKey: XXXXXXXXXXXXXXXXXXXXXXXXXXX,
    }

    //The name can be anything but make sure the parameter is correct.
    eventHandler(d: Result): void { console.log(d); }
}
```
Alternatively, you can use the library provided test `siteKey`s if you don't have one yet.
( Make sure to get your own once you've decided to put it in production ).
```ts
- DevSiteKey.ALWAYS_PASSES
- DevSiteKey.ALWAYS_BLOCKS
- DevSiteKey.ALWAYS_PASSES_INVISIBLE
- DevSiteKey.ALWAYS_BLOCKS_INVISIBLE
- DevSiteKey.FORCE_INTERACTIVE_CHALLENGE
```
### 3. Include the component
From your view file (i.e.)`example.component.html`, include the turnstile component
```html
<ng-cloudflare-turnstile [config]="config" (event)="eventHandler($event)"></ng-cloudflare-turnstile>
```
That's all you need to have a working cloudflare turnstile component.

## Customization
Cloudlfare turnstile offers several [configuration options](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/) to match your needs.<br>
The following are the configurations and the library-provided classes you can use to change the behavior of your widget.
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
};
```


### Listening to events
You might want to do something if a particular event is triggered.
One way to do it is this.
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


### Utility Classes
Complete list of classes you can import.
```ts
import {
    NgCloudflareTurnstileComponent,
    Config,
    Appearance,
    DevSiteKey,
    RefreshExpiry,
    RefreshTimeout,
    Retry,
    Size,
    Theme,
    Result,
    Language,
    State,
    TurnstileManager
} from 'ng-cloudflare-turnstile';
```


## Turnstile Playground
You can visit the [ng-cloudflare-turnstile playground](https://pangz-lab.github.io/playground/ng-cloudflare-turnstile/) to experience how each configuration works.
 ([Source Code](https://github.com/pangz-lab/ng-cloudflare-turnstile/tree/main/projects/ng-cloudflare-turnstile-demo))<br><br>
<img src="https://raw.githubusercontent.com/pangz-lab/ng-cloudflare-turnstile/refs/heads/main/playground.png">

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
