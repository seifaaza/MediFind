import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthEssentialsItemComponent } from './health-essentials-item.component';

describe('HealthEssentialsItemComponent', () => {
  let component: HealthEssentialsItemComponent;
  let fixture: ComponentFixture<HealthEssentialsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthEssentialsItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthEssentialsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
