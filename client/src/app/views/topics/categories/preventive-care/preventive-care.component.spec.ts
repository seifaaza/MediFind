import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreventiveCareComponent } from './preventive-care.component';

describe('PreventiveCareComponent', () => {
  let component: PreventiveCareComponent;
  let fixture: ComponentFixture<PreventiveCareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreventiveCareComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreventiveCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
