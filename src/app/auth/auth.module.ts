import { RegisterService } from './../services/auth/register/register.service';
import { AuthGuardService } from './../services/security/auth-guard.service';
import { Company_setupComponent } from './company_setup/company_setup.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArchwizardModule } from 'angular-archwizard';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { VerifyPasswordComponent } from './verify-password/verify-password.component';
import { FeahterIconModule } from '../core/feather-icon/feather-icon.module';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: "login/",
        pathMatch: 'full'
      },
      {
        path: 'login',
        redirectTo: "login/",
        pathMatch: 'full'
      },
      {
        path: 'login/:id',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'company-setup',
        component: Company_setupComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'verify-password',
        redirectTo: "verify-password/",
        pathMatch: 'full'
      },
      {
        path: 'verify-password/:id',
        component: VerifyPasswordComponent,
        canActivate: [AuthGuardService]
      },
    ]
  },
]

@NgModule({
  declarations: [LoginComponent, RegisterComponent, AuthComponent, Company_setupComponent, VerifyPasswordComponent],
  imports: [
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ArchwizardModule,
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgxMaskModule.forRoot({ validation: true}), 
    SweetAlert2Module.forRoot(),
    FeahterIconModule,
  ],
  providers: [
    RegisterService,
  ]
})
export class AuthModule { }
