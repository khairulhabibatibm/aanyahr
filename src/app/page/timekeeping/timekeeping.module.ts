import { Component, NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { TimekeepingComponent } from './timekeeping.component';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceLogComponent } from './attendance-log/attendance-log.component';
import { EmployeeAttendanceComponent } from './employee-attendance/employee-attendance.component';
import { OvertimeRenderComponent } from './overtime-render/overtime-render.component';
import { LeaveEntitlementComponent } from './leave-entitlement/leave-entitlement.component';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../dateformat';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeahterIconModule } from '../../core/feather-icon/feather-icon.module';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ArchwizardModule } from 'angular-archwizard';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TimekeepingGenerationViewComponent } from './timekeeping-generation/timekeeping-generation-view/timekeeping-generation-view.component';
import { TimekeepingGenerationDetailComponent } from './timekeeping-generation/timekeeping-generation-detail/timekeeping-generation-detail.component';

const routes: Routes = [
  {
    path: '',
    component: TimekeepingComponent,
    children: [
      {
        path: 'attendance-log',
        component: AttendanceLogComponent,
        children: [{
          path: 'file-upload',
          component: FileUploadComponent
        }]
      },
      {
        path: 'employee-attendance',
        component: EmployeeAttendanceComponent
      },
      {
        path: 'leave-entitlement',
        component: LeaveEntitlementComponent
      },
      {
        path: 'overtime-render',
        component: OvertimeRenderComponent
      },
      {
        path: 'timekeeping-generation-view',
        component: TimekeepingGenerationViewComponent
      },
      {
        path: 'timekeeping-generation-detail',
        redirectTo: "timekeeping-generation-detail/",
        pathMatch: 'full'
      },
      {
        path: 'timekeeping-generation-detail/:id',
        component: TimekeepingGenerationDetailComponent
      },
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
    PopoverModule.forRoot(),
    NgbModule,
    FeahterIconModule,
    ArchwizardModule,
    DataTablesModule,
    PerfectScrollbarModule,
    TimepickerModule.forRoot(),
  ],
  declarations: [
    TimekeepingComponent,
    AttendanceLogComponent,
    EmployeeAttendanceComponent,
    LeaveEntitlementComponent,
    OvertimeRenderComponent,
    FileUploadComponent,
    TimekeepingGenerationViewComponent,
    TimekeepingGenerationDetailComponent,
  ],
  providers: [DecimalPipe, {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}],
})
export class TimekeepingModule { }
