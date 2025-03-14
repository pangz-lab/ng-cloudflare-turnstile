import { Component, type OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgCloudflareTurnstileComponent, Appearance, DevSiteKey, RefreshExpiry, RefreshTimeout, Retry, Size, Theme, type Config, type Result, Language, State, type TurnstileManager } from 'ng-cloudflare-turnstile';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [NgCloudflareTurnstileComponent, ReactiveFormsModule, FormsModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
    readonly viewConfig = {
        siteKey: { l: TurnstileViewElements.siteKey, default: DevSiteKey.FORCE_INTERACTIVE_CHALLENGE, raw: 'FORCE_INTERACTIVE_CHALLENGE'},
        language: { l: TurnstileViewElements.language, default: Language.TAGALOG, raw: 'TAGALOG'},
        theme: { l: TurnstileViewElements.theme, default: Theme.AUTO, raw: 'AUTO'},
        size: { l: TurnstileViewElements.size, default: Size.NORMAL, raw: 'NORMAL'},
        appearance: { l: TurnstileViewElements.appearance, default: Appearance.ALWAYS, raw: 'ALWAYS'},
        retry: { l: TurnstileViewElements.retry, default: Retry.AUTO, raw: 'AUTO'},
        refreshExpiry: { l: TurnstileViewElements.refreshExpiry, default: RefreshExpiry.AUTO, raw: 'AUTO'},
        refreshTimeout: { l: TurnstileViewElements.refreshTimeout, default: RefreshTimeout.AUTO, raw: 'AUTO'},
    }
    inSiteKey = new FormControl('');
    inLanguage = new FormControl('');
    inTheme = new FormControl('');
    inSize = new FormControl('');
    inAppearance = new FormControl('');
    inRetry = new FormControl('');
    inRetryInterval = new FormControl('');
    inRefreshExpiry = new FormControl('');
    inRefreshTimeout = new FormControl('');
    inAction = new FormControl('');
    inCData = new FormControl('');
    inTabIndex = new FormControl('');
    inResponseField = new FormControl('');
    inFeedbackEnabled = new FormControl('');
    inEventLogger = new FormControl('');
    inPayloadLogger = new FormControl('');

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
        feedbackEnabled: true,
        responseField: true,
    }

    configChanges = {
        name: '',
        from: '',
        to: '' 
    };
    ngOnInit(): void {
        EventLogger.init(this.inEventLogger, this.inPayloadLogger);
        this.initSubscription();
    }

    conf(): string { return JSON.stringify(this.config, null, 2); }

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

    private logConfigUpdate(name: string, from: string, to: string): void {
        this.configChanges.name = name;
        this.configChanges.from = from;
        this.configChanges.to = to;
    }
    private initSubscription(): void {
        this.inSiteKey.setValue(this.config.siteKey);
        this.inAction.setValue(this.config.action ?? '');
        this.inCData.setValue(this.config.cData ?? '');
        this.inTabIndex.setValue(this.config.tabIndex?.toString() ?? '');
        this.inLanguage.setValue(this.viewConfig.language.raw);
        this.inTheme.setValue(this.viewConfig.theme.raw);
        this.inSize.setValue(this.viewConfig.size.raw);
        this.inAppearance.setValue(this.viewConfig.appearance.raw);
        this.inRetry.setValue(this.viewConfig.retry.raw);
        this.inRetryInterval.setValue(this.config.retryInterval?.toString() ?? '');
        this.inRefreshExpiry.setValue(this.viewConfig.refreshExpiry.raw);
        this.inRefreshTimeout.setValue(this.viewConfig.refreshTimeout.raw);
        this.inFeedbackEnabled.setValue(this.config.feedbackEnabled?.toString() ?? '');
        
        this.inSiteKey.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}
            
            const newValue = value ?? '';
            this.logConfigUpdate('siteKey', this.config.siteKey, newValue);
            this.config.siteKey = newValue;
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inLanguage.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}
            
            const newValue = TurnstileViewElements.getLanguageFromKey(value as keyof typeof Language);;
            this.logConfigUpdate('language', (this.config.language ?? '').toString(), newValue);
            this.config.language = newValue;
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inTheme.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}
            
            const newValue = TurnstileViewElements.getThemeFromKey(value as keyof typeof Theme);
            this.logConfigUpdate('theme', (this.config.theme ?? '').toString(), newValue);
            this.config.theme = newValue;
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inSize.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}
            
            const newValue = TurnstileViewElements.getSizeFromKey(value as keyof typeof Size);
            this.logConfigUpdate('size', (this.config.size ?? '').toString(), newValue);
            this.config.size = newValue;
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inAppearance.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}
            
            const newValue = TurnstileViewElements.getAppearanceFromKey(value as keyof typeof Appearance);
            this.logConfigUpdate('appearance', (this.config.appearance ?? '').toString(), newValue);
            this.config.appearance = newValue;
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inRetry.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}
            
            const newValue = TurnstileViewElements.getRetryFromKey(value as keyof typeof Retry);
            this.logConfigUpdate('retry', (this.config.retry ?? '').toString(), newValue);
            this.config.retry = newValue;
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inRetryInterval.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}

            const newValue = parseInt(value?.toString() ?? '0');
            this.logConfigUpdate('retryInterval', (this.config.retryInterval ?? '').toString(), newValue.toString());
            this.config.retryInterval = newValue;
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inRefreshExpiry.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}
            
            const newValue = TurnstileViewElements.getRefreshExpiryFromKey(value as keyof typeof RefreshExpiry);
            this.logConfigUpdate('refreshExpired', (this.config.refreshExpired ?? '').toString(), newValue);
            this.config.refreshExpired = newValue;
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inRefreshTimeout.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}
            
            const newValue = TurnstileViewElements.getRefreshTimeoutFromKey(value as keyof typeof RefreshTimeout);
            this.logConfigUpdate('refreshTimeout', (this.config.refreshTimeout ?? '').toString(), newValue);
            this.config.refreshTimeout = newValue;
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inAction.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}

            const newValue = value ?? '';
            this.logConfigUpdate('action', (this.config.action ?? '').toString(), newValue);
            this.config.action = newValue;
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inCData.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}

            const newValue = value ?? '';
            this.logConfigUpdate('cData', (this.config.cData ?? '').toString(), newValue);
            this.config.cData = newValue
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inTabIndex.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}

            const newValue = parseInt(value?.toString() ?? '0');
            this.logConfigUpdate('tabIndex', (this.config.tabIndex ?? '').toString(), newValue.toString());
            this.config.tabIndex = newValue;
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inResponseField.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}

            const newValue = (value ? true : false);
            this.logConfigUpdate('responseField', (this.config.responseField ?? '').toString(), newValue.toString());
            this.config.responseField = newValue;
            Turnstile.manager!.reRender(this.config);
        });
        
        this.inFeedbackEnabled.valueChanges.subscribe(value => {
            if(Turnstile.manager === undefined) {return;}

            const newValue = (value ? true : false);
            this.logConfigUpdate('feedbackEnabled', (this.config.feedbackEnabled ?? '').toString(), newValue.toString());
            this.config.feedbackEnabled = newValue;
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