import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonOutletsComponent } from './common-outlets.component';

describe('CommonOutletsComponent', () => {
  let component: CommonOutletsComponent;
  let fixture: ComponentFixture<CommonOutletsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonOutletsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonOutletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
