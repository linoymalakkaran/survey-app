import { Injectable } from '@angular/core';
import { from, of, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class LoaderService {
  isLoading = new Subject<boolean>();

  show() {
    this.isLoading.next(true);
  }

  hide() {
    //this.isLoading.next(false)
    //console.log("loader hide");
    setTimeout(() => {
      this.isLoading.next(false);
      //for temp fix
      var btn = document.getElementById('btnLoader');
      if (btn) {
        btn.click();
      }
    }, 600);
    of(this.isLoading).pipe(delay(500), takeUntil(of(this.isLoading.next(false))));

  }
}
