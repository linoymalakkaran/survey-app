import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { map, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import * as AuthActions from '../../../auth/store/auth.actions';
import { User } from '../../../auth/auth_models/user.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: User;
  logoImageUrl: string = `${environment.appBaseUrl}/assets/images/mg-logo.svg`;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [{ title: 'Log out' }];
  private storeSub: Subscription;

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    //private UserMockService: UserData,
    private route: Router,
    private breakpointService: NbMediaBreakpointsService,
    private store: Store<fromApp.AppState>) {
  }

  async ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.user = authState.user;
    });

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    this.menuService.onItemClick().subscribe((event) => {
      this.onItemSelection(event.item.title);
    })
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');

    return false;
  }

  navigateHome() {
    //this.menuService.navigateHome();
    this.route.navigate(['/survey/list']);
    return false;
  }

  onItemSelection(item) {
    if (item == "Log out") {
      this.store.dispatch(
        new AuthActions.Logout()
      );
    }
  }

  ngOnDestroy() {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
