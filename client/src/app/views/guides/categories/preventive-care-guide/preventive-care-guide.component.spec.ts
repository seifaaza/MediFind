import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventiveCareGuideComponent } from './preventive-care-guide.component';

describe('PreventiveCareGuideComponent', () => {
  let component: PreventiveCareGuideComponent;
  let fixture: ComponentFixture<PreventiveCareGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreventiveCareGuideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreventiveCareGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
