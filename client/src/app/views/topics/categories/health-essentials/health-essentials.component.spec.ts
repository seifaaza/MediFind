import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthEssentialsComponent } from './health-essentials.component';

describe('HealthEssentialsComponent', () => {
  let component: HealthEssentialsComponent;
  let fixture: ComponentFixture<HealthEssentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthEssentialsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthEssentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
