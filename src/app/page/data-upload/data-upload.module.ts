import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataUploadComponent } from '../data-upload/data-upload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FeahterIconModule } from '../../core/feather-icon/feather-icon.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { UploaderComponent } from './uploader/uploader.component';

const routes: Routes = [
  {
    path: '',
    component: DataUploadComponent,
    children: [
      {
        path: '',
        redirectTo: 'data-upload',
        pathMatch: 'full'
      },
      {
        path: 'data-upload',
        component: UploaderComponent
      }
     ]
  }]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FeahterIconModule,
    NgSelectModule,
    DataTablesModule,
  ],
  declarations: [DataUploadComponent,
    UploaderComponent]
})
export class DataUploadModule { }
