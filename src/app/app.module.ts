
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { AuthCoreModule } from './auth.core.module';
import * as fromApp from './store/app.reducer';
import { AuthEffects } from './auth/store/auth.effects';
import { SharedModule } from './@shared/shared.module';

import {
  NbMenuModule,
  NbSidebarModule,
} from '@nebular/theme';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

/**
 * Import the Custom component.
 */
import FormioHappinessSurvey from '../app/custom_components/happiness_survey_component/index';
Formio.use(FormioHappinessSurvey);

import FormioStarRating from '../app/custom_components/star_rating/index';
Formio.use(FormioStarRating);

// import FormioChekMatrix from '../app/custom_components/check_matrix/index';
// Formio.use(FormioChekMatrix);

@NgModule({
  schemas: [
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ThemeModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    CoreModule,
    NgbModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot(),
    AuthCoreModule,
    SharedModule
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
  ],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { };
