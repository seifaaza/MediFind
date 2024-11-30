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
import { GuidesComponent } from './views/guides/guides.component';
import { EventsComponent } from './views/events/events.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AchievementsComponent } from './views/profile/profile-aside/achievements/achievements.component';
import { TrackerComponent } from './views/profile/profile-aside/tracker/tracker.component';
import { ProfileInfoComponent } from './views/profile/profile-aside/profile-info/profile-info.component';
import { MedicinesGuideComponent } from './views/guides/categories/medicines-guide/medicines-guide.component';
import { PreventiveCareGuideComponent } from './views/guides/categories/preventive-care-guide/preventive-care-guide.component';
import { NutritionGuideComponent } from './views/guides/categories/nutrition-guide/nutrition-guide.component';
import { FitnessGuideComponent } from './views/guides/categories/fitness-guide/fitness-guide.component';
import { MentalWellBeingGuideComponent } from './views/guides/categories/mental-well-being-guide/mental-well-being-guide.component';
import { AddictionGuideComponent } from './views/guides/categories/addiction-guide/addiction-guide.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'learn-more', component: LearnMoreComponent },
  { path: 'medicines', component: MedicinesComponent },
  { path: 'community', component: CommunityComponent },
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
    path: 'guides',
    children: [
      { path: '', component: GuidesComponent },
      { path: 'medicines', component: MedicinesGuideComponent },
      { path: 'preventive-care', component: PreventiveCareGuideComponent },
      { path: 'nutrition', component: NutritionGuideComponent },
      { path: 'fitness', component: FitnessGuideComponent },
      { path: 'mental-well-being', component: MentalWellBeingGuideComponent },
      { path: 'addiction', component: AddictionGuideComponent },
    ],
  },
  { path: 'create-profile', component: CreateProfileComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', component: NotFoundComponent },
];
