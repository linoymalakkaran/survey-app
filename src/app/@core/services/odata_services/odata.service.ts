import { Injectable, OnDestroy, OnInit } from "@angular/core";
import * as fromApp from '../../../store/app.reducer';
import { o, OHandler, OdataQuery } from 'odata';
import { environment } from '../../../../environments/environment';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../../@shared/modules/loader/loader.service';

@Injectable({ providedIn: 'root' })
export class OdataService implements OnDestroy {

  rootOdataUri: string = environment.rootOdataUrl;
  odataRoute: string = "odata";
  private storeSub: Subscription;
  private token: string;

  constructor(
    private store: Store<fromApp.AppState>,
    public loaderService: LoaderService
  ) {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      if (authState.user) {
        this.token = authState.user._token;
      }
    });
  }

  public async get(resource: string, query: OdataQuery): Promise<any> {
    try {
      let _oHandler = this.setAuthToken();
      return await _oHandler.get(`${this.odataRoute}/${resource}`).query(query);
    } catch (error) {
      console.log(`Error in odataServcie: ${error}`);
      return null;
    } finally {
      this.loaderService.hide();
    }
  }

  public async getRest(resource: string, query: OdataQuery): Promise<any> {
    try {
      let _oHandler = this.setAuthToken();
      return await _oHandler.get(resource).query(query);
    } catch (error) {
      console.log(`Error in odataServcie: ${error}`);
      return null;
    } finally {
      this.loaderService.hide();
    }
  }

  public async post(resource: string, body: any): Promise<any> {
    try {
      let _oHandler = this.setAuthToken();
      return await _oHandler.post(`${this.odataRoute}/${resource}`, body).query();
    } catch (error) {
      console.log(`Error in odataServcie: ${error}`);
      return null;
    } finally {
      this.loaderService.hide();
    }
  }

  public async postRest(resource: string, body: any): Promise<any> {
    try {
      let _oHandler = this.setAuthToken();
      return await _oHandler.post(resource, body).query();
    } catch (error) {
      console.log(`Error in odataServcie: ${error}`);
      return null;
    } finally {
      this.loaderService.hide();
    }
  }

  public async put(resource: string, body: any): Promise<any> {
    try {
      let _oHandler = this.setAuthToken();
      return _oHandler.put(`${this.odataRoute}/${resource}`, body).query();
    } catch (error) {
      console.log(`Error in odataServcie: ${error}`);
      return null;
    } finally {
      this.loaderService.hide();
    }
  }

  public async putRest(resource: string, body: any): Promise<any> {
    try {
      let _oHandler = this.setAuthToken();
      return _oHandler.put(resource, body).query();
    } catch (error) {
      console.log(`Error in odataServcie: ${error}`);
      return null;
    } finally {
      this.loaderService.hide();
    }
  }

  public async delete(resource: string, id: string): Promise<any> {
    try {
      let _oHandler = this.setAuthToken();
      return await _oHandler.delete(`${this.odataRoute}/${resource}('${id}')`).query();
    } catch (error) {
      console.log(`Error in odataServcie: ${error}`);
      return null;
    } finally {
      this.loaderService.hide();
    }
  }

  private setAuthToken() {
    this.loaderService.show();
    let _oHandler = o(this.rootOdataUri, {
      headers: new Headers({
        "Authorization": `bearer ${this.token}`,
      })
    });
    return _oHandler;
  }

  ngOnDestroy() {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
