import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthenOutletsComponent } from './unauthen-outlets.component';

describe('UnauthenOutletsComponent', () => {
  let component: UnauthenOutletsComponent;
  let fixture: ComponentFixture<UnauthenOutletsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnauthenOutletsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnauthenOutletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
