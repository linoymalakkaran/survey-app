import { Component, ViewChild } from '@angular/core';
import { FormApp } from '../../../@core/data/formapp';
import { NbWindowRef } from '@nebular/theme';


@Component({
    selector: 'survey-formbuilder',
    templateUrl: './form.preview.component.html',
    styleUrls: ['./form.preview.component.scss']
})

export class ServiceFormPreviewComponent {
    form: FormApp;
    constructor(protected windowRef: NbWindowRef) {
        
    }
}

