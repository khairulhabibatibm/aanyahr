import { AdministrationComponent } from './page/administration/administration.component';
import { EmployeeComponent } from './page/employee/employee.component';
import { AuthGuardService } from './services/security/auth-guard.service';
import { BaseComponent } from './layout/base/base.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './page/profile/profile.component';
import { TimekeepingComponent } from './page/timekeeping/timekeeping.component';
import { FilingComponent } from './page/filing/filing.component';
import { HomeComponent } from './page/dashboard/home.component';
import { ManagementComponent } from './page/management/management.component';
import { DataUploadComponent } from './page/data-upload/data-upload.component';
import { PayrollComponent } from './page/payroll/payroll.component';
import { ReportsComponent } from './page/reports/reports.component';


const routes: Routes = [
  {
    path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'layout', component: BaseComponent, canActivate: [AuthGuardService],
    children: [
      // {
      //   path: '', component: DashboardComponent
      // },
      {
        path: '', component: HomeComponent, loadChildren: () => import('./page/dashboard/home.module').then(m => m.HomeModule)
        //path: 'dashboard', component: DashboardComponent,
      },
      {
        path: 'dashboard', component: HomeComponent, loadChildren: () => import('./page/dashboard/home.module').then(m => m.HomeModule)
        //path: 'dashboard', component: DashboardComponent,
      },
      {
        path: 'administration', component: AdministrationComponent, loadChildren: () => import('./page/administration/administration.module').then(m => m.AdministrationModule)
      },
      {
        path: 'profile', component: ProfileComponent, loadChildren: () => import('./page/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'employee', component: EmployeeComponent, loadChildren: () => import('./page/employee/employee.module').then(m => m.EmployeeModule)
      },
      {
        path: 'timekeeping', component: TimekeepingComponent, loadChildren: () => import('./page/timekeeping/timekeeping.module').then(m => m.TimekeepingModule)
      },
      {
        path: 'filing', component: FilingComponent, loadChildren: () => import('./page/filing/filing.module').then(m => m.FilingModule)
      },
      {
        path: 'management', component: ManagementComponent, loadChildren: () => import('./page/management/management.module').then(m => m.ManagementModule)
      },
      {
        path: 'payroll', component: PayrollComponent, loadChildren: () => import('./page/payroll/payroll.module').then(m => m.PayrollModule)
      },
      {
        path: 'data-upload', component: DataUploadComponent, loadChildren: () => import('./page/data-upload/data-upload.module').then(m => m.DataUploadModule)
      },
      {
        path: 'report', component: ReportsComponent, loadChildren: () => import('./page/reports/reports.module').then(m => m.ReportsModule)
      },
    ],
  },
  //{ path:'**', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
