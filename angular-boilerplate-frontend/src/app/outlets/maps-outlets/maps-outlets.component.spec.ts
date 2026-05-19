import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsOutletsComponent } from './maps-outlets.component';

describe('MapsOutletsComponent', () => {
  let component: MapsOutletsComponent;
  let fixture: ComponentFixture<MapsOutletsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapsOutletsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapsOutletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
