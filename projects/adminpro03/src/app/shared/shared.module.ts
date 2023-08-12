import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PipesModule } from '../pipes/pipes.module';

import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [BreadcrumbsComponent, SidebarComponent, HeaderComponent],
  imports: [CommonModule, RouterModule, PipesModule, FormsModule],
  exports: [BreadcrumbsComponent, SidebarComponent, HeaderComponent],
})
export class SharedModule {}
