import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { environment } from '../../../../../environments/environment.prod';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vaccination',
  standalone: true,
  imports: [
    CommonModule,
    NzIconModule,
    NzButtonModule,
    NzModalModule,
    RouterModule,
  ],
  templateUrl: './vaccination.component.html',
  styleUrl: './vaccination.component.css',
})
export class VaccinationComponent implements OnInit {
  googleEventApiKey = environment.GOOGLE_EVENT_API_KEY;
  isVisible = false;
  events: EventData[] = [];
  loading = true;
  error = false;
  noEvents = false;
  placeholders = Array(4).fill(0);
  keyword = 'Vaccination';
  selectedEvent: EventData | null = null;

  // Pagination State
  displayedEventsCount = 4; // Show first 3 events initially
  showAllEvents = false; // Show all events flag

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const apiUrl = `/api/search.json?engine=google_events&q=${this.keyword}&hl=en&gl=ma&api_key=${this.googleEventApiKey}`;

    this.http.get<ApiResponse>(apiUrl).subscribe({
      next: (response) => {
        if (response.events_results && response.events_results.length > 0) {
          this.events = response.events_results.map((event) => {
            return {
              thumbnail:
                event.image ||
                'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg',
              day: this.getDayFromStartDate(event.date?.start_date),
              month: this.getMonthFromStartDate(event.date?.start_date),
              title: event.title || 'No title available',
              description: event.description || 'No description available',
              country:
                event.address && event.address[1]
                  ? event.address[1]
                  : 'Country not available',
              address:
                event.address && event.address[0]
                  ? event.address[0]
                  : 'Address not found',
              link: event.link || null,
              location: event.event_location_map?.link || null,
              date: event.date?.start_date || 'Date is not available',
              time: event.date?.when || 'Time not available',
            };
          });

          this.noEvents = false;
        } else {
          this.events = [];
          this.noEvents = true;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      },
    });
  }

  private getDayFromStartDate(startDate: string | undefined): string {
    if (startDate) {
      const parts = startDate.split(' ');
      return parts.length > 1 ? parts[1].replace(',', '') : '';
    }
    return '';
  }

  private getMonthFromStartDate(startDate: string | undefined): string {
    if (startDate) {
      const parts = startDate.split(' ');
      return parts[0] || '';
    }
    return '';
  }

  showModal(event: EventData): void {
    this.selectedEvent = event;
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.selectedEvent = null;
  }

  openWebsite(url: string | null | undefined): void {
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('Website link is not available.');
    }
  }

  openLocation(location: string | null | undefined): void {
    if (location) {
      window.open(location, '_blank');
    } else {
      alert('Location link is not available.');
    }
  }

  toggleShowAllEvents(): void {
    this.showAllEvents = !this.showAllEvents;
    this.displayedEventsCount = this.showAllEvents ? this.events.length : 4;
  }
}

// Define response and event interfaces
interface ApiResponse {
  events_results?: EventResult[];
}

interface EventResult {
  thumbnail?: string;
  image?: string;
  date?: {
    start_date?: string;
    when?: string;
  };
  title?: string;
  description?: string;
  address?: string[];
  country?: string[];
  link?: null;
  event_location_map?: {
    link?: string;
  };
}

interface EventData {
  thumbnail: string;
  day: string;
  month: string;
  title: string;
  description: string;
  address: string;
  country: string;
  date: string;
  time: string;
  link: string | null;
  location: string | null;
}
