import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodDonationComponent } from './blood-donation.component';

describe('BloodDonationComponent', () => {
  let component: BloodDonationComponent;
  let fixture: ComponentFixture<BloodDonationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodDonationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
