import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { ReportComponent } from './report/report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FeahterIconModule } from '../../core/feather-icon/feather-icon.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChildReportComponent } from './child-report/child-report.component';

const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    children: [
      {
        path: '',
        redirectTo: 'report',
        pathMatch: 'full'
      },
      {
        path: 'report',
        component: ReportComponent
      },
      {
        path: 'child-report',
        component: ChildReportComponent
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
    NgbModule,
    DataTablesModule,
  ],
  exports: [
    ChildReportComponent
  ],
  declarations: [ReportsComponent,
    ReportComponent,
    ChildReportComponent,]
})
export class ReportsModule { }
