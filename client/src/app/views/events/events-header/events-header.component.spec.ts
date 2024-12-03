import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsHeaderComponent } from './events-header.component';

describe('EventsHeaderComponent', () => {
  let component: EventsHeaderComponent;
  let fixture: ComponentFixture<EventsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
