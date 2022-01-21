import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from './../components/components.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartListComponent } from './chart-list/chart-list.component';
import { PagesComponent } from './pages.component';
import { ProgressComponent } from './progress/progress.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './data/users/users.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ProgressComponent,
    ChartListComponent,
    PagesComponent,
    AccountSettingsComponent,
    ProfileComponent,
    UsersComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    CommonModule,
  ],
  exports: [
    DashboardComponent,
    ProgressComponent,
    ChartListComponent,
    PagesComponent,
    AccountSettingsComponent,
  ],
})
export class PagesModule {}
