import { of as observableOf,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Contacts,  UserData } from '../data/users';

@Injectable({providedIn: 'root'})
export class UserMockService extends UserData {
  getContacts(): Observable<Contacts[]> {
    throw new Error("Method not implemented.");
  }

  private time: Date = new Date;

  private users = {
    nick: { name: 'Sreedev Melethil', picture: 'assets/images/noimage.png' },
    eva: { name: 'Anand Ramesh', picture: 'assets/images/eva.png' },
    jack: { name: 'Ajay Anand', picture: 'assets/images/jack.png' },
    lee: { name: 'Yashobanta Pa', picture: 'assets/images/lee.png' },
    alan: { name: 'Agyat', picture: 'assets/images/alan.png' },
    kate: { name: 'Farkad Hamoud', picture: 'assets/images/kate.png' },
  };
  private types = {
    mobile: 'mobile',
    home: 'home',
    work: 'work',
  };
 
 
  getUsers(): Observable<any> {
    return observableOf(this.users);
  }

}
