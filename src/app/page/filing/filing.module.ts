import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FilingComponent } from './filing.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeahterIconModule } from '../../core/feather-icon/feather-icon.module';
import { NgbDateCustomParserFormatter } from '../dateformat';
import { ChangeLogViewComponent } from './change-log/change-log-view/change-log-view.component';
import { ChangeLogDetailComponent } from './change-log/change-log-detail/change-log-detail.component';
import { ChangeScheduleViewComponent } from './change-schedule/change-schedule-view/change-schedule-view.component';
import { ChangeScheduleDetailComponent } from './change-schedule/change-schedule-detail/change-schedule-detail.component';
import { LeaveDetailComponent } from './leave/leave-detail/leave-detail.component';
import { LeaveViewComponent } from './leave/leave-view/leave-view.component';
import { OfficialBusinessViewComponent } from './official-business/official-business-view/official-business-view.component';
import { OfficialBusinessDetailComponent } from './official-business/official-business-detail/official-business-detail.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { OvertimeDetailComponent } from './overtime/overtime-detail/overtime-detail.component';
import { OvertimeViewComponent } from './overtime/overtime-view/overtime-view.component';
import { OffsetViewComponent } from './offset/offset-view/offset-view.component';
import { OffsetDetailComponent } from './offset/offset-detail/offset-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { HomeModule } from '../dashboard/home.module';
import { RequestCoeDetailComponent } from './request-coe/request-coe-detail/request-coe-detail.component';
import { RequestCoeViewComponent } from './request-coe/request-coe-view/request-coe-view.component';

const routes: Routes = [
  {
    path: '',
    component: FilingComponent,
    children: [
      {
        path: 'change-log-view',
        component: ChangeLogViewComponent
      },
      {
        path: 'change-log-detail',
        redirectTo: "change-log-detail/",
        pathMatch: 'full'
      },
      {
        path: 'change-log-detail/:id',
        component: ChangeLogDetailComponent
      },
      {
        path: 'change-schedule-view',
        component: ChangeScheduleViewComponent
      },
      {
        path: 'change-schedule-detail',
        redirectTo: "change-schedule-detail/",
        pathMatch: 'full'
      },
      {
        path: 'change-schedule-detail/:id',
        component: ChangeScheduleDetailComponent
      },
      {
        path: 'leave-view',
        component: LeaveViewComponent
      },
      {
        path: 'leave-detail',
        redirectTo: "leave-detail/",
        pathMatch: 'full'
      },
      {
        path: 'leave-detail/:id',
        component: LeaveDetailComponent
      },
      {
        path: 'official-business-view',
        component: OfficialBusinessViewComponent
      },
      {
        path: 'official-business-detail',
        redirectTo: "official-business-detail/",
        pathMatch: 'full'
      },
      {
        path: 'official-business-detail/:id',
        component: OfficialBusinessDetailComponent
      },
      {
        path: 'overtime-view',
        component: OvertimeViewComponent
      },
      {
        path: 'overtime-detail',
        redirectTo: "overtime-detail/",
        pathMatch: 'full'
      },
      {
        path: 'overtime-detail/:id',
        component: OvertimeDetailComponent
      },
      {
        path: 'offset-view',
        component: OffsetViewComponent
      },
      {
        path: 'offset-detail',
        redirectTo: "offset-detail/",
        pathMatch: 'full'
      },
      {
        path: 'offset-detail/:id',
        component: OffsetDetailComponent
      },

      {
        path: 'request-coe-view',
        component: RequestCoeViewComponent
      },
      {
        path: 'request-coe-detail',
        redirectTo: "request-coe-detail/",
        pathMatch: 'full'
      },
      {
        path: 'request-coe-detail/:id',
        component: RequestCoeDetailComponent
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
    DataTablesModule,
    PerfectScrollbarModule,
    TimepickerModule.forRoot(), 
    HomeModule,
  ],
  declarations: [		
    FilingComponent,
    ChangeLogViewComponent,
    ChangeScheduleViewComponent,
    LeaveViewComponent,
    OfficialBusinessViewComponent,
    OvertimeViewComponent,
    OffsetViewComponent,
    RequestCoeDetailComponent,
    RequestCoeViewComponent,
   ],
  providers: [DecimalPipe, {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}],
})
export class FilingModule { }
