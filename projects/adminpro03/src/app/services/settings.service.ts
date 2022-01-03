import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private linkTheme = document.getElementById('theme');
  private links!: NodeListOf<Element>;

  constructor() {
    if (this.linkTheme) {
      const url =
        localStorage.getItem('theme') || './assets/css/colors/default-dark.css';
      this.linkTheme.setAttribute('href', url);
    }
  }

  changeTheme(theme: string) {
    if (this.linkTheme) {
      const url = `./assets/css/colors/${theme}.css`;
      this.linkTheme.setAttribute('href', url);
      localStorage.setItem('theme', url);
      this.checkCurrentTheme();
    }
  }

  checkCurrentTheme() {
    if (!this.links) {
      this.links = document.querySelectorAll('.selector');
    }
    if (this.links) {
      this.links.forEach((elem) => {
        elem.classList.remove('working');
        const btnTheme = elem.getAttribute('data-theme');
        const url = `./assets/css/colors/${btnTheme}.css`;

        if (this.linkTheme) {
          const currentTheme = this.linkTheme.getAttribute('href');
          if (url === currentTheme) {
            elem.classList.add('working');
          }
        }
      });
    }
  }
}
