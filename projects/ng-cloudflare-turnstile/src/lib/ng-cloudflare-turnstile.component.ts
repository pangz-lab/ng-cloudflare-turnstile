import { Component, EventEmitter, Input, Output, type AfterViewInit, type OnInit } from '@angular/core';

declare global {
    interface Window {
        onloadTurnstileCallback: () => void;
        turnstile: {
            render: (
                idOrContainer: string | HTMLElement,
                options: any,
            ) => string;
            reset: (widgetIdOrContainer: string | HTMLElement) => void;
            getResponse: (
                widgetIdOrContainer: string | HTMLElement,
            ) => string | undefined;
            remove: (widgetIdOrContainer: string | HTMLElement) => void;
        };
    }
}

export enum DevSiteKey {
    ALWAYS_PASSES = '1x00000000000000000000AA',
    ALWAYS_BLOCKS = '2x00000000000000000000AB',
    ALWAYS_PASSES_INVISIBLE = '1x00000000000000000000BB',
    ALWAYS_BLOCKS_INVISIBLE = '2x00000000000000000000BB',
    FORCE_INTERACTIVE_CHALLENGE = '3x00000000000000000000FF',
}

export enum DevSecretKey {
    ALWAYS_PASSES = '1x0000000000000000000000000000000AA',
    ALWAYS_FAILS = '2x0000000000000000000000000000000AA',
    TOKEN_ALREADY_SPENT = '3x0000000000000000000000000000000AA',
}

export enum Language {
    AUTO = 'auto',
    ARABIC = 'ar-eg',
    BULGARIAN = 'bg-bg',
    CHINESE_SIMPLIFIED = 'zh-cn',
    CHINESE_TRADITIONAL = 'zh-tw',
    CROATIAN = 'hr-hr',
    CZECH = 'cs-cz',
    DANISH = 'da-dk',
    DUTCH = 'nl-nl',
    ENGLISH = 'en-us',
    FARSI = 'fa-ir',
    FINNISH = 'fi-fi',
    FRENCH = 'fr-fr',
    GERMAN = 'de-de',
    GREEK = 'el-gr',
    HEBREW = 'he-il',
    HINDI = 'hi-in',
    HUNGARIAN = 'hu-hu',
    INDONESIAN = 'id-id',
    ITALIAN = 'it-it',
    JAPANESE = 'ja-jp',
    KLINGON = 'tlh',
    KOREAN = 'ko-kr',
    LITHUANIAN = 'lt-lt',
    MALAY = 'ms-my',
    NORWEGIAN = 'nb-no',
    POLISH = 'pl-pl',
    PORTUGUESE = 'pt-br',
    ROMANIAN = 'ro-ro',
    RUSSIAN = 'ru-ru',
    SERBIAN = 'sr-ba',
    SLOVAK = 'sk-sk',
    SLOVENIAN = 'sl-si',
    SPANISH = 'es-es',
    SWEDISH = 'sv-se',
    TAGALOG = 'tl-ph',
    THAI = 'th-th',
    TURKISH = 'tr-tr',
    UKRAINIAN = 'uk-ua',
    VIETNAMESE = 'vi-vn'
}

export enum Theme {
    LIGHT = 'light',
    DARK = 'dark',
    AUTO = 'auto',
}

export enum Size {
    NORMAL = 'normal',
    FLEXIBLE = 'flexible',
    COMPACT = 'compact',
}

export enum Appearance {
    ALWAYS = 'always',
    EXECUTE = 'execute',
    INTERACTION_ONLY = 'interaction-only',
}

export enum Retry {
    AUTO = 'auto',
    NEVER = 'never',
}

export enum RefreshExpiry {
    AUTO = 'auto',
    MANUAL = 'manual',
    NEVER = 'never',
}

export enum RefreshTimeout {
    AUTO = 'auto',
    MANUAL = 'manual',
    NEVER = 'never',
}

export enum State {
    SUCCESS = 0,
    WIDGET_CREATED = 1,
    WIDGET_REMOVED = 2,
    WIDGET_RESET = 3,
    AFTER_INTERACTIVE = 4,
    BEFORE_INTERACTIVE = 5,
    ERROR = -1,
    EXPIRED = -2,
    TIMEOUT = -3,
}

export type Result = {
    name: string,
    data?: any
    result: number,
    manager: TurnstileManager
}

export type Config = {
    siteKey: string;
    action?: string;
    cData?: string;
    tabIndex?: number;
    language?: Language;
    theme?: Theme;
    responseField?: boolean;
    size?: Size;
    appearance?: Appearance;
    retry?: Retry;
    retryInterval?: number;
    refreshExpired?: RefreshExpiry;
    refreshTimeout?: RefreshTimeout;
    feedbackEnabled?: boolean;
}

class EventHandler {
    private static widgetId: string;
    private static tsManager: TurnstileManager;
    private static event: EventEmitter<Result>;
    private static config: Config = {
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

    static init(e: EventEmitter<Result>, config: Config, manager: TurnstileManager, widgetId = ''): void {
        EventHandler.event = e;
        EventHandler.config = config;
        EventHandler.tsManager = manager;
        EventHandler.widgetId = widgetId;
    }

    static emit(d: Result): void {
        EventHandler.event.emit(d);
    }
    
    static get e(): EventEmitter<Result> {
        return EventHandler.event;
    }

    static setWidgetId(id: string): void {
        EventHandler.widgetId = id;
    }
    
    static getWidgetId(): string {
        return EventHandler.widgetId;
    }

    static get conf(): Config {
        return EventHandler.config;
    }
    
    static get manager(): TurnstileManager {
        return EventHandler.tsManager;
    }

    static copyWith(p: {
        manager?: TurnstileManager,
        widgetId?: string,
    }): void {
        if(p.manager !== null) {
            EventHandler.tsManager = p.manager!;
        }
        if(p.widgetId !== null) {
            EventHandler.widgetId = p.widgetId!;
        }
    }
}

export class TurnstileManager {
    
    constructor(
        private obj: any,
        private event: EventEmitter<Result>,
        private widgetId: string = '',
        private containerRef: string | HTMLElement = '',
        private options: any = ''
    ) {}

    reRender(options: Config): void {
        this.remove(null);
        this.updateOptions(options);
        this.widgetId = this.obj.render(this.containerRef, this.options);
        this.event.emit({ name: 'WIDGET_CREATED', data: this.widgetId, result: State.WIDGET_CREATED, manager: this});
    }

    reset(id: string | HTMLElement | null): void {
        this.obj.reset(id ?? this.widgetId);
        this.event.emit({ name: 'WIDGET_RESET', data: id, result: State.WIDGET_RESET, manager: this});
    }
    
    remove(id: string | HTMLElement | null): void {
        this.obj.remove(id ?? this.widgetId);
        this.event.emit({ name: 'WIDGET_REMOVED', data: id, result: State.WIDGET_REMOVED, manager: this});
    }

    private updateOptions(options: Config): void {
        if(this.options.sitekey !== options.siteKey) { this.options.sitekey = options.siteKey; }
        if(this.options.action !== options.action) { this.options.action = options.action; }
        if(this.options.cData !== options.cData) { this.options.cData = options.cData; }
        if(this.options.tabindex !== options.tabIndex) { this.options.tabindex = options.tabIndex; }
        if(this.options.language !== options.language) { this.options.language = options.language; }
        if(this.options.theme !== options.theme) { this.options.theme = options.theme; }
        if(this.options.size !== options.size) { this.options.size = options.size; }
        if(this.options.appearance !== options.appearance) { this.options.appearance = options.appearance; }
        if(this.options.retry !== options.retry) { this.options.retry = options.retry; }
        if(this.options['retry-interval'] !== options.retryInterval) { this.options['retry-interval'] = options.retryInterval; }
        if(this.options['refresh-expired'] !== options.refreshExpired) { this.options['refresh-expired'] = options.refreshExpired; }
        if(this.options['refresh-timeout'] !== options.refreshTimeout) { this.options['refresh-timeout'] = options.refreshTimeout; }
        if(this.options['response-field'] !== options.responseField) { this.options['response-field'] = options.responseField; }
        if(this.options['feedback-enabled'] !== options.feedbackEnabled) { this.options['feedback-enabled'] = options.feedbackEnabled; }
    }
}

@Component({
    selector: 'ng-cloudflare-turnstile',
    standalone: true,
    imports: [],
    template: `<div id="cf-container"></div>`,
    styles: ``
})
export class NgCloudflareTurnstileComponent implements AfterViewInit, OnInit {
    @Input() config: Config = {
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
    @Output() event = new EventEmitter<Result>();
    constructor() {
        window.onloadTurnstileCallback = function () {
            const conf = EventHandler.conf;
            const containerRef = "#cf-container";
            const opt = {
                sitekey: conf.siteKey,
                action: conf.action,
                cData: conf.cData,
                tabindex: conf.tabIndex,
                language: conf.language,
                theme: conf.theme,
                size: conf.size,
                appearance: conf.appearance,
                retry: conf.retry,
                'retry-interval': conf.retryInterval,
                'refresh-expired': conf.refreshExpired,
                'refresh-timeout': conf.refreshTimeout,
                'response-field': conf.responseField,
                'feedback-enabled': conf.feedbackEnabled,
                callback: (token: any) => {
                    EventHandler.emit({ name: 'SUCCESS', data: token, result: State.SUCCESS, manager: EventHandler.manager});
                },
                'error-callback': (code: any) => {
                    EventHandler.emit({ name: 'ERROR', data: code, result: State.ERROR, manager: EventHandler.manager });
                },
                'expired-callback': (d: any) => {
                    EventHandler.emit({ name: 'EXPIRED', data: d, result: State.EXPIRED, manager: EventHandler.manager });
                },
                'before-interactive-callback': (d: any) => {
                    EventHandler.emit({ name: 'BEFORE_INTERACTIVE', data: d, result: State.BEFORE_INTERACTIVE, manager: EventHandler.manager });
                },
                'after-interactive-callback': (d: any) => {
                    EventHandler.emit({ name: 'AFTER_INTERACTIVE', data: d, result: State.AFTER_INTERACTIVE, manager: EventHandler.manager });
                },
                'timeout-callback': (d: any) => {
                    EventHandler.emit({ name: 'TIMEOUT', data: d, result: State.TIMEOUT, manager: EventHandler.manager });
                }
            };
            const widgetId = window.turnstile.render(containerRef, opt);
            EventHandler.setWidgetId(widgetId);
            EventHandler.copyWith({manager: new TurnstileManager(window.turnstile, EventHandler.e, widgetId, containerRef, opt)});
            EventHandler.emit({ name: 'WIDGET_CREATED', data: widgetId, result: State.WIDGET_CREATED, manager: EventHandler.manager});
        };
    }

    ngOnInit(): void {
        EventHandler.init(this.event, this.config, new TurnstileManager(window.turnstile, this.event));
        if (window.turnstile) {
            window.onloadTurnstileCallback();
        }
    }

    ngAfterViewInit(): void { this.loadTurnstileScript(); }

    private loadTurnstileScript(): void {
        // Check if script is already loaded to avoid duplicates
        if (!document.querySelector('script[src*="turnstile"]')) {
            const script = document.createElement('script');
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }
    }
}
