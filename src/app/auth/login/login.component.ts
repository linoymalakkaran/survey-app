import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../store/auth.actions';
import { environment } from '../../../environments/environment';
import { BootstrapAlert, BootstrapAlertService } from '../../@shared/modules/ng-bootstrap-alert/ng-bootstrap-alert';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './css/bootstrap.min.css',
    './css/animate.css',
    './login.component.scss',
    './css/responsive.css'
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  showMessages: any = {};
  errors: string[] = [];
  messages: string[] = [];
  submitted: boolean = false;
  rememberMe = false;
  loginForm: FormGroup;
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  appBasePath: string = environment.appBaseUrl;

  private storeSub: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private componentFactoryResolver: ComponentFactoryResolver,
    private bootstrapAlertService: BootstrapAlertService,
    private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.storeSub = this.store.select('auth').subscribe(authState => {
      setTimeout(() => this.isLoading = authState.loading, 500);
      this.error = authState.authError;
      if (this.error) {
        //alert(this.error);
        this.bootstrapAlertService.alert(new BootstrapAlert(this.error, "alert-danger"));
      }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  login() {
    this.errors = [];
    this.messages = [];
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    if (this.loginForm && this.loginForm.value) {
      if (this.isLoginMode) {
        this.store.dispatch(
          new AuthActions.LoginStart(
            {
              username: this.loginForm.value.userName,
              password: this.loginForm.value.password
            })
        );
      } else {
        this.store.dispatch(
          new AuthActions.SignupStart(
            {
              username: this.loginForm.value.userName,
              password: this.loginForm.value.password
            })
        );
      }
    }
    else
      return;
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }

  ngOnDestroy() {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

}
