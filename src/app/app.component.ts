
import { Component, HostListener } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { Store } from '@ngrx/store';
import * as AuthActions from './auth/store/auth.actions';
import * as fromApp from '../app/store/app.reducer';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import $ from "jquery";
import { environment } from '../environments/environment';

@Component({
  selector: 'survey-app',
  templateUrl: './app.component.html'
})
export class AppComponent {

  IsReloaded: string;
  possibleRedirectStrtUrls: string[] = ['/survey', '/auth'];

  constructor(
    private analytics: AnalyticsService,
    private store: Store<fromApp.AppState>,
    private router: Router,
    private activeRoute: ActivatedRoute) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (val.url && val.url === '/') {
          //sessionStorage.setItem("surveyNextRelodUrl", '/survey/list');
        } else {
          sessionStorage.setItem("surveyNextRelodUrl", val.url);
        }
      }
    });
  }

  RefreshPageHandler() {
    window.onbeforeunload = function(event) {
      // do some stuff here, like reloading your current state
      //this would work only if the user chooses not to leave the page
      sessionStorage.removeItem("IsReloaded");
      return "Refresh will cause unexpected behaviour. Do you still want to procceed???";
    };

    this.IsReloaded = sessionStorage.getItem("IsReloaded");
    if (this.IsReloaded == null) {
      sessionStorage.setItem("IsReloaded", "1");
      let partialUrl = sessionStorage.getItem("surveyNextRelodUrl");
      if (partialUrl === '/survey/list' && false) {
        this.store.dispatch(new AuthActions.AutoLogin());
      } else {
        this.store.dispatch(new AuthActions.AutoLoginWithOutRedirect());
        if (!partialUrl) {
          partialUrl = `/${environment.appHomeRelativePath}`;
        }
        let isValidUrl = this.possibleRedirectStrtUrls.filter((urlString) => partialUrl.startsWith(urlString));
        if (isValidUrl && isValidUrl.length > 0) {
          setTimeout(() => {
            if (window.location.href === `${window.location.origin}/${environment.appBaseUrl}/`) {
              this.router.navigateByUrl(partialUrl);
            } else {
              let url = `${window.location.origin}/${environment.appBaseUrl}`;
              customRedirect(url);
              //window.location.href = url;
            }
          }, 500);
        }
      }
    } else {
      this.store.dispatch(new AuthActions.AutoLogin());
    }
  }

  ngOnInit() {
    this.RefreshPageHandler();
    this.analytics.trackPageViews();
    setTimeout(() => {
      let spinnerElm = document.getElementById('nb-global-spinner');
      spinnerElm.style.display = "none";
    }, 500);
    // this.store.dispatch(new AuthActions.AutoLogin());
  }
}

function customRedirect(url) {
  let $a = $('<a href="#"></a>');
  $a.attr("href", url);
  $a[0].click();
}
