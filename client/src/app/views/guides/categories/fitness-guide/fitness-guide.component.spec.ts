import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitnessGuideComponent } from './fitness-guide.component';

describe('FitnessGuideComponent', () => {
  let component: FitnessGuideComponent;
  let fixture: ComponentFixture<FitnessGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FitnessGuideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FitnessGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
