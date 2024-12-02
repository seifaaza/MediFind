import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopicsHeaderComponent } from './topics-header.component';

describe('TopicsHeaderComponent', () => {
  let component: TopicsHeaderComponent;
  let fixture: ComponentFixture<TopicsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicsHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
