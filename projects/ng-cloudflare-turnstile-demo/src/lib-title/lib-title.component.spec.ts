import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibTitleComponent } from './lib-title.component';

describe('LibTitleComponent', () => {
  let component: LibTitleComponent;
  let fixture: ComponentFixture<LibTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
