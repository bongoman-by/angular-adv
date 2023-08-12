import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private _menu: any[] = [];

  constructor() {}

  get getMenu() {
    return this._menu;
  }

  public setMenu(menu: any[]) {
    this._menu = menu;
  }
}
