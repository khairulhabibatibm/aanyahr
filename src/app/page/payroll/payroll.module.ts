import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { PayrollComponent } from './payroll.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FeahterIconModule } from '../../core/feather-icon/feather-icon.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { NgbDateCustomParserFormatter } from '../dateformat';
import { LoansViewComponent } from './loans/loans-view/loans-view.component';
import { LoansDetailComponent } from './loans/loans-detail/loans-detail.component';
import { GovernmentContributionComponent } from './government-contribution/government-contribution.component';
import { PayrollGenerationViewComponent } from './payroll-generation/payroll-generation-view/payroll-generation-view.component';
import { PayrollGenerationDetailComponent } from './payroll-generation/payroll-generation-detail/payroll-generation-detail.component';
import { ArchwizardModule } from 'angular-archwizard';

const routes: Routes = [
  {
    path: '',
    component: PayrollComponent,
    children: [
      {
        path: 'loans-view',
        component: LoansViewComponent
      },
      {
        path: 'loans-detail',
        redirectTo: "loans-detail/",
        pathMatch: 'full'
      },
      {
        path: 'loans-detail/:id',
        component: LoansDetailComponent
      },
      {
        path: 'government-contribution',
        component: GovernmentContributionComponent
      },
      {
        path: 'payroll-generation-view',
        component: PayrollGenerationViewComponent
      },
      {
        path: 'payroll-generation-detail',
        redirectTo: "payroll-generation-detail/",
        pathMatch: 'full'
      },
      {
        path: 'payroll-generation-detail/:id',
        component: PayrollGenerationDetailComponent
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
    ArchwizardModule,
  ],
  declarations: [
    PayrollComponent,
    LoansViewComponent,
    LoansDetailComponent,
    GovernmentContributionComponent,
    PayrollGenerationDetailComponent,
    PayrollGenerationViewComponent,

  ],
  providers: [DecimalPipe, {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}],
})
export class PayrollModule { }
