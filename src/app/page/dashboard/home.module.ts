import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { RouterModule, Routes } from '@angular/router';
import { ChangeLogDetailComponent } from '../filing/change-log/change-log-detail/change-log-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeahterIconModule } from '../../core/feather-icon/feather-icon.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { NgbDatepickerModule, NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ChangeScheduleDetailComponent } from '../filing/change-schedule/change-schedule-detail/change-schedule-detail.component';
import { LeaveDetailComponent } from '../filing/leave/leave-detail/leave-detail.component';
import { OfficialBusinessDetailComponent } from '../filing/official-business/official-business-detail/official-business-detail.component';
import { OvertimeDetailComponent } from '../filing/overtime/overtime-detail/overtime-detail.component';
import { OffsetDetailComponent } from '../filing/offset/offset-detail/offset-detail.component';
import { FilterArrayPipe } from '../filterArray.pipe';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  // timeGridPlugin,
  // listPlugin,
  interactionPlugin
])

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  }
]

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
    TimepickerModule.forRoot(), 
    NgbDropdownModule,
    NgbDatepickerModule,
    FullCalendarModule,
  ],
  declarations: [
    HomeComponent,
    DashboardComponent,
    ChangeLogDetailComponent,
    ChangeScheduleDetailComponent,
    LeaveDetailComponent,
    OfficialBusinessDetailComponent,
    OvertimeDetailComponent,
    OffsetDetailComponent,
    FilterArrayPipe,
  ],
  exports: [
    ChangeLogDetailComponent,
    ChangeScheduleDetailComponent,
    LeaveDetailComponent,
    OfficialBusinessDetailComponent,
    OvertimeDetailComponent,
    OffsetDetailComponent,
  ]
})
export class HomeModule { }
