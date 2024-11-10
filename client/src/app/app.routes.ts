import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { ScanComponent } from './views/scan/scan.component';
import { ExploreComponent } from './views/explore/explore.component';
import { CommunityComponent } from './views/community/community.component';
import { ResourcesComponent } from './views/resources/resources.component';
import { AccountComponent } from './views/account/account.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'explore', component: ExploreComponent },
  { path: 'scan', component: ScanComponent },
  { path: 'community', component: CommunityComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: 'account', component: AccountComponent },
];
