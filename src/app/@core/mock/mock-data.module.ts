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
export class MockDataModule {
  static forRoot(): ModuleWithProviders<any> {
    return <ModuleWithProviders<any>>{
      ngModule: MockDataModule,
      providers: [
        ...SERVICES,
      ],
    };
  }
}
