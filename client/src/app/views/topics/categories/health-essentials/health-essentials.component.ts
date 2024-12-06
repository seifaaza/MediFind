import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router
import { BackComponent } from '../../../../core/components/buttons/back/back.component';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { EmptyDataComponent } from '../../../../core/errors/empty-data/empty-data.component';

@Component({
  selector: 'app-health-essentials',
  standalone: true,
  imports: [
    BackComponent,
    CommonModule,
    NzIconModule,
    NzButtonModule,
    RouterModule,
    EmptyDataComponent,
  ],
  templateUrl: './health-essentials.component.html',
  styleUrls: ['./health-essentials.component.css'],
})
export class HealthEssentialsComponent implements OnInit {
  items: { Id: string; Title: string }[] = []; // All items from API
  displayedItems: { Id: string; Title: string }[] = []; // Items to display
  loading = true; // Loading state
  placeholders = Array(16).fill(0); // 16 placeholders for skeleton cards
  loadMoreLoading = false; // Loading state for "Load More"
  itemsPerPage = 20; // Number of items to display per page
  currentIndex = 0; // Index to track currently displayed items

  constructor(private http: HttpClient, private router: Router) {} // Inject Router

  ngOnInit(): void {
    const apiUrl =
      'https://odphp.health.gov/myhealthfinder/api/v3/itemlist.json?Type=topic';
    this.http.get<any>(apiUrl).subscribe({
      next: (response) => {
        if (response?.Result?.Items?.Item) {
          this.items = response.Result.Items.Item.map((item: any) => ({
            Id: item.Id,
            Title: item.Title,
          }));
          this.displayNextItems(); // Display initial items
        }
        this.loading = false; // Stop loading after success
      },
      error: () => {
        this.loading = false; // Stop loading even if there's an error

        // Redirect to the server-error page
        this.router.navigate(['/server-error']);
      },
    });
  }

  displayNextItems(): void {
    // Load the next set of items
    const nextItems = this.items.slice(
      this.currentIndex,
      this.currentIndex + this.itemsPerPage
    );
    this.displayedItems = [...this.displayedItems, ...nextItems];
    this.currentIndex += this.itemsPerPage;
    this.loadMoreLoading = false; // Reset "Load More" loading state
  }

  onLoadMore(): void {
    this.loadMoreLoading = true;
    setTimeout(() => {
      this.displayNextItems();
    }, 300); // Simulate slight delay for loading animation
  }
}
