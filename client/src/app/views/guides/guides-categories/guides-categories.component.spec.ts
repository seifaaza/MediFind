import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidesCategoriesComponent } from './guides-categories.component';

describe('GuidesCategoriesComponent', () => {
  let component: GuidesCategoriesComponent;
  let fixture: ComponentFixture<GuidesCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuidesCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuidesCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
