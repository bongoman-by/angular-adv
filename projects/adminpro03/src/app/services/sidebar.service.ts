import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private menu = [
    {
      title: 'Dashboards',
      icon: 'mdi mdi-gauge',
      submenu: [
        { title: 'Main', path: '/' },
        { title: 'Progress', path: 'progress' },
        { title: 'Charts', path: 'charts' },
      ],
    },
  ];

  constructor() {}

  get getMenu() {
    return this.menu;
  }
}
