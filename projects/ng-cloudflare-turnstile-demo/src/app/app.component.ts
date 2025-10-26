import { ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Appearance, DevSiteKey, Language, NgCloudflareTurnstile, RefreshExpiry, RefreshTimeout, Retry, Size, State, Theme, type Config, type Result, type TurnstileManager } from '../../../ng-cloudflare-turnstile/src/public-api';
import { CaptchaComponent } from "../captcha/captcha.component";
import { ClipboardComponent } from "../clipboard/clipboard.component";
import { LibLabelComponent } from "../lib-label/lib-label.component";
import { LibTitleComponent } from "../lib-title/lib-title.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [NgCloudflareTurnstile, ReactiveFormsModule, FormsModule, CaptchaComponent, LibLabelComponent, LibTitleComponent, ClipboardComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
    constructor(private cdr: ChangeDetectorRef) {}
    readonly viewConfig = {
        siteKey: { l: TurnstileViewElements.siteKey, default: DevSiteKey.FORCE_INTERACTIVE_CHALLENGE, raw: 'FORCE_INTERACTIVE_CHALLENGE'},
        language: { l: TurnstileViewElements.language, default: Language.ENGLISH, raw: 'ENGLISH'},
        theme: { l: TurnstileViewElements.theme, default: Theme.AUTO, raw: 'AUTO'},
        size: { l: TurnstileViewElements.size, default: Size.NORMAL, raw: 'NORMAL'},
        appearance: { l: TurnstileViewElements.appearance, default: Appearance.ALWAYS, raw: 'ALWAYS'},
        retry: { l: TurnstileViewElements.retry, default: Retry.AUTO, raw: 'AUTO'},
        refreshExpiry: { l: TurnstileViewElements.refreshExpiry, default: RefreshExpiry.AUTO, raw: 'AUTO'},
        refreshTimeout: { l: TurnstileViewElements.refreshTimeout, default: RefreshTimeout.AUTO, raw: 'AUTO'},
    }

    config: Config = {
        siteKey: this.viewConfig.siteKey.default,
        language: this.viewConfig.language.default,
        theme: this.viewConfig.theme.default,
        size: this.viewConfig.size.default,
        appearance: this.viewConfig.appearance.default,
        retry: this.viewConfig.retry.default,
        retryInterval: 8000,
        refreshExpired: this.viewConfig.refreshExpiry.default,
        refreshTimeout: this.viewConfig.refreshTimeout.default,
        action: '',
        cData: '',
        tabIndex: 0,
        responseField: true,
        feedbackEnabled: true,
        onSuccess: (_: Result): void => { console.log("CONF onSuccess");},
        onError: (_: Result): void => { console.log("CONF onError");},
        onExpired: (_: Result): void => { console.log("CONF onExpired");},
        onBeforeInteractive: (_: Result): void => { console.log("CONF onBeforeInteractive");},
        onAfterInteractive: (_: Result): void => { console.log("CONF onAfterInteractive");},
        onTimeout: (_: Result): void => { console.log("CONF onTimeout");},
        onCreate: (_: Result): void => { console.log("CONF onCreate");},
        onReset: (_: Result): void => { console.log("CONF onReset");},
        onRemove: (_: Result): void => { console.log("CONF onRemove");},
    }

    inSiteKey = new FormControl(this.config.siteKey);
    inLanguage = new FormControl(this.viewConfig.language.raw);
    inTheme = new FormControl(this.viewConfig.theme.raw);
    inSize = new FormControl(this.viewConfig.size.raw);
    inAppearance = new FormControl(this.viewConfig.appearance.raw);
    inRetry = new FormControl(this.viewConfig.retry.raw);
    inRetryInterval = new FormControl(this.config.retryInterval?.toString() ?? '');
    inRefreshExpiry = new FormControl(this.viewConfig.refreshExpiry.raw);
    inRefreshTimeout = new FormControl(this.viewConfig.refreshTimeout.raw);
    inAction = new FormControl(this.config.action ?? '');
    inCData = new FormControl(this.config.cData ?? '');
    inTabIndex = new FormControl(this.config.tabIndex?.toString() ?? '');
    inResponseField = new FormControl(this.config.responseField ?? true);
    inFeedbackEnabled = new FormControl(this.config.feedbackEnabled ?? true);
    inEventLogger = new FormControl('');
    inPayloadLogger = new FormControl('');

    configChanges = {
        name: '',
        from: '',
        to: '' ,
        conf: this.convertJsonConfigToObject(this.config)
    };
    ngOnInit(): void {
        EventLogger.init(this.inEventLogger, this.inPayloadLogger);
        this.initSubscription();
    }

    isVerified = false;
    onVerified(r: boolean): void {
        this.isVerified = true;
        this.cdr.detectChanges();
    }

    eventHandler(d: Result): void {
        console.log(d);
        EventLogger.savePayload(JSON.stringify({name: d.name, data: d.data, result: d.result}, null, 2));
        switch (d.result) {
            case State.WIDGET_CREATED: 
                EventLogger.log("WIDGET_CREATED");
                Turnstile.init(d.manager, d.data);
                break;
            case State.WIDGET_RESET: EventLogger.log("WIDGET_RESET"); break;
            case State.WIDGET_REMOVED: EventLogger.log("WIDGET_REMOVED"); break;
            case State.SUCCESS: EventLogger.log("SUCCESS"); break;
            case State.BEFORE_INTERACTIVE: EventLogger.log("BEFORE_INTERACTIVE"); break;
            case State.AFTER_INTERACTIVE: EventLogger.log("AFTER_INTERACTIVE"); break;
            case State.ERROR: EventLogger.log("ERROR"); break;
            case State.EXPIRED: EventLogger.log("EXPIRED"); break;
            case State.TIMEOUT: EventLogger.log("TIMEOUT"); break;
            default: EventLogger.log("Unknown event");
        }
    }

    private logConfigUpdate(name: string, from: string, to: string, conf: Config): void {
        this.configChanges = {name: name, from: from, to: to, conf: this.convertJsonConfigToObject(conf)};
        this.cdr.detectChanges();
    }

    private convertJsonConfigToObject(conf: Config): string {
        const formattedConf = JSON.stringify(conf, null, 2);
        return formattedConf.replace(/"([^"]+)":/g, '$1:');
    }
    
    private initSubscription(): void {
        
        this.inSiteKey.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}
            
            const oldValue = this.config.siteKey;
            const newValue = value ?? '';
            this.config.siteKey = newValue;
            this.logConfigUpdate('siteKey', oldValue, newValue, this.config);
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inLanguage.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}
            
            const oldValue = this.config.language;
            const newValue = TurnstileViewElements.getLanguageFromKey(value as keyof typeof Language);;
            this.config.language = newValue;
            this.logConfigUpdate('language', (oldValue ?? '').toString(), newValue, this.config);
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inTheme.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}
            
            const oldValue = this.config.theme;
            const newValue = TurnstileViewElements.getThemeFromKey(value as keyof typeof Theme);
            this.config.theme = newValue;
            this.logConfigUpdate('theme', (oldValue ?? '').toString(), newValue, this.config);
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inSize.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}
            
            const oldValue = this.config.size;
            const newValue = TurnstileViewElements.getSizeFromKey(value as keyof typeof Size);
            this.config.size = newValue;
            this.logConfigUpdate('size', (oldValue ?? '').toString(), newValue, this.config);
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inAppearance.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}
            
            const oldValue = this.config.appearance;
            const newValue = TurnstileViewElements.getAppearanceFromKey(value as keyof typeof Appearance);
            this.config.appearance = newValue;
            this.logConfigUpdate('appearance', (oldValue ?? '').toString(), newValue, this.config);
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inRetry.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}
            
            const oldValue = this.config.retry;
            const newValue = TurnstileViewElements.getRetryFromKey(value as keyof typeof Retry);
            this.config.retry = newValue;
            this.logConfigUpdate('retry', (oldValue ?? '').toString(), newValue, this.config);
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inRetryInterval.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}

            const oldValue = this.config.retryInterval;
            const newValue = parseInt(value?.toString() ?? '0');
            this.config.retryInterval = newValue;
            this.logConfigUpdate('retryInterval', (oldValue ?? '').toString(), newValue.toString(), this.config);
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inRefreshExpiry.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}
            
            const oldValue = this.config.refreshExpired;
            const newValue = TurnstileViewElements.getRefreshExpiryFromKey(value as keyof typeof RefreshExpiry);
            this.config.refreshExpired = newValue;
            this.logConfigUpdate('refreshExpired', (oldValue ?? '').toString(), newValue, this.config);
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inRefreshTimeout.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}
            
            const oldValue = this.config.refreshTimeout;
            const newValue = TurnstileViewElements.getRefreshTimeoutFromKey(value as keyof typeof RefreshTimeout);
            this.config.refreshTimeout = newValue;
            this.logConfigUpdate('refreshTimeout', (oldValue ?? '').toString(), newValue, this.config);
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inAction.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}

            const oldValue = this.config.action;
            const newValue = value ?? '';
            this.config.action = newValue;
            this.logConfigUpdate('action', (oldValue ?? '').toString(), newValue, this.config);
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inCData.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}

            const oldValue = this.config.cData;
            const newValue = value ?? '';
            this.config.cData = newValue
            this.logConfigUpdate('cData', (oldValue ?? '').toString(), newValue, this.config);
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inTabIndex.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}

            const oldValue = this.config.tabIndex;
            const newValue = parseInt(value?.toString() ?? '0');
            this.config.tabIndex = newValue;
            this.logConfigUpdate('tabIndex', (oldValue ?? '').toString(), newValue.toString(), this.config);
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inResponseField.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}

            const oldValue = this.config.responseField;
            const newValue = value === true;
            this.config.responseField = newValue;
            this.logConfigUpdate('responseField', (oldValue ?? '').toString(), newValue.toString(), this.config);
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inFeedbackEnabled.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}

            const oldValue = this.config.feedbackEnabled;
            const newValue = value === true;
            this.config.feedbackEnabled = newValue;
            this.logConfigUpdate('feedbackEnabled', (oldValue ?? '').toString(), newValue.toString(), this.config);
            Turnstile.manager!.reRender(this.config);
        });
    }
}

class Turnstile {
    private static widgetId: string;
    private static tm: TurnstileManager | undefined;
    static init(tm: TurnstileManager, id: string): void {
        Turnstile.tm = tm;
        Turnstile.widgetId = id;
    }

    static get manager(): TurnstileManager | undefined {
        return Turnstile.tm;
    }
    
    static get id(): string | undefined {
        return Turnstile.widgetId;
    }
}
class EventLogger {
    private static el: FormControl;
    private static pl: FormControl;
    private static readonly maxPayload = 50;
    private static payload: string[] = [];
    static init(el: FormControl, pl: FormControl): void {
        EventLogger.el = el;
        EventLogger.pl = pl;
    }

    static log(value: string): void {
        const v = EventLogger.el.value;
        EventLogger.el.setValue(value + '\n' + v);
    }
    
    static savePayload(value: string): void {
        EventLogger.payload.unshift(value);
        if(EventLogger.payload[EventLogger.maxPayload] !== undefined) {
            delete EventLogger.payload[EventLogger.maxPayload];
        }
        EventLogger.pl.setValue(EventLogger.payload.join('\n'));
    }
}
class TurnstileViewElements {
    static readonly siteKey = [
        { name: 'DevSiteKey.ALWAYS_PASSES', value: DevSiteKey.ALWAYS_PASSES },
        { name: 'DevSiteKey.ALWAYS_PASSES_INVISIBLE', value: DevSiteKey.ALWAYS_PASSES_INVISIBLE },
        { name: 'DevSiteKey.ALWAYS_BLOCKS', value: DevSiteKey.ALWAYS_BLOCKS },
        { name: 'DevSiteKey.ALWAYS_BLOCKS_INVISIBLE', value: DevSiteKey.ALWAYS_BLOCKS_INVISIBLE },
        { name: 'DevSiteKey.FORCE_INTERACTIVE_CHALLENGE', value: DevSiteKey.FORCE_INTERACTIVE_CHALLENGE },
    ];

    static readonly theme = [
        { name: 'Theme.LIGHT', value: 'LIGHT' },
        { name: 'Theme.DARK', value: 'DARK' },
        { name: 'Theme.AUTO', value: 'AUTO' },
    ];
    
    static readonly size = [
        { name: 'Size.NORMAL', value: 'NORMAL' },
        { name: 'Size.FLEXIBLE', value: 'FLEXIBLE' },
        { name: 'Size.COMPACT', value: 'COMPACT' },
    ];
    
    static readonly appearance = [
        { name: 'Appearance.ALWAYS', value: 'ALWAYS' },
        { name: 'Appearance.EXECUTE', value: 'EXECUTE' },
        { name: 'Appearance.INTERACTION_ONLY', value: 'INTERACTION_ONLY' },
    ];

    static readonly retry = [
        { name: 'Retry.AUTO', value: 'AUTO' },
        { name: 'Retry.NEVER', value: 'NEVER' },
    ]
    
    ;static readonly refreshExpiry = [
        { name: 'RefreshExpiry.AUTO', value: 'AUTO' },
        { name: 'RefreshExpiry.MANUAL', value: 'MANUAL' },
        { name: 'RefreshExpiry.NEVER', value: 'NEVER' },
    ];
    
    static readonly refreshTimeout = [
        { name: 'RefreshTimeout.AUTO', value: 'AUTO' },
        { name: 'RefreshTimeout.MANUAL', value: 'MANUAL' },
        { name: 'RefreshTimeout.NEVER', value: 'NEVER' },
    ];
    static readonly language = [
        { name: 'Language.AUTO', value: 'AUTO' },
        { name: 'Language.ARABIC', value: 'ARABIC' },
        { name: 'Language.BULGARIAN', value: 'BULGARIAN' },
        { name: 'Language.CHINESE_SIMPLIFIED', value: 'CHINESE_SIMPLIFIED' },
        { name: 'Language.CHINESE_TRADITIONAL', value: 'CHINESE_TRADITIONAL' },
        { name: 'Language.CROATIAN', value: 'CROATIAN' },
        { name: 'Language.CZECH', value: 'CZECH' },
        { name: 'Language.DANISH', value: 'DANISH' },
        { name: 'Language.DUTCH', value: 'DUTCH' },
        { name: 'Language.ENGLISH', value: 'ENGLISH' },
        { name: 'Language.FARSI', value: 'FARSI' },
        { name: 'Language.FINNISH', value: 'FINNISH' },
        { name: 'Language.FRENCH', value: 'FRENCH' },
        { name: 'Language.GERMAN', value: 'GERMAN' },
        { name: 'Language.GREEK', value: 'GREEK' },
        { name: 'Language.HEBREW', value: 'HEBREW' },
        { name: 'Language.HINDI', value: 'HINDI' },
        { name: 'Language.HUNGARIAN', value: 'HUNGARIAN' },
        { name: 'Language.INDONESIAN', value: 'INDONESIAN' },
        { name: 'Language.ITALIAN', value: 'ITALIAN' },
        { name: 'Language.JAPANESE', value: 'JAPANESE' },
        { name: 'Language.KLINGON', value: 'KLINGON' },
        { name: 'Language.KOREAN', value: 'KOREAN' },
        { name: 'Language.LITHUANIAN', value: 'LITHUANIAN' },
        { name: 'Language.MALAY', value: 'MALAY' },
        { name: 'Language.NORWEGIAN', value: 'NORWEGIAN' },
        { name: 'Language.POLISH', value: 'POLISH' },
        { name: 'Language.PORTUGUESE', value: 'PORTUGUESE' },
        { name: 'Language.ROMANIAN', value: 'ROMANIAN' },
        { name: 'Language.RUSSIAN', value: 'RUSSIAN' },
        { name: 'Language.SERBIAN', value: 'SERBIAN' },
        { name: 'Language.SLOVAK', value: 'SLOVAK' },
        { name: 'Language.SLOVENIAN', value: 'SLOVENIAN' },
        { name: 'Language.SPANISH', value: 'SPANISH' },
        { name: 'Language.SWEDISH', value: 'SWEDISH' },
        { name: 'Language.TAGALOG', value: 'TAGALOG' },
        { name: 'Language.THAI', value: 'THAI' },
        { name: 'Language.TURKISH', value: 'TURKISH' },
        { name: 'Language.UKRAINIAN', value: 'UKRAINIAN' },
        { name: 'Language.VIETNAMESE', value: 'VIETNAMESE' }
    ];

    static getLanguageFromKey(key: keyof typeof Language): Language {
        return Language[key];
    }
    
    static getThemeFromKey(key: keyof typeof Theme): Theme {
        return Theme[key];
    }
    
    static getSizeFromKey(key: keyof typeof Size): Size {
        return Size[key];
    }
    
    static getAppearanceFromKey(key: keyof typeof Appearance): Appearance {
        return Appearance[key];
    }
    
    static getRetryFromKey(key: keyof typeof Retry): Retry {
        return Retry[key];
    }

    static getRefreshExpiryFromKey(key: keyof typeof RefreshExpiry): RefreshExpiry {
        return RefreshExpiry[key];
    }

    static getRefreshTimeoutFromKey(key: keyof typeof RefreshTimeout): RefreshTimeout {
        return RefreshTimeout[key];
    }
}