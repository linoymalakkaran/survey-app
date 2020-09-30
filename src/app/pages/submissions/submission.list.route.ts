import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../../auth/auth.guard';
import { SubmissionListComponent } from './submission.list.component';

const routes: Routes = [
  {
    path: '',
    component: SubmissionListComponent,
    children: [
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: SubmissionListComponent,
        pathMatch: 'full'
      },
      // {
      //   path: '',
      //   redirectTo: 'list',
      //   pathMatch: 'prefix'
      // },
      // {
      //   path: '**',
      //   redirectTo: 'list',
      //   pathMatch: "prefix"
      // },
    ],
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
  schemas: [
  ]
})
export class FormSubmissionRoutingModule {
}
