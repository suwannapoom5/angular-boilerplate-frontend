import { ComponentFixture, TestBed } from '@angular/core/testing';

import { APITestingComponent } from './apitesting.component';

describe('Dashboard', () => {
  let component: APITestingComponent;
  let fixture: ComponentFixture<APITestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [APITestingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(APITestingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
