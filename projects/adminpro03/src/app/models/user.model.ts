import { environment } from '../../environments/environment';

export class User {
  constructor(
    public name: string,
    public email: string,
    public password?: string,
    public image?: string,
    public google?: boolean,
    public role?: string,
    public uid?: string
  ) {}

  get imageUrl() {
    if (this.google) {
      return this.image;
    } else {
      if (this.image) {
        return `${environment.base_url}/upload/users/${this.image}`;
      } else {
        return `${environment.base_url}/upload/users/image-not-found.png`;
      }
    }
  }
}
