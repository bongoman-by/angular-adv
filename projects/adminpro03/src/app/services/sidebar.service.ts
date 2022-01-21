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
    {
      title: 'Data',
      icon: 'mdi mdi-folder-lock-open',
      submenu: [
        { title: 'Users', path: 'users' },
        { title: 'Doctors', path: 'doctors' },
        { title: 'Hospitals', path: 'hospitals' },
      ],
    },
  ];

  constructor() {}

  get getMenu() {
    return this.menu;
  }
}
