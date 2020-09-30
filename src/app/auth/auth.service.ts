import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import * as fromApp from '../store/app.reducer';
import { Role } from './auth_models/role_model';
import * as AuthActions from './store/auth.actions';

@Injectable({providedIn: 'root'})
export class AuthService {
  private tokenExpirationTimer: any;
  private loggedUser: any;

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  autoLogin() {
    this.store.dispatch(new AuthActions.AutoLogin());
  }

  autoLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }

  logout(){
    this.store.dispatch(new AuthActions.Logout());
  }

  getUserRole$(): Observable<Role> {
    return this.store.select('auth').map((userState, index)=>{ 
      return userState.user.role;
    });
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

}
