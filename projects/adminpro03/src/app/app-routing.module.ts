import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesRoutingModule } from './pages/pages-routing.module';
import { AuthRoutingModule } from './auth/auth-routing.module';

import { NoPageFoundComponent } from './no-page-found/no-page-found.component';

const routes: Routes = [
  { path: '**', component: NoPageFoundComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    PagesRoutingModule,
    AuthRoutingModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
