// recommendations.component.ts
import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { RecommendationsService } from '../../../../core/services/profile/recommendations.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReplaceSpacesPipe } from '../../../../core/helpers/replace space/replace-spaces.pipe';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonComponent,
    NzIconModule,
    RouterModule,
    ReplaceSpacesPipe,
  ],
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css'],
})
export class RecommendationsComponent implements OnInit {
  categories: string[] = [];
  activityRecommendations: string[] = [];
  nutritionRecommendations: string[] = [];

  private recommendationsSubscription: Subscription | null = null;

  constructor(private recommendationsService: RecommendationsService) {}

  ngOnInit(): void {
    this.recommendationsSubscription =
      this.recommendationsService.categories$.subscribe((data) => {
        this.categories = data;
      });

    this.recommendationsService.activityRecommendations$.subscribe((data) => {
      this.activityRecommendations = data;
    });

    this.recommendationsService.nutritionRecommendations$.subscribe((data) => {
      this.nutritionRecommendations = data;
    });
  }

  ngOnDestroy(): void {
    if (this.recommendationsSubscription) {
      this.recommendationsSubscription.unsubscribe();
    }
  }
}
