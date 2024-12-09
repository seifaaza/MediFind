import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { ErrorComponent } from './views/error/error.component';
import { LearnMoreComponent } from './views/learn-more/learn-more.component';
import { SignInComponent } from './views/account/sign-in/sign-in.component';
import { SignUpComponent } from './views/account/sign-up/sign-up.component';
import { CreateProfileComponent } from './views/profile/create-profile/create-profile.component';
import { ProfileComponent } from './views/profile/profile.component';
import { MedicinesComponent } from './views/medicines/medicines.component';
import { CommunityComponent } from './views/community/community.component';
import { EventsComponent } from './views/events/events.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AchievementsComponent } from './views/profile/profile-aside/achievements/achievements.component';
import { TrackerComponent } from './views/profile/profile-aside/tracker/tracker.component';
import { ProfileInfoComponent } from './views/profile/profile-aside/profile-info/profile-info.component';
import { TopicsComponent } from './views/topics/topics.component';
import { HealthEssentialsComponent } from './views/topics/categories/health-essentials/health-essentials.component';
import { PreventiveCareComponent } from './views/topics/categories/preventive-care/preventive-care.component';
import { NutritionComponent } from './views/topics/categories/nutrition/nutrition.component';
import { FitnessComponent } from './views/topics/categories/fitness/fitness.component';
import { MentalWellBeingComponent } from './views/topics/categories/mental-well-being/mental-well-being.component';
import { AddictionComponent } from './views/topics/categories/addiction/addiction.component';
import { HealthEssentialsItemComponent } from './views/topics/categories/health-essentials/health-essentials-item/health-essentials-item.component';
import { PostItemComponent } from './views/community/post-item/post-item.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'learn-more', component: LearnMoreComponent },
  { path: 'medicines', component: MedicinesComponent },

  {
    path: 'community',
    children: [
      { path: '', component: CommunityComponent },
      { path: 'post/:id', component: PostItemComponent },
    ],
  },

  { path: 'events', component: EventsComponent },
  {
    path: 'auth',
    children: [
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'sign-in', component: SignInComponent },
    ],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ProfileInfoComponent },
      { path: 'achievements', component: AchievementsComponent },
      { path: 'tracker', component: TrackerComponent },
    ],
  },
  {
    path: 'topics',
    children: [
      { path: '', component: TopicsComponent },
      { path: 'health-essentials', component: HealthEssentialsComponent },
      {
        path: 'health-essentials/:id',
        component: HealthEssentialsItemComponent,
      },
      { path: 'preventive-care', component: PreventiveCareComponent },
      { path: 'nutrition', component: NutritionComponent },
      { path: 'fitness', component: FitnessComponent },
      { path: 'mental-well-being', component: MentalWellBeingComponent },
      { path: 'addiction', component: AddictionComponent },
    ],
  },
  { path: 'create-profile', component: CreateProfileComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', component: NotFoundComponent },
];
