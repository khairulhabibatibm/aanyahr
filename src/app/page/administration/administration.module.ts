import { ContributionsComponent } from './contributions/contributions.component';
import { PayrollRatesComponent } from './payroll-rates/payroll-rates.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllowanceDeductionDetailComponent } from './allowance-deduction/allowance-deduction-detail/allowance-deduction-detail.component';
import { AllowanceDeductionViewComponent } from './allowance-deduction/allowance-deduction-view/allowance-deduction-view.component';
import { HolidayDetailComponent } from './holiday/holiday-detail/holiday-detail.component';
import { HolidayViewComponent } from './holiday/holiday-view/holiday-view.component';
import { ShiftcodesDetailComponent } from './shiftcodes/shiftcodes-detail/shiftcodes-detail.component';
import { ShiftcodesViewComponent } from './shiftcodes/shiftcodes-view/shiftcodes-view.component';
import { SeriesCodeComponent } from './series-code/series-code.component';
import { DropdownSettingsComponent } from './dropdown-settings/dropdown-settings.component';
import { ApprovalProcessComponent } from './approval-process/approval-process.component';
import { ModuleAccessComponent } from './module-access/module-access.component';
import { BranchViewComponent } from './branch/branch-view/branch-view.component';
import { BranchDetailComponent } from './branch/branch-detail/branch-detail.component';
import { CompanyComponent } from './company/company.component';
import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AdministrationComponent } from './administration.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FeahterIconModule } from '../../core/feather-icon/feather-icon.module';
import { DataTablesModule } from 'angular-datatables';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { LeaveViewComponent } from './leave/leave-view/leave-view.component';
import { LeaveDetailComponent } from './leave/leave-detail/leave-detail.component';
import { ArchwizardModule } from 'angular-archwizard';
import { NgbDateCustomParserFormatter } from '../dateformat';
import { ShiftcodesperdayViewComponent } from './shiftcodesperday/shiftcodesperday-view/shiftcodesperday-view.component';
import { ShiftcodesperdayDetailComponent } from './shiftcodesperday/shiftcodesperday-detail/shiftcodesperday-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AdministrationComponent,
    children: [
      {
        path: '',
        redirectTo: 'company',
        pathMatch: 'full'
      },
      {
        path: 'company',
        component: CompanyComponent
      },
      {
        path: 'branch-view',
        component: BranchViewComponent
      },
      {
        path: 'branch-detail',
        redirectTo: "branch-detail/",
        pathMatch: 'full'
      },
      {
        path: 'branch-detail/:id',
        component: BranchDetailComponent
      },
      {
        path: 'module-access',
        component: ModuleAccessComponent
      },
      {
        path: 'approval-process',
        component: ApprovalProcessComponent
      },
      {
        path: 'dropdown-settings',
        component: DropdownSettingsComponent
      },
      {
        path: 'series-code',
        component: SeriesCodeComponent
      },
      {
        path: 'shiftcodes-view',
        component: ShiftcodesViewComponent
      },
      {
        path: 'shiftcodes-detail',
        redirectTo: "shiftcodes-detail/",
        pathMatch: 'full'
      },
      {
        path: 'shiftcodes-detail/:id',
        component: ShiftcodesDetailComponent
      },
      {
        path: 'holiday-view',
        component: HolidayViewComponent
      },
      {
        path: 'holiday-detail',
        redirectTo: "holiday-detail/",
        pathMatch: 'full'
      },
      {
        path: 'holiday-detail/:id',
        component: HolidayDetailComponent
      },
      {
        path: 'allowance-deduction-view',
        component: AllowanceDeductionViewComponent
      },
      {
        path: 'allowance-deduction-detail',
        redirectTo: "allowance-deduction-detail/",
        pathMatch: 'full'
      },
      {
        path: 'allowance-deduction-detail/:id',
        component: AllowanceDeductionDetailComponent
      },
      {
        path: 'payroll-rates',
        component: PayrollRatesComponent
      },
      {
        path: 'contributions',
        component: ContributionsComponent
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
        path: 'shiftcodesperday-view',
        component: ShiftcodesperdayViewComponent
      },
      {
        path: 'shiftcodesperday-detail',
        redirectTo: "shiftcodesperday-detail/",
        pathMatch: 'full'
      },
      {
        path: 'shiftcodesperday-detail/:id',
        component: ShiftcodesperdayDetailComponent
      },
    
    ]
  }
]


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxDatatableModule,
    NgSelectModule,
    SweetAlert2Module.forRoot(),
    SweetAlert2Module,
    SweetAlert2Module.forChild({ /* options */ }),
    FeahterIconModule,
    DataTablesModule,
    NgxMaskModule.forRoot({ validation: true}), 
    NgbModule,
    TimepickerModule.forRoot(), 
    PopoverModule.forRoot(),
    ArchwizardModule,
  ],
  providers: [DecimalPipe, {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}],
  declarations: [
    AdministrationComponent, 
    CompanyComponent, 
    ModuleAccessComponent,
    BranchViewComponent, 
    BranchDetailComponent,
    ApprovalProcessComponent,
    DropdownSettingsComponent,
    SeriesCodeComponent,
    ShiftcodesViewComponent,
    ShiftcodesDetailComponent,
    HolidayViewComponent,
    HolidayDetailComponent,
    AllowanceDeductionViewComponent,
    AllowanceDeductionDetailComponent,
    PayrollRatesComponent,
    ContributionsComponent,
    LeaveViewComponent,
    LeaveDetailComponent,
    ShiftcodesperdayViewComponent,
    ShiftcodesperdayDetailComponent,
  ]
})
export class AdministrationModule { }
