import { TokenInterceptorService } from './services/security/token-interceptor.service';
import { DashboardComponent } from './page/dashboard/dashboard/dashboard.component';
import { LayoutModule } from './layout/layout.module';
import { RegisterService } from './services/auth/register/register.service';
import { AuthGuardService } from './services/security/auth-guard.service';
import { LoginService } from './services/auth/login/login.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';


import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MenuListService } from './services/security/menu-list.service';
import { TenantMasterService } from './services/TenantMasterService/tenantMaster.service';
import { MasterTemplateService } from './services/MasterTemplateService/masterTemplate.service';
import { PermissionManagementService } from './services/PermissionManagementService/permissionManagement.service';
import { TenantDefaultService } from './services/TenantDefaultService/tenantDefault.service';
import { BranchManagementService } from './services/BranchManagementService/branchManagement.service';
import { AccountManagementService } from './services/AccountManagementService/accountManagement.service';
import { UserManagementService } from './services/UserManagementService/userManagement.service';
import { HolidayManagementService } from './services/HolidayManagementService/holidayManagement.service';
import { PayrollRatesManagementService } from './services/PayrollRatesManagementService/payrollRatesManagement.service';
import { ShiftcodeManagementService } from './services/ShiftCodeManagementService/shiftcodeManagement.service';
import { LeaveManagementService } from './services/LeaveManagementService/leaveManagement.service';
import { EmployeeCategoryManagementService } from './services/EmployeeCategoryManagementService/employeeCategoryManagement.service';
import { AttendanceManagementService } from './services/AttendanceManagementService/attendanceManagement.service';
import { DataUploadManagementService } from './services/DataUploadManagementService/dataUploadManagement.service';
import { FilingManagementService } from './services/FilingManagementService/filingManagement.service';
import { FileManagerService } from './services/FileManagerService/fileManager.service';
import { TimekeepingManagementService } from './services/TimekeepingManagementService/timekeepingManagement.service';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { NgSelectModule } from '@ng-select/ng-select';
import { LogService } from './services/LogService/log.service';
import { PayrollManagementService } from './services/PayrollManagementService/payrollManagement.service';
import { ReportManagementService } from './services/ReportManagementService/reportManagement.service';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  // timeGridPlugin,
  // listPlugin,
  interactionPlugin
])

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  decimal: ",",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: "."
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LayoutModule,
    CommonModule,
    FullCalendarModule,
    NgSelectModule,
    CurrencyMaskModule,
  ],
  providers: [
    DecimalPipe,
    LoginService,
    AuthGuardService,
    RegisterService,
    MenuListService,
    TenantMasterService,
    MasterTemplateService,
    PermissionManagementService,
    TenantDefaultService,
    BranchManagementService,
    AccountManagementService,
    UserManagementService,
    HolidayManagementService,
    PayrollRatesManagementService,
    ShiftcodeManagementService,
    LeaveManagementService,
    EmployeeCategoryManagementService,
    AttendanceManagementService,
    DataUploadManagementService,
    FilingManagementService,
    FileManagerService,
    TimekeepingManagementService,
    PayrollManagementService,
    LogService,
    ReportManagementService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
