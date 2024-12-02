import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopicsCategoriesLinksComponent } from './topics-categories-links.component';

describe('TopicsCategoriesLinksComponent', () => {
  let component: TopicsCategoriesLinksComponent;
  let fixture: ComponentFixture<TopicsCategoriesLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicsCategoriesLinksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicsCategoriesLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
