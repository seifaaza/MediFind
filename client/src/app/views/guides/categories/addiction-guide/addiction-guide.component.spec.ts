import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddictionGuideComponent } from './addiction-guide.component';

describe('AddictionGuideComponent', () => {
  let component: AddictionGuideComponent;
  let fixture: ComponentFixture<AddictionGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddictionGuideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddictionGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
