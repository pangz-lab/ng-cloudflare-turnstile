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
If you want to see how each configuration works, you can visit the [ng-cloudflare-turnstile](https://pangz-lab.github.io/playground/ng-cloudflare-turnstile/) playground. Enjoy!