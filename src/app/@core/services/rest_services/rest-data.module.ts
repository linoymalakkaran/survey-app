import { NgModule, ModuleWithProviders,  } from '@angular/core';

const SERVICES = [
];

@NgModule({
  imports: [
  ],
  providers: [
    ...SERVICES,
  ],
  schemas: [
  ]
})
export class RestDataModule {
  static forRoot(): ModuleWithProviders<any> {
    return <ModuleWithProviders<any>>{
      ngModule: RestDataModule,
      providers: [
        ...SERVICES,
      ],
    };
  }
}
