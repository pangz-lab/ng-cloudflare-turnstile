import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild, type AfterViewInit, type OnInit } from '@angular/core';

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

export type EventCallback = (d: Result) => void;
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
    onSuccess?: EventCallback,
    onError?: EventCallback,
    onExpired?: EventCallback,
    onBeforeInteractive?: EventCallback,
    onAfterInteractive?: EventCallback,
    onTimeout?: EventCallback,
    onCreate?: EventCallback,
    onReset?: EventCallback,
    onRemove?: EventCallback,
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
        
        const payload = { name: 'WIDGET_CREATED', data: this.widgetId, result: State.WIDGET_CREATED, manager: this}
        this.options.onCreate?.(payload);
        this.event.emit(payload);
    }

    reset(id: string | HTMLElement | null): void {
        this.obj.reset(id ?? this.widgetId);

        const payload = { name: 'WIDGET_RESET', data: id, result: State.WIDGET_RESET, manager: this};
        this.options.onReset?.(payload);
        this.event.emit(payload);
    }
    
    remove(id: string | HTMLElement | null): void {
        this.obj.remove(id ?? this.widgetId);

        const payload = { name: 'WIDGET_REMOVED', data: id, result: State.WIDGET_REMOVED, manager: this};
        this.options.onRemove?.(payload);
        this.event.emit(payload);
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
        onSuccess: (_: Result): void => {},
        onError: (_: Result): void => {},
        onExpired: (_: Result): void => {},
        onBeforeInteractive: (_: Result): void => {},
        onAfterInteractive: (_: Result): void => {},
        onTimeout: (_: Result): void => {},
        onCreate: (_: Result): void => {},
        onReset: (_: Result): void => {},
        onRemove: (_: Result): void => {},
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
        if(p.manager !== null) { EventHandler.tsManager = p.manager!; }
        if(p.widgetId !== null) { EventHandler.widgetId = p.widgetId!; }
    }
}

@Component({
    selector: 'ng-cloudflare-turnstile',
    standalone: true,
    imports: [],
    template: `<div #cfContainer></div>`,
    styles: ``
})
export class NgCloudflareTurnstile implements AfterViewInit, OnInit, OnDestroy {
    private _manager?: TurnstileManager;

    @ViewChild('cfContainer', { static: true }) private cfContainer!: ElementRef<HTMLDivElement>;

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
        onSuccess: (_: Result): void => {},
        onError: (_: Result): void => {},
        onExpired: (_: Result): void => {},
        onBeforeInteractive: (_: Result): void => {},
        onAfterInteractive: (_: Result): void => {},
        onTimeout: (_: Result): void => {},
        onCreate: (_: Result): void => {},
        onReset: (_: Result): void => {},
        onRemove: (_: Result): void => {},
    };
    @Output() event = new EventEmitter<Result>();
    constructor() {
        window.onloadTurnstileCallback = () => {
            const conf = EventHandler.conf;
            const containerRef = this.cfContainer.nativeElement;
            const renderingConf = {
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
                    const payload = { name: 'SUCCESS', data: token, result: State.SUCCESS, manager: EventHandler.manager};
                    if(EventHandler.conf.onSuccess !== undefined) { EventHandler.conf.onSuccess!(payload); }
                    EventHandler.emit(payload);
                },
                'error-callback': (code: any) => {
                    const payload = { name: 'ERROR', data: code, result: State.ERROR, manager: EventHandler.manager };
                    if(EventHandler.conf.onError !== undefined) { EventHandler.conf.onError!(payload); }
                    EventHandler.emit(payload);
                },
                'expired-callback': (d: any) => {
                    const payload = { name: 'EXPIRED', data: d, result: State.EXPIRED, manager: EventHandler.manager };
                    if(EventHandler.conf.onExpired !== undefined) { EventHandler.conf.onExpired!(payload); }
                    EventHandler.emit(payload);
                },
                'before-interactive-callback': (d: any) => {
                    const payload = { name: 'BEFORE_INTERACTIVE', data: d, result: State.BEFORE_INTERACTIVE, manager: EventHandler.manager };
                    if(EventHandler.conf.onBeforeInteractive !== undefined) { EventHandler.conf.onBeforeInteractive!(payload); }
                    EventHandler.emit(payload);
                },
                'after-interactive-callback': (d: any) => {
                    const payload = { name: 'AFTER_INTERACTIVE', data: d, result: State.AFTER_INTERACTIVE, manager: EventHandler.manager };
                    if(EventHandler.conf.onAfterInteractive !== undefined) { EventHandler.conf.onAfterInteractive!(payload); }
                    EventHandler.emit(payload);
                },
                'timeout-callback': (d: any) => {
                    const payload = { name: 'TIMEOUT', data: d, result: State.TIMEOUT, manager: EventHandler.manager };
                    if(EventHandler.conf.onTimeout !== undefined) { EventHandler.conf.onTimeout!(payload); }
                    EventHandler.emit(payload);
                },
                // Add the custom callback
                onSuccess: conf.onSuccess,
                onError: conf.onError,
                onExpired: conf.onExpired,
                onBeforeInteractive: conf.onBeforeInteractive,
                onAfterInteractive: conf.onAfterInteractive,
                onTimeout: conf.onTimeout,
                onCreate: conf.onCreate,
                onReset: conf.onReset,
                onRemove: conf.onRemove,
            };
            const widgetId = window.turnstile.render(containerRef, renderingConf);
            EventHandler.setWidgetId(widgetId);
            this._manager = new TurnstileManager(window.turnstile, EventHandler.e, widgetId, containerRef, renderingConf);
            EventHandler.copyWith({manager: this._manager});

            const payload = { name: 'WIDGET_CREATED', data: widgetId, result: State.WIDGET_CREATED, manager: EventHandler.manager};
            if(EventHandler.conf.onCreate !== undefined) { EventHandler.conf.onCreate!(payload); }
            EventHandler.emit(payload);
        };
    }

    ngOnInit(): void {
        EventHandler.init(this.event, this.config, new TurnstileManager(window.turnstile, this.event));
        if (window.turnstile) {
            window.onloadTurnstileCallback();
        }
    }

    ngAfterViewInit(): void { this.loadTurnstileScript(); }

    ngOnDestroy(): void {
        this._manager?.remove(null);
    }

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
