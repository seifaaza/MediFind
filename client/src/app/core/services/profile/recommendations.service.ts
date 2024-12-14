// recommendations.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecommendationsService {
  private categoriesSource = new BehaviorSubject<string[]>([]);
  private activityRecommendationsSource = new BehaviorSubject<string[]>([]);
  private nutritionRecommendationsSource = new BehaviorSubject<string[]>([]);

  categories$ = this.categoriesSource.asObservable();
  activityRecommendations$ = this.activityRecommendationsSource.asObservable();
  nutritionRecommendations$ =
    this.nutritionRecommendationsSource.asObservable();

  constructor() {}

  setRecommendations(
    categories: string[],
    activityRecommendations: string[],
    nutritionRecommendations: string[]
  ): void {
    this.categoriesSource.next(categories);
    this.activityRecommendationsSource.next(activityRecommendations);
    this.nutritionRecommendationsSource.next(nutritionRecommendations);
  }
}
