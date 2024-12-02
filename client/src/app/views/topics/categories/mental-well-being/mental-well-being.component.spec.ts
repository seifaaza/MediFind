import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentalWellBeingComponent } from './mental-well-being.component';

describe('MentalWellBeingComponent', () => {
  let component: MentalWellBeingComponent;
  let fixture: ComponentFixture<MentalWellBeingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentalWellBeingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MentalWellBeingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
