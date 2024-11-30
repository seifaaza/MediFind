import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentalWellBeingGuideComponent } from './mental-well-being-guide.component';

describe('MentalWellBeingGuideComponent', () => {
  let component: MentalWellBeingGuideComponent;
  let fixture: ComponentFixture<MentalWellBeingGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentalWellBeingGuideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentalWellBeingGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
