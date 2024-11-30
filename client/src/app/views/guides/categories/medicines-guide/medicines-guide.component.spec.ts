import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicinesGuideComponent } from './medicines-guide.component';

describe('MedicinesGuideComponent', () => {
  let component: MedicinesGuideComponent;
  let fixture: ComponentFixture<MedicinesGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicinesGuideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicinesGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
