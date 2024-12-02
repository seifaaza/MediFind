import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { HttpClient } from '@angular/common/http';
import { BackComponent } from '../../../../../core/components/buttons/back/back.component';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-health-essentials-item',
  standalone: true,
  imports: [BackComponent, CommonModule, NzIconModule],
  templateUrl: './health-essentials-item.component.html',
  styleUrls: ['./health-essentials-item.component.css'],
})
export class HealthEssentialsItemComponent implements OnInit {
  id: string | null = null;
  resourceTitle: string = '';
  sections: { title: string; content: string }[] = [];
  loading = true; // Loading state

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('Selected Item ID:', this.id);

    // Fetch data for the selected item
    this.fetchData();
  }

  fetchData() {
    const apiUrl = `https://odphp.health.gov/myhealthfinder/api/v3/topicsearch.json?TopicId=${this.id}`;

    this.http.get<any>(apiUrl).subscribe(
      (data) => {
        const resource = data.Result.Resources.Resource[0];
        this.resourceTitle = resource.Title;

        // Extract sections
        if (resource.Sections) {
          this.sections = resource.Sections.section.map((section: any) => ({
            title: section.Title,
            content: section.Content,
          }));
        }

        // Turn off loading
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.loading = false; // Turn off loading even on error

        // Redirect to the server-error page
        this.router.navigate(['/server-error']);
      }
    );
  }
}
