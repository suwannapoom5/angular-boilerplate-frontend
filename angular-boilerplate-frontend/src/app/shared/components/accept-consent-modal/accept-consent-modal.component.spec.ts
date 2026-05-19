import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptConsentModalComponent } from './accept-consent-modal.component';

describe('AcceptConsentModalComponent', () => {
  let component: AcceptConsentModalComponent;
  let fixture: ComponentFixture<AcceptConsentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptConsentModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptConsentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
