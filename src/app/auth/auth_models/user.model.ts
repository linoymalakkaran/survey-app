import { environment } from '../../../environments/environment';
import { Role } from "./role_model";

export class User {
  constructor(
    public userId: string,
    public email: string,
    public companyName: string,
    public _token: string,
    public _tokenExpirationDate: Date,
    public password: string,
    public confirmPassword: string,
    public role: Role,
    public fullName: string,
    public expiresIn: Number,
    public image?: string,
    public redirect?: Boolean
  ) {
    this.image = `${environment.appBaseUrl}/assets/images/noimage.png`;
    this.redirect = true;
    this.expiresIn = 36000;
  }

  get tokenExpirationDate(){
    return this._tokenExpirationDate;
  }

  set tokenExpirationDate(tokenExpirationDate: Date){
     this._tokenExpirationDate = tokenExpirationDate;
  }

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}
