import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { of, from, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import * as AuthActions from './auth.actions';
import { User } from '../auth_models/user.model';
import { AuthService } from '../auth.service';
import DefaultAuthData, { Role, RoleName } from '../auth_models/role_model';

export interface AuthResponse {
  token: string;
  isAdminUser: string;
}

const handleAuthentication = (userData: User) => {
  const expirationDate = new Date(new Date().getTime() + + (userData.expiresIn ? userData.expiresIn : 1) * 1000);
  userData.tokenExpirationDate = expirationDate;
  localStorage.setItem('userData', JSON.stringify(userData));
  return new AuthActions.AuthenticateSuccess(userData);
};

const handleError = (errorRes: any) => {
  //let errorMessage = 'An unknown error occurred!';
  let errorMessage = 'UnAuthorized, Please verify your credentials';
  if (errorRes.message && typeof (errorRes.message) === 'string') {
    switch (errorRes.message) {
      case 'USER_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
      case 'Unauthorized':
        errorMessage = 'UnAuthorized, Please verify your credentials';
        break;
      case 'UserNotInTheRole':
        errorMessage = 'UnAuthorized, Please login as admin user';
        break;
    }
    return of(new AuthActions.AuthenticateFail(errorMessage));
  } else {
    if (!errorRes.error || !errorRes.error.error) {
      return of(new AuthActions.AuthenticateFail(errorMessage));
    }
  }
};

@Injectable({providedIn: 'root'})
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return from(isAuthenticated())
        // this.http
        //     .post<AuthResponseData>(
        //       environment.authSignupUrl,
        //       {
        //         email: signupAction.payload.email,
        //         password: signupAction.payload.password,
        //         returnSecureToken: true
        //       }
        //     )
        .pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+DefaultAuthData.TokenExpirationTime * 1000);
          }),
          map(resData => {
            const user = new User(
              signupAction.payload.username,
              signupAction.payload.username,
              signupAction.payload.username,
              resData.token,
              null,
              "",
              "",
              DefaultAuthData.GetUserRole(RoleName.Admin),
              signupAction.payload.username,
              DefaultAuthData.TokenExpirationTime(),
              null);
            return handleAuthentication(user);
          }),
          catchError(errorRes => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      let headers = {
        withCredentials: true,
        headers: { UCode: 'a', CCode: 'a' },
      };
      return this.http.post<AuthResponse>(environment.authLoginUrl,
        {
          username: authData.payload.username,
          password: authData.payload.password
        },
        headers
      )
        .pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+DefaultAuthData.TokenExpirationTime() * 1000);
          }),
          map(resData => {
            if (resData.isAdminUser === 'false') {
              throw new Error('UserNotInTheRole');
            } else {
              let userDetails = parseJwt(resData.token);
              const user = new User(
                authData.payload.username,
                authData.payload.username,
                userDetails.CompanyName,
                resData.token,
                null,
                "",
                "",
                (resData.isAdminUser === 'true' ? DefaultAuthData.GetUserRole(RoleName.Admin) : null),
                userDetails.UserName,
                null,
                null);
              return handleAuthentication(user);
            }
          }),
          catchError(errorRes => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/survey/list']);
      }
    })
  );

  
  @Effect()
  autoLoginWithOutRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN_WITHOUT_REDIRECT),
    map(() => {
      const userData: User = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        const loadedUesrData = new User(
          userData.userId,
          userData.email,
          userData.companyName,
          userData._token,
          new Date(userData._tokenExpirationDate),
          "",
          "",
          userData.role,
          userData.fullName,
          userData.expiresIn,
          null
        );
        loadedUesrData.redirect =false;

        if (loadedUesrData.token) {
          const expirationDuration =
            new Date(loadedUesrData.tokenExpirationDate).getTime() -
            new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);
          return handleAuthentication(loadedUesrData);
        }
        return { type: 'DUMMY' };
      }
      else {
        return { type: 'DUMMY' };
      }
    })
  );


  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: User = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        const loadedUesrData = new User(
          userData.userId,
          userData.email,
          userData.companyName,
          userData._token,
          new Date(userData._tokenExpirationDate),
          "",
          "",
          userData.role,
          userData.fullName,
          userData.expiresIn,
          null
        );

        if (loadedUesrData.token) {
          const expirationDuration =
            new Date(loadedUesrData.tokenExpirationDate).getTime() -
            new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);
          return handleAuthentication(loadedUesrData);
        }
        return { type: 'DUMMY' };
      }
      else {
        return { type: 'DUMMY' };
      }
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );
}

const isAuthenticated = () => new Promise<AuthResponse>(resolve => {
  setTimeout(() => {
    const autResponse: AuthResponse = <AuthResponse>{
      token: 'abcd',
      isAdminUser: 'true',
      expiresIn: DefaultAuthData.TokenExpirationTime()
    };
    resolve(autResponse);
  }, 800);
});


function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};
