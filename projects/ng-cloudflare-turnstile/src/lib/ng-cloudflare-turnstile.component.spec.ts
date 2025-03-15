import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NgCloudflareTurnstileComponent, TurnstileManager, Config, State } from './ng-cloudflare-turnstile.component';

// Define the interface for the turnstile object to match the global declaration
interface Turnstile {
  render: (idOrContainer: string | HTMLElement, options: any) => string;
  reset: (widgetIdOrContainer: string | HTMLElement) => void;
  getResponse: (widgetIdOrContainer: string | HTMLElement) => string | undefined;
  remove: (widgetIdOrContainer: string | HTMLElement) => void;
}

describe('NgCloudflareTurnstileComponent', () => {
  let component: NgCloudflareTurnstileComponent;
  let fixture: ComponentFixture<NgCloudflareTurnstileComponent>;
  let mockTurnstile: jasmine.SpyObj<Turnstile>;

  beforeEach(async () => {
    // Create a spy object for turnstile with proper methods
    mockTurnstile = jasmine.createSpyObj<Turnstile>('Turnstile', {
      render: 'mock-widget-id',
      reset: undefined,
      getResponse: 'mock-token',
      remove: undefined,
    });

    // Mock window object with proper typing, making turnstile non-optional
    const mockWindow: { turnstile: Turnstile; onloadTurnstileCallback?: () => void } = {
      turnstile: mockTurnstile,
      onloadTurnstileCallback: undefined,
    };

    // Spy on the getter for window.turnstile
    spyOnProperty(window, 'turnstile', 'get').and.callFake(() => mockWindow.turnstile);
    spyOnProperty(window, 'onloadTurnstileCallback', 'set').and.callFake((callback: () => void) => {
      mockWindow.onloadTurnstileCallback = callback;
    });

    await TestBed.configureTestingModule({
      declarations: [NgCloudflareTurnstileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgCloudflareTurnstileComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize EventHandler with config', () => {
    spyOn(component.event, 'emit');
    component.ngOnInit();

    expect(component.event).toBeDefined();
    expect(mockTurnstile.render).toHaveBeenCalled();
  });

  it('should load the turnstile script in ngAfterViewInit if not already loaded', fakeAsync(() => {
    const documentSpy = spyOn(document, 'querySelector').and.returnValue(null);
    const createElementSpy = spyOn(document, 'createElement').and.callThrough();
    const appendChildSpy = spyOn(document.head, 'appendChild');

    component.ngAfterViewInit();
    tick();

    expect(documentSpy).toHaveBeenCalledWith('script[src*="turnstile"]');
    expect(createElementSpy).toHaveBeenCalledWith('script');
    expect(appendChildSpy).toHaveBeenCalled();
    const script = appendChildSpy.calls.mostRecent().args[0] as HTMLScriptElement;
    expect(script.src).toContain('https://challenges.cloudflare.com/turnstile/v0/api.js');
    expect(script.async).toBeTrue();
    expect(script.defer).toBeTrue();
  }));

  it('should not load the script if already present', fakeAsync(() => {
    spyOn(document, 'querySelector').and.returnValue(document.createElement('script'));
    const appendChildSpy = spyOn(document.head, 'appendChild');

    component.ngAfterViewInit();
    tick();

    expect(appendChildSpy).not.toHaveBeenCalled();
  }));

  it('should emit WIDGET_CREATED event when turnstile renders', fakeAsync(() => {
    spyOn(component.event, 'emit');
    component.ngOnInit();
    window.onloadTurnstileCallback!();

    expect(mockTurnstile.render).toHaveBeenCalledWith('#cf-container', jasmine.any(Object));
    expect(component.event.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'WIDGET_CREATED',
      result: State.WIDGET_CREATED,
      data: 'mock-widget-id',
    }));
  }));

  it('should emit SUCCESS event on callback', fakeAsync(() => {
    spyOn(component.event, 'emit');
    component.ngOnInit();
    window.onloadTurnstileCallback!();

    const renderArgs = mockTurnstile.render.calls.mostRecent().args[1];
    renderArgs.callback('mock-token');
    expect(component.event.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'SUCCESS',
      result: State.SUCCESS,
      data: 'mock-token',
    }));
  }));

  it('should emit ERROR event on error-callback', fakeAsync(() => {
    spyOn(component.event, 'emit');
    component.ngOnInit();
    window.onloadTurnstileCallback!();

    const renderArgs = mockTurnstile.render.calls.mostRecent().args[1];
    renderArgs['error-callback']('error-code');
    expect(component.event.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'ERROR',
      result: State.ERROR,
      data: 'error-code',
    }));
  }));

  describe('TurnstileManager', () => {
    let manager: TurnstileManager;

    beforeEach(() => {
      manager = new TurnstileManager(mockTurnstile, component.event, 'mock-widget-id', '#cf-container', {});
    });

    it('should reset the widget', () => {
      spyOn(component.event, 'emit');
      manager.reset(null);

      expect(mockTurnstile.reset).toHaveBeenCalledWith('mock-widget-id');
      expect(component.event.emit).toHaveBeenCalledWith(jasmine.objectContaining({
        name: 'WIDGET_RESET',
        result: State.WIDGET_RESET,
      }));
    });

    it('should remove the widget', () => {
      spyOn(component.event, 'emit');
      manager.remove(null);

      expect(mockTurnstile.remove).toHaveBeenCalledWith('mock-widget-id');
      expect(component.event.emit).toHaveBeenCalledWith(jasmine.objectContaining({
        name: 'WIDGET_REMOVED',
        result: State.WIDGET_REMOVED,
      }));
    });

    it('should re-render the widget with updated options', () => {
      spyOn(component.event, 'emit');
      const newConfig: Config = {
        siteKey: 'new-site-key',
        language: 'fr-fr' as any, // Cast to any to bypass enum issue for simplicity
        theme: 'dark' as any,
        onSuccess: () => {},
        onError: () => {},
        onExpired: () => {},
        onBeforeInteractive: () => {},
        onAfterInteractive: () => {},
        onTimeout: () => {},
        onCreate: () => {},
        onReset: () => {},
        onRemove: () => {},
      };

      manager.reRender(newConfig);

      expect(mockTurnstile.remove).toHaveBeenCalledWith('mock-widget-id');
      expect(mockTurnstile.render).toHaveBeenCalledWith('#cf-container', jasmine.objectContaining({
        sitekey: 'new-site-key',
        language: 'fr-fr',
        theme: 'dark',
      }));
      expect(component.event.emit).toHaveBeenCalledWith(jasmine.objectContaining({
        name: 'WIDGET_CREATED',
        result: State.WIDGET_CREATED,
      }));
    });
  });
});