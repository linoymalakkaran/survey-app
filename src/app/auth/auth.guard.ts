import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AuthService } from './auth.service';
import * as fromApp from '../store/app.reducer';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
        return authState.user;
      }),
      map(user => {
        const isAuth = !!user;
        if (isAuth) {
          if (route.data.roles && !route.data.roles.some(r=> user.role.roleTypes.includes(r))) {
            // role not authorised so redirect to home page
            this.router.navigate(['/auth']);
            return false;
          }
          return true;
        }
        return this.router.createUrlTree(['/auth']);
      })
    );

  }

  canActivateChild(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.canActivate(route, state);
  }
}
