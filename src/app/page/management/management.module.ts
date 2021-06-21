import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ManagementComponent } from './management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FeahterIconModule } from '../../core/feather-icon/feather-icon.module';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { ApprovalComponent } from './approval/approval.component';
import { NgbDateCustomParserFormatter } from '../dateformat';
import { KeysPipe } from '../keys.pipe';
import { HomeModule } from '../dashboard/home.module';
import { AttendanceComponent } from './attendance/attendance.component';
import { ScheduleComponent } from './schedule/schedule.component';
const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    children: [
      {
        path: 'approval',
        component: ApprovalComponent
      },
      {
        path: 'attendance',
        component: AttendanceComponent
      },
      {
        path: 'schedule',
        component: ScheduleComponent
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
    NgbModule,
    DataTablesModule,
    HomeModule
  ],
  declarations: [
    ManagementComponent,
    ApprovalComponent,
    AttendanceComponent,
    ScheduleComponent,
    KeysPipe,
    
  ],
  providers: [DecimalPipe, {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}],
})
export class ManagementModule { }
