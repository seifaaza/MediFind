import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidesCategoriesLinksComponent } from './guides-categories-links.component';

describe('GuidesCategoriesLinksComponent', () => {
  let component: GuidesCategoriesLinksComponent;
  let fixture: ComponentFixture<GuidesCategoriesLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuidesCategoriesLinksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GuidesCategoriesLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
