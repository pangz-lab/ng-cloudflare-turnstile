import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgCloudflareTurnstileComponent } from './ng-cloudflare-turnstile.component';

describe('NgCloudflareTurnstileComponent', () => {
  let component: NgCloudflareTurnstileComponent;
  let fixture: ComponentFixture<NgCloudflareTurnstileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgCloudflareTurnstileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgCloudflareTurnstileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
