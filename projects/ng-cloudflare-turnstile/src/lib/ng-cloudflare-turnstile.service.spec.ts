import { TestBed } from '@angular/core/testing';

import { NgCloudflareTurnstileService } from './ng-cloudflare-turnstile.service';

describe('NgCloudflareTurnstileService', () => {
  let service: NgCloudflareTurnstileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgCloudflareTurnstileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
