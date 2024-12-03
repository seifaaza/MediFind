import { Component } from '@angular/core';
import { EventsHeaderComponent } from './events-header/events-header.component';
import { BloodDonationComponent } from './sections/blood-donation/blood-donation.component';
import { VaccinationComponent } from './sections/vaccination/vaccination.component';
import { AwarenessComponent } from './sections/awareness/awareness.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    EventsHeaderComponent,
    BloodDonationComponent,
    VaccinationComponent,
    AwarenessComponent,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent {}
