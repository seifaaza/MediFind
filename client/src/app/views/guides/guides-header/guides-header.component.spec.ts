import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidesHeaderComponent } from './guides-header.component';

describe('GuidesHeaderComponent', () => {
  let component: GuidesHeaderComponent;
  let fixture: ComponentFixture<GuidesHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuidesHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuidesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
