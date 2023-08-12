interface IHospitalUser {
  name: string;
  _id: string;
  image: string;
}

export class Hospital {
  constructor(
    public name: string,
    public _id?: string,
    public user?: IHospitalUser,
    public image?: string
  ) {}
}
