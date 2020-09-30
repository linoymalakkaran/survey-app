import { User } from '../auth_models/user.model';
import * as AuthActions from './auth.actions';
import DummyRole, { Role, RoleName } from '../auth_models/role_model';

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.AUTHENTICATE_SUCCESS:
      const user = new User(
        action.payload.userId,
        action.payload.email,
        action.payload.companyName,
        action.payload.token,
        action.payload._tokenExpirationDate,
        "",
        "",
        action.payload.role,
        action.payload.fullName,
        action.payload.expiresIn,
        action.payload.image,
        action.payload.redirect
      );
      return {
        ...state,
        authError: null,
        user: user,
        loading: false
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      };
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return {
        ...state,
        authError: null,
        loading: true
      };
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false
      };
    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        authError: null
      };
    default:
      return state;
  }
}
