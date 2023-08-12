import { Hospital } from './hospital.model';

interface IDoctorUser {
  name: string;
  _id: string;
  image: string;
}

export class Doctor {
  constructor(
    public name: string,
    public _id?: string,
    public image?: string,
    public user?: IDoctorUser,
    public hospital?: Hospital[]
  ) {}
}
