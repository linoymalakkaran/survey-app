import { NgModule } from '@angular/core';

import { UserData } from './data/users';
import { UserMockService } from './mock/users.mock.service';
import { RestDataModule } from './services/rest_services/rest-data.module';
import { ConfirmModalComponent } from './services/common_services/confirm.modal.service';
import { MapperService } from './services/common_services/mapper.service';
import { APP_BASE_HREF } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from '../@shared/modules/loader/loader.interceptor';
import { OdataSchemaService } from './services/odata_services/odata.service.schema';


//inject singleton services
const schemaService = new OdataSchemaService();
const mapperService = new MapperService(schemaService, false);

const DATA_SERVICES = [
  {
    provide: UserData,
    useClass: UserMockService
  },
];

export const NB_CORE_PROVIDERS = [
  ...RestDataModule.forRoot().providers,
  ...DATA_SERVICES,
];

@NgModule({
  imports: [
  ],
  exports: [
  ],
  declarations: [
    ConfirmModalComponent
  ],
  entryComponents: [
    ConfirmModalComponent
  ],
  schemas: [
  ],
  providers: [
    {
      provide: MapperService,
      useValue: mapperService
    },
    {
      provide: APP_BASE_HREF,
      useValue: window['base-href']
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
    ...NB_CORE_PROVIDERS,
  ]
})
export class CoreModule {
}
