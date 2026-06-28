import { Component, EventEmitter, Output, type OnInit } from '@angular/core';
import { Appearance, Language, NgCloudflareTurnstile, Retry, Size, Theme, type Config, type Result } from '../../../ng-cloudflare-turnstile/src/public-api';

@Component({
    selector: 'app-captcha',
    standalone: true,
    imports: [NgCloudflareTurnstile],
    templateUrl: './captcha.component.html',
    styleUrl: './captcha.component.css'
})
export class CaptchaComponent implements OnInit {
    @Output() onVerified = new EventEmitter<boolean>();
    config: Config = {
        siteKey: '0x4AAAAAABA_YGuyNxowwA9W',
        language: Language.AUTO,
        theme: Theme.AUTO,
        size: Size.NORMAL,
        appearance: Appearance.ALWAYS,
        retry: Retry.AUTO,
        retryInterval: 8000,
        onSuccess: (_: Result): void => {
            console.log("CONF onSuccess");
            Verifier.emitter.emit(true);
        },
        onError: (_: Result): void => {
            console.log("CONF onError");
            Verifier.emitter.emit(false);
        },
        onExpired: (_: Result): void => {
            console.log("CONF onExpired");
            Verifier.emitter.emit(false);
        },
        onBeforeInteractive: (_: Result): void => { console.log("CONF onBeforeInteractive"); },
        onAfterInteractive: (_: Result): void => { console.log("CONF onAfterInteractive"); },
        onTimeout: (_: Result): void => {
            console.log("CONF onTimeout");
            Verifier.emitter.emit(false);
        },
        onCreate: (_: Result): void => { console.log("CONF onCreate"); },
        onReset: (_: Result): void => { console.log("CONF onReset"); },
        onRemove: (_: Result): void => { console.log("CONF onRemove"); },
    }

    eventHandler(d: Result) {}
    ngOnInit(): void {
        Verifier.init(this.onVerified);
    }
}

class Verifier {
    static emitter = new EventEmitter<boolean>();
    static init(em: EventEmitter<boolean>): void {
        Verifier.emitter = em;
    }
}
