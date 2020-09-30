import { Observable } from 'rxjs';

export interface User {
  name: string;
  picture: string;
}

export interface Contacts {
  name: string;
  type: string;
  address: string;
  phone : string;
}



export abstract class UserData {
  abstract getUsers(): Observable<User[]>;
  abstract getContacts(): Observable<Contacts[]>;
  
}
