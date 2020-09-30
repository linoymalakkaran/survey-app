import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {  NgModule } from '@angular/core';
import { AuthGuard } from './auth/auth.guard';
import { RoleName } from './auth/auth_models/role_model';


const routes: Routes = [
  {
    path: 'survey',
    loadChildren: () => import('../app/pages/pages.module')
      .then(m => m.PagesModule),
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    data: { roles: [RoleName.Owner] }
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module')
      .then(m => m.AuthModule),
    runGuardsAndResolvers: 'always',
  },
  // {
  //   path: '',
  //   redirectTo: 'survey',
  //   pathMatch: 'full'
  // },
  // {
  //   path: '**',
  //   redirectTo: 'survey',
  //   pathMatch: "full"
  // },
];

const config: ExtraOptions = {
  useHash: false,
  // onSameUrlNavigation: 'ignore',
  onSameUrlNavigation: 'reload',
  //enableTracing: true,
  preloadingStrategy: PreloadAllModules
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
  schemas: [
  ],
  providers: [
    //AuthGuard
  ],
})
export class AppRoutingModule {
}
