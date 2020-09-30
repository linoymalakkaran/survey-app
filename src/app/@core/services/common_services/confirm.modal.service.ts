import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
 
@Component({
  selector: 'app-confirm-modal',
  template: `<div class="modal-body text-center">
              <p>{{prompt}}</p>
              <button type="button" class="btn btn-primary" style="margin-right: 2em;" (click)="confirm()" >Yes</button>
              <button type="button" class="btn btn-secondary" (click)="decline()" >No</button>
            </div>`
})
export class ConfirmModalComponent implements OnInit {
 
  prompt: any;
  constructor(public bsModalRef: BsModalRef) { }
 
  ngOnInit() {
  }
 
  confirm() {
    if (this.bsModalRef.content.callback != null){
      this.bsModalRef.content.callback('yes');
      this.bsModalRef.hide();
    }
  }
 
  decline() {
    if (this.bsModalRef.content.callback != null){
      this.bsModalRef.content.callback('no');
      this.bsModalRef.hide();
    }
  }
}