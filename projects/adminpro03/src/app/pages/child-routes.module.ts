import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from '../guards/admin.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartListComponent } from './chart-list/chart-list.component';
import { ProgressComponent } from './progress/progress.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './data/users/users.component';
import { HospitalsComponent } from './data/hospitals/hospitals.component';
import { DoctorsComponent } from './data/doctors/doctors.component';
import { DoctorComponent } from './data/doctor/doctor.component';
import { SearchComponent } from './search/search.component';

const childRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: { title: 'Dashboards' },
  },
  {
    path: 'progress',
    component: ProgressComponent,
    data: { title: 'Progress' },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: { title: 'My Profile' },
  },
  {
    path: 'charts',
    component: ChartListComponent,
    data: { title: 'Charts' },
  },
  {
    path: 'account-settings',
    component: AccountSettingsComponent,
    data: { title: 'Settings' },
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AdminGuard],
    data: { title: 'Users' },
  },
  {
    path: 'hospitals',
    component: HospitalsComponent,
    data: { title: 'Hospitals' },
  },
  {
    path: 'doctors',
    component: DoctorsComponent,
    data: { title: 'Doctors' },
  },
  {
    path: 'doctor/:id',
    component: DoctorComponent,
    data: { title: 'Doctor' },
  },
  {
    path: 'search/:term',
    component: SearchComponent,
    data: { title: 'Result of search...' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule],
})
export class ChildRoutesModule {}
